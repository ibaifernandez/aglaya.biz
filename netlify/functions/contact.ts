import type { Handler } from "@netlify/functions";
import { getContactGroupIds, upsertMailerLiteSubscriber } from "./_mailerlite";
import {
  buildCrmNotes,
  deriveCrmSource,
  deriveLeadScore,
  dispatchLeadToCrm,
  type CrmDispatchResult,
} from "./_crm";
import { captureFunctionException, initFunctionSentry } from "./_sentry";

/* ── helpers ─────────────────────────────────── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLang(lang?: string): "en" | "es" | "pt" {
  if (lang === "es" || lang === "pt") return lang;
  return "en";
}

function hasAcceptedConsent(value?: string | boolean): boolean {
  return value === true || value === "true" || value === "on";
}

function isRoiAuditLead(inquiryType: string, entryPoint: string, serviceInterest: string): boolean {
  return (
    inquiryType === "ROI_AUDIT_LEAD" ||
    entryPoint === "roi_audit" ||
    serviceInterest === "roi_audit"
  );
}

async function verifyHCaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET ?? "";
  if (!secret) {
    console.warn("[contact] HCAPTCHA_SECRET not set — skipping verification");
    return true;
  }
  const params: Record<string, string> = { secret, response: token };
  if (ip) params.remoteip = ip;
  const res = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
  console.log("[contact] hCaptcha result:", JSON.stringify(data));
  return data.success;
}

async function sendInternalNotification(
  name: string,
  email: string,
  message: string,
  lang: "en" | "es" | "pt",
  company: string,
  inquiryType: string,
  website: string,
  entryPoint: string,
  serviceInterest: string,
  icpStatus: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const notifyTo = process.env.NOTIFY_EMAIL ?? "info@aglaya.biz";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — skipping internal notification");
    return;
  }

  const roiAuditLead = isRoiAuditLead(inquiryType, entryPoint, serviceInterest);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AGLAYA <info@aglaya.biz>",
      to: [notifyTo],
      subject: roiAuditLead
        ? `📩 ROI Audit Request [${lang.toUpperCase()}]: ${company || name || email}`
        : `📩 New Contact [${lang.toUpperCase()}]: ${company || name || email}`,
      html: `
        <h2>${roiAuditLead ? "New ROI Audit request" : "New lead"} — aglaya.biz</h2>
        <p><strong>Language:</strong> ${lang.toUpperCase()}</p>
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Website:</strong> ${website || "N/A"}</p>
        <p><strong>ICP Status:</strong> ${icpStatus || "N/A"}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType || "N/A"}</p>
        <p><strong>Entry Point:</strong> ${entryPoint || "N/A"}</p>
        <p><strong>Service Interest:</strong> ${serviceInterest || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f4f4f4;padding:20px;">${message}</div>
      `,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend notification failed (${res.status}): ${errBody}`);
  }
}

async function syncContactToMailerLite({
  email,
  ip,
  name,
  company,
  icpStatus,
  icpPrimaryState,
  entryPoint,
  serviceInterest,
}: {
  email: string;
  ip: string;
  name?: string;
  company?: string;
  icpStatus?: string;
  icpPrimaryState?: string;
  entryPoint?: string;
  serviceInterest?: string;
}): Promise<void> {
  const groups = getContactGroupIds(icpStatus, icpPrimaryState);
  if (groups.length === 0) return;

  const synced = await upsertMailerLiteSubscriber({
    email,
    ip,
    name,
    company,
    groups,
    entry_point: entryPoint,
    service_interest: serviceInterest,
  });

  if (!synced) {
    console.warn("[contact] MailerLite sync skipped or failed");
  }
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
    name?: string;
    email?: string;
    message?: string;
    token?: string;
    lang?: string;
    company?: string;
    inquiry_type?: string;
    website?: string;
    entry_point?: string;
    service_interest?: string;
    icp_status?: string;
    icp_primary_state?: string;
    icp_signal_score?: string;
    manual_execution?: string;
    data_infrastructure?: string;
    growth_investment?: string;
    privacy_consent?: string | boolean;
    company_honeypot?: string;
  };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();
  const token = body.token ?? "";
  const lang = normalizeLang(body.lang);
  const company = (body.company ?? "").trim();
  const inquiryType = (body.inquiry_type ?? "").trim();
  const website = (body.website ?? "").trim();
  const entryPoint = (body.entry_point ?? "").trim();
  const serviceInterest = (body.service_interest ?? "").trim();
  const icpStatus = (body.icp_status ?? "").trim();
  const icpPrimaryState = (body.icp_primary_state ?? "").trim();
  const icpSignalScore = (body.icp_signal_score ?? "").trim();
  const manualExecution = (body.manual_execution ?? "").trim();
  const dataInfrastructure = (body.data_infrastructure ?? "").trim();
  const growthInvestment = (body.growth_investment ?? "").trim();
  const privacyConsent = hasAcceptedConsent(body.privacy_consent);
  const honeypot = (body.company_honeypot ?? "").trim();

  // Honeypot filled → bot; silent 200 to avoid fingerprinting
  if (honeypot) {
    console.log("[contact] Honeypot triggered — silent drop");
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (!email || !isValidEmail(email) || !message || !privacyConsent) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: privacyConsent ? "Invalid input" : "Consent required" }),
    };
  }

  try {
    const rawIp = event.headers["x-forwarded-for"] ?? event.headers["x-nf-client-connection-ip"] ?? "";
    const ip = rawIp.split(",")[0].trim();
    const captchaOk = await verifyHCaptcha(token, ip);

    if (!captchaOk) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: "Bot verification failed" }),
      };
    }

    // Canary: Resend internal notification stays `await`-blocking. If it
    // fails, we want to fail the request (so the operator notices the gap
    // between form-submission email and CRM panel).
    await sendInternalNotification(
      name,
      email,
      message,
      lang,
      company,
      inquiryType,
      website,
      entryPoint,
      serviceInterest,
      icpStatus,
    );

    // Best-effort downstream syncs. Both swallow their own errors and
    // surface them via Sentry below; neither bounces the visitor.
    const crmSource = deriveCrmSource(icpStatus);
    const leadScore = deriveLeadScore(icpSignalScore);
    const crmNotes = buildCrmNotes({
      message,
      icpStatus,
      icpPrimaryState,
      manualExecution,
      dataInfrastructure,
      growthInvestment,
      leadScore,
    });

    const mailerLitePromise = syncContactToMailerLite({
      email,
      ip,
      name,
      company,
      icpStatus,
      icpPrimaryState,
      entryPoint,
      serviceInterest,
    }).catch(async (err) => {
      console.error("[contact] MailerLite sync error:", err);
      await captureFunctionException(err, {
        functionName: "contact",
        tags: {
          stage: "mailerlite-sync",
          inquiry_type: inquiryType || "unknown",
          icp_status: icpStatus || "unknown",
        },
        extra: {
          entry_point: entryPoint || "direct",
          service_interest: serviceInterest || "general",
          has_company: Boolean(company),
          has_name: Boolean(name),
        },
      });
    });

    // Only dispatch to CRM if the form mapped to a known source. Forms
    // without ICP context (e.g., the general ContactForm) intentionally
    // do not land in the CRM via this path.
    const crmDispatchPromise: Promise<CrmDispatchResult | null> = crmSource
      ? dispatchLeadToCrm({
          email,
          source: crmSource,
          leadScore,
          name: name || undefined,
          company: company || undefined,
          notes: crmNotes ?? undefined,
          language: lang,
          // UTM/fbclid/landing_source pipeline not implemented yet; send nulls.
          // Tracked as a follow-up (separate PR).
        })
      : Promise.resolve(null);

    const [_mlSettled, crmSettled] = await Promise.allSettled([
      mailerLitePromise,
      crmDispatchPromise,
    ]);

    if (crmSettled.status === "fulfilled" && crmSettled.value) {
      const result = crmSettled.value;
      if (result.outcome === "failed") {
        await captureFunctionException(
          new Error(`CRM dispatch failed: ${result.error ?? "unknown"}`),
          {
            functionName: "contact",
            tags: {
              stage: "crm-dispatch",
              crm_outcome: result.outcome,
              crm_status: String(result.status ?? "none"),
              crm_source: crmSource ?? "none",
              inquiry_type: inquiryType || "unknown",
              icp_status: icpStatus || "unknown",
            },
            extra: {
              entry_point: entryPoint || "direct",
              service_interest: serviceInterest || "general",
              has_company: Boolean(company),
              has_name: Boolean(name),
              lead_score: leadScore,
            },
          },
        );
      }
    } else if (crmSettled.status === "rejected") {
      // dispatchLeadToCrm is designed to never throw; if we get here the
      // helper itself is misbehaving. Treat as a hard error and capture.
      console.error("[contact] CRM dispatch promise rejected:", crmSettled.reason);
      await captureFunctionException(crmSettled.reason, {
        functionName: "contact",
        tags: {
          stage: "crm-dispatch",
          crm_outcome: "rejected",
          crm_source: crmSource ?? "none",
          inquiry_type: inquiryType || "unknown",
          icp_status: icpStatus || "unknown",
        },
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("[contact] Error:", err);
    await captureFunctionException(err, {
      functionName: "contact",
      tags: {
        inquiry_type: inquiryType || "unknown",
        icp_status: icpStatus || "unknown",
        icp_primary_state: icpPrimaryState || "unknown",
      },
      extra: {
        entry_point: entryPoint || "direct",
        service_interest: serviceInterest || "general",
        has_company: Boolean(company),
        has_name: Boolean(name),
        has_message: Boolean(message),
      },
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to process message" }),
    };
  }
};
