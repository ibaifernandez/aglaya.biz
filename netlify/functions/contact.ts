import type { Handler } from "@netlify/functions";
import { getContactGroupIds, upsertMailerLiteSubscriber } from "./_mailerlite";
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

    try {
      await syncContactToMailerLite({
        email,
        ip,
        name,
        company,
        icpStatus,
        icpPrimaryState,
        entryPoint,
        serviceInterest,
      });
    } catch (err) {
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
