import type { Handler } from "@netlify/functions";
import {
  getContactGroupIds,
  upsertMailerLiteSubscriber,
} from "./_mailerlite";
import {
  buildConsentFields,
  CRM_ATTENTION_OUTCOMES,
  deriveCrmSource,
  dispatchLeadToCrm,
  type CrmDispatchResult,
} from "./_crm";
import { captureFunctionException, initFunctionSentry } from "./_sentry";
import { computeDiagnostic, tierToIcpStatus } from "../../src/lib/diagnostic/engine";
import type {
  DiagnosticAnswers,
  Pain,
  PeopleBucket,
  HoursBucket,
  ToolBucket,
  FreqBucket,
  TeamBucket,
  SpendBucket,
  TriedBucket,
  VolumeBucket,
} from "../../src/lib/diagnostic/types";

/* ── helpers ─────────────────────────────────── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLang(lang?: string): "en" | "es" | "pt" {
  if (lang === "es" || lang === "pt") return lang;
  return "en";
}

const PAINS = ["reports", "leads", "invoices", "copypaste", "admin", "data"];
const PEOPLE = ["p1", "p2_3", "p4_10", "p10plus"];
const HOURS = ["h_lt5", "h5_15", "h15_40", "h40plus"];
const TOOLS = ["none", "spreadsheet", "offshelf", "patchwork"];
const FREQS = ["rarely", "monthly", "weekly", "constantly"];
const TEAMS = ["t_solo", "t2_10", "t11_50", "t50plus"];
const SPENDS = ["s_lt100", "s100_500", "s500_2k", "s2kplus"];
const TRIEDS = ["nothing", "hired", "zapier", "tool"];
const VOLS = ["v1", "v2", "v3", "v4"];

// Validate + narrow the client answers. Returns null if anything is off.
function parseAnswers(raw: Record<string, unknown>): DiagnosticAnswers | null {
  const areasRaw = Array.isArray(raw.areas) ? raw.areas.map(String) : [];
  const areas = areasRaw.filter((a) => PAINS.includes(a));
  const worst = String(raw.worst ?? "");
  const people = String(raw.people ?? "");
  const hours = String(raw.hours ?? "");
  const tool = String(raw.tool ?? "");
  const frequency = String(raw.frequency ?? "");
  const team = String(raw.team ?? "");
  const spend = String(raw.spend ?? "");
  const tried = String(raw.tried ?? "");
  const volume = String(raw.volume ?? "");
  if (
    areas.length === 0 ||
    !PAINS.includes(worst) ||
    !areas.includes(worst) ||
    !PEOPLE.includes(people) ||
    !HOURS.includes(hours) ||
    !TOOLS.includes(tool) ||
    !FREQS.includes(frequency) ||
    !TEAMS.includes(team) ||
    !SPENDS.includes(spend) ||
    !TRIEDS.includes(tried) ||
    !VOLS.includes(volume)
  ) {
    return null;
  }
  return {
    areas: areas as Pain[],
    worst: worst as Pain,
    people: people as PeopleBucket,
    hours: hours as HoursBucket,
    tool: tool as ToolBucket,
    frequency: frequency as FreqBucket,
    team: team as TeamBucket,
    spend: spend as SpendBucket,
    tried: tried as TriedBucket,
    volume: volume as VolumeBucket,
  };
}

function fmtUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

async function sendInternalNotification(
  email: string,
  lang: "en" | "es" | "pt",
  answers: DiagnosticAnswers,
  report: ReturnType<typeof computeDiagnostic>,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const notifyTo = process.env.NOTIFY_EMAIL ?? "info@aglaya.biz";
  if (!apiKey) {
    console.warn("[diagnostic] RESEND_API_KEY not set — skipping internal notification");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AGLAYA <info@aglaya.biz>",
      to: [notifyTo],
      subject: `🧮 ROI Diagnostic [${lang.toUpperCase()}] · ${report.tier.toUpperCase()}: ${email}`,
      html: `
        <h2>New ROI Diagnostic — aglaya.biz</h2>
        <p><strong>Language:</strong> ${lang.toUpperCase()}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tier:</strong> ${report.tier}</p>
        <p><strong>Labor bleed (range):</strong> ${fmtUsd(report.laborBleed.low)}–${fmtUsd(report.laborBleed.high)}/yr</p>
        <p><strong>Tool spend (range):</strong> ${fmtUsd(report.saasSpend.low)}–${fmtUsd(report.saasSpend.high)}/yr</p>
        <p><strong>Equivalent:</strong> ~${report.equivalent.hoursPerYear} hrs/yr (~${report.equivalent.fullTimers} FTE)</p>
        <h3>Answers</h3>
        <ul>
          <li>Areas: ${answers.areas.join(", ")}</li>
          <li>Worst: ${answers.worst}</li>
          <li>People: ${answers.people}</li>
          <li>Hours/person/wk: ${answers.hours}</li>
          <li>Runs on: ${answers.tool}</li>
          <li>Breaks/slips: ${answers.frequency}</li>
          <li>Team: ${answers.team}</li>
          <li>Monthly tool spend: ${answers.spend}</li>
          <li>Already tried: ${answers.tried}</li>
          <li>Worst-area volume: ${answers.volume}</li>
        </ul>
      `,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend notification failed (${res.status}): ${errBody}`);
  }
}

function buildDiagnosticNotes(
  answers: DiagnosticAnswers,
  report: ReturnType<typeof computeDiagnostic>,
): string {
  return [
    `[ROI Diagnostic · tier=${report.tier}`,
    `bleed≈${fmtUsd(report.laborBleedMid)}/yr (${fmtUsd(report.laborBleed.low)}-${fmtUsd(report.laborBleed.high)})`,
    `areas=${answers.areas.join("/")}`,
    `worst=${answers.worst}`,
    `people=${answers.people}`,
    `hours=${answers.hours}`,
    `tool=${answers.tool}`,
    `freq=${answers.frequency}`,
    `team=${answers.team}`,
    `spend=${answers.spend}`,
    `tried=${answers.tried}`,
    `vol=${answers.volume}]`,
  ].join(", ");
}

/* ── handler ─────────────────────────────────── */

export const handler: Handler = async (event) => {
  initFunctionSentry();

  const headers = {
    "Access-Control-Allow-Origin": "https://aglaya.biz",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let body: {
    email?: string;
    lang?: string;
    answers?: Record<string, unknown>;
    privacy_policy_version?: string;
    company_honeypot?: string;
  };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const lang = normalizeLang(body.lang);
  const privacyPolicyVersion = (body.privacy_policy_version ?? "").trim();
  const honeypot = (body.company_honeypot ?? "").trim();

  // Honeypot filled → bot; silent 200.
  if (honeypot) {
    console.log("[diagnostic] Honeypot triggered — silent drop");
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (!email || !isValidEmail(email)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: "Invalid email" }) };
  }

  const answers = parseAnswers(body.answers ?? {});
  if (!answers) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: "Invalid answers" }) };
  }

  // Recompute server-side — never trust a client-supplied number.
  const report = computeDiagnostic(answers);
  const icpStatus = tierToIcpStatus(report.tier);

  try {
    const rawIp =
      event.headers["x-forwarded-for"] ?? event.headers["x-nf-client-connection-ip"] ?? "";
    const ip = rawIp.split(",")[0].trim();

    // Accountability record (GDPR Art. 5(2)) — see contact.ts for rationale.
    const privacyDisplayedAt = new Date().toISOString();
    console.log(
      JSON.stringify({
        event: "aglaya_form_privacy_notice",
        privacy_policy_version: privacyPolicyVersion || "unknown",
        privacy_policy_displayed_at: privacyDisplayedAt,
        ip,
        email,
        source: deriveCrmSource(icpStatus) ?? "aglaya-roi-diagnostic",
      }),
    );

    // Canary: Resend internal notification stays await-blocking.
    await sendInternalNotification(email, lang, answers, report);

    // Best-effort downstream syncs.
    const crmSource = deriveCrmSource(icpStatus);
    // Lead score from tier (qualified=80, borderline=55, open-channel=20).
    const leadScore = report.tier === "qualified" ? 80 : report.tier === "borderline" ? 55 : 20;
    const crmNotes = buildDiagnosticNotes(answers, report);
    const mailerLiteGroups = getContactGroupIds(icpStatus);

    const mailerLitePromise = (async () => {
      if (mailerLiteGroups.length === 0) return;
      const synced = await upsertMailerLiteSubscriber({
        email,
        ip,
        language: lang,
        groups: mailerLiteGroups,
        entry_point: "roi_diagnostic",
        service_interest: "roi_audit",
      });
      if (!synced) console.warn("[diagnostic] MailerLite sync skipped or failed");
    })().catch(async (err) => {
      console.error("[diagnostic] MailerLite sync error:", err);
      await captureFunctionException(err, {
        functionName: "diagnostic",
        tags: { stage: "mailerlite-sync", icp_status: icpStatus },
      });
    });

    const crmDispatchPromise: Promise<CrmDispatchResult | null> = crmSource
      ? dispatchLeadToCrm({
          email,
          source: crmSource,
          leadScore,
          notes: crmNotes,
          language: lang,
          landing_source: "roi_diagnostic",
          privacyPolicyVersion: privacyPolicyVersion || undefined,
          privacyPolicyDisplayedAt: privacyDisplayedAt,
          consent: buildConsentFields({
            email,
            purpose: "roi-audit",
            legalBasis: "legitimate-interest",
            regime: "cl-21719",
            source: "aglayabiz-roi-diagnostic",
            noticeVersion: privacyPolicyVersion || "unknown",
            grantedAt: privacyDisplayedAt,
          }),
        })
      : Promise.resolve(null);

    const [, crmSettled] = await Promise.allSettled([mailerLitePromise, crmDispatchPromise]);

    if (crmSettled.status === "fulfilled" && crmSettled.value) {
      const result = crmSettled.value;
      if (CRM_ATTENTION_OUTCOMES.has(result.outcome)) {
        const errorMsg =
          result.outcome === "anomaly"
            ? "CRM dispatch anomaly: 2xx with excluded:false and deal_id:null"
            : `CRM dispatch ${result.outcome}: ${result.error ?? "unknown"}`;
        await captureFunctionException(new Error(errorMsg), {
          functionName: "diagnostic",
          tags: {
            stage: "crm-dispatch",
            crm_outcome: result.outcome,
            crm_status: String(result.status ?? "none"),
            crm_source: crmSource ?? "none",
            icp_status: icpStatus,
          },
          extra: { tier: report.tier, lead_score: leadScore },
        });
      }
    } else if (crmSettled.status === "rejected") {
      console.error("[diagnostic] CRM dispatch promise rejected:", crmSettled.reason);
      await captureFunctionException(crmSettled.reason, {
        functionName: "diagnostic",
        tags: { stage: "crm-dispatch", crm_outcome: "rejected", icp_status: icpStatus },
      });
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, tier: report.tier }) };
  } catch (err) {
    console.error("[diagnostic] Error:", err);
    await captureFunctionException(err, {
      functionName: "diagnostic",
      tags: { icp_status: icpStatus, tier: report.tier },
    });
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to process diagnostic" }) };
  }
};
