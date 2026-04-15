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

function buildConfirmationHtml(
  name: string,
  message: string,
  lang: "en" | "es" | "pt",
  roiAuditLead: boolean,
): string {
  const copy = {
    en: {
      tagline: "The Uncomfortable AI·gency",
      eyebrow: roiAuditLead ? "// ROI AUDIT REQUEST RECEIVED" : "// TRANSMISSION RECEIVED",
      headline: roiAuditLead ? "Your audit request<br>is in." : "We've got<br>your signal.",
      greeting: name ? `${name},` : "Hey there,",
      body1: roiAuditLead
        ? "We received your request for an ROI Audit. This engagement is scoped manually because the investment changes according to the operational surface area we need to inspect."
        : `Your message landed. A human — not a bot — will read it, think about it, and get back to you within <span style="color:#f5f5f5;font-weight:700;">24 hours</span>.`,
      body2: roiAuditLead
        ? `Our team will review the signal, define whether the audit is justified, and come back within <span style="color:#f5f5f5;font-weight:700;">24 hours</span> with the next step.`
        : "No templates. No auto-replies. Just real thinking.",
      body3: roiAuditLead ? "No fixed-price theatre. No generic proposal. Just a scoped diagnosis if the math supports it." : "",
      msgLabel: roiAuditLead ? "// AUDIT CONTEXT" : "// YOUR MESSAGE",
      footerTagline: roiAuditLead ? "Variable scope. Fixed honesty." : "AI executes. Humans strategize.",
    },
    es: {
      tagline: "La Agenc·IA Incómoda",
      eyebrow: roiAuditLead ? "// SOLICITUD DE ROI AUDIT RECIBIDA" : "// TRANSMISIÓN RECIBIDA",
      headline: roiAuditLead ? "Tu solicitud de auditoría<br>ha llegado." : "Tu mensaje<br>ha llegado.",
      greeting: name ? `${name},` : "Hola,",
      body1: roiAuditLead
        ? "Hemos recibido tu solicitud de ROI Audit. Este engagement se calibra manualmente porque la inversión varía según la superficie operativa que haya que auditar."
        : `Tu mensaje está en nuestras manos. Una persona —no un bot— lo leerá, lo pensará y te responderá en <span style="color:#f5f5f5;font-weight:700;">menos de 24 horas</span>.`,
      body2: roiAuditLead
        ? `Nuestro equipo revisará la señal, determinará si la auditoría está justificada y volverá a ti en <span style="color:#f5f5f5;font-weight:700;">menos de 24 horas</span> con el siguiente paso.`
        : "Sin plantillas. Sin respuestas automáticas. Solo pensamiento real.",
      body3: roiAuditLead ? "Sin teatro de precio fijo. Sin propuesta genérica. Solo un diagnóstico acotado si la matemática lo justifica." : "",
      msgLabel: roiAuditLead ? "// CONTEXTO DE AUDITORÍA" : "// TU MENSAJE",
      footerTagline: roiAuditLead ? "Alcance variable. Honestidad fija." : "La IA ejecuta. El humano estrategiza.",
    },
    pt: {
      tagline: "A Agência Desconfortável",
      eyebrow: roiAuditLead ? "// SOLICITAÇÃO DE ROI AUDIT RECEBIDA" : "// TRANSMISSÃO RECEBIDA",
      headline: roiAuditLead ? "Sua solicitação de auditoria<br>chegou." : "Recebemos<br>seu sinal.",
      greeting: name ? `${name},` : "Olá,",
      body1: roiAuditLead
        ? "Recebemos sua solicitação de ROI Audit. Esse engagement é calibrado manualmente porque o investimento varia de acordo com a superfície operacional que precisa ser auditada."
        : `Sua mensagem chegou até nós. Uma pessoa — não um bot — vai ler, pensar e responder em <span style="color:#f5f5f5;font-weight:700;">menos de 24 horas</span>.`,
      body2: roiAuditLead
        ? `Nossa equipe vai revisar o sinal, definir se a auditoria se justifica e voltar em <span style="color:#f5f5f5;font-weight:700;">menos de 24 horas</span> com o próximo passo.`
        : "Sem modelos. Sem respostas automáticas. Só pensamento real.",
      body3: roiAuditLead ? "Sem teatro de preço fixo. Sem proposta genérica. Apenas um diagnóstico delimitado se a matemática sustentar." : "",
      msgLabel: roiAuditLead ? "// CONTEXTO DA AUDITORIA" : "// SUA MENSAGEM",
      footerTagline: roiAuditLead ? "Escopo variável. Honestidade fixa." : "A IA executa. Humanos estrategizam.",
    },
  }[lang];

  const bodyBlocks = [copy.body1, copy.body2, copy.body3].filter(Boolean).join("<br><br>");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- RED TOP BAR -->
        <tr><td style="background:#e8003d;height:3px;font-size:0;">&nbsp;</td></tr>

        <!-- HEADER -->
        <tr><td style="background:#0d0d0d;padding:32px 40px 24px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#e8003d;">AGLAYA</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(245,245,245,.3);">${copy.tagline}</p>
        </td></tr>

        <!-- HERO -->
        <tr><td style="background:#080808;padding:40px 40px 32px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;color:#e8003d;letter-spacing:.2em;">${copy.eyebrow}</p>
          <h1 style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:32px;font-weight:900;line-height:1.05;color:#f5f5f5;letter-spacing:-.5px;">
            ${copy.headline}
          </h1>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:rgba(245,245,245,.6);">
            ${copy.greeting}<br><br>
            ${bodyBlocks}
          </p>
        </td></tr>

        <!-- MESSAGE BLOCK -->
        <tr><td style="background:#080808;padding:0 40px 40px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#0d0d0d;border:1px solid #1f1f1f;border-left:3px solid #e8003d;padding:20px 24px;">
              <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,245,245,.3);">${copy.msgLabel}</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:rgba(245,245,245,.75);">${message}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- DIVIDER -->
        <tr><td style="background:#080808;padding:0 40px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="border-top:1px solid #1a1a1a;font-size:0;">&nbsp;</td>
          </tr></table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#080808;padding:24px 40px 32px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,245,245,.25);">
            © AGLAYA ·
            <a href="https://aglaya.biz" style="color:#e8003d;text-decoration:none;">aglaya.biz</a>
          </p>
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:rgba(245,245,245,.15);letter-spacing:.1em;">${copy.footerTagline}</p>
        </td></tr>

        <!-- RED BOTTOM BAR -->
        <tr><td style="background:#e8003d;height:3px;font-size:0;">&nbsp;</td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendContactEmail(
  name: string,
  email: string,
  message: string,
  lang: "en" | "es" | "pt",
  company: string,
  inquiryType: string,
  website: string,
  entryPoint: string,
  serviceInterest: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const fromEmail = "AGLAYA <info@aglaya.biz>";
  const notifyTo = process.env.NOTIFY_EMAIL ?? "info@aglaya.biz";
  const roiAuditLead = isRoiAuditLead(inquiryType, entryPoint, serviceInterest);

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — skipping send");
    return;
  }

  const confirmSubject = roiAuditLead
    ? lang === "es"
      ? "Solicitud de ROI Audit recibida — AGLAYA"
      : lang === "pt"
        ? "Solicitação de ROI Audit recebida — AGLAYA"
        : "ROI Audit request received — AGLAYA"
    : lang === "es"
      ? "Señal recibida — AGLAYA"
      : lang === "pt"
        ? "Sinal recebido — AGLAYA"
        : "Signal received — AGLAYA";

  // 1. Send confirmation email to user
  const confirmRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      bcc: [notifyTo],
      subject: confirmSubject,
      html: buildConfirmationHtml(name, message, lang, roiAuditLead),
    }),
  });
  if (!confirmRes.ok) {
    const errBody = await confirmRes.text();
    throw new Error(`Resend confirmation email failed (${confirmRes.status}): ${errBody}`);
  }

  // 2. Notify the AI·gency
  const notifyRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyTo],
      subject: roiAuditLead
        ? `📩 ROI Audit Request [${lang.toUpperCase()}]: ${company || name || email}`
        : `📩 New Contact [${lang.toUpperCase()}]: ${company || name || email}`,
      html: `
        <h2>${roiAuditLead ? 'New ROI Audit request from aglaya.biz' : 'New lead from aglaya.biz'}</h2>
        <p><strong>Language:</strong> ${lang.toUpperCase()}</p>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Website:</strong> ${website || 'N/A'}</p>
        <p><strong>Inquiry Type:</strong> ${inquiryType || 'N/A'}</p>
        <p><strong>Entry Point:</strong> ${entryPoint || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${serviceInterest || 'N/A'}</p>
        <p><strong>Privacy Consent:</strong> Confirmed via form checkbox</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f4f4f4; padding: 20px;">${message}</div>
      `,
    }),
  });
  if (!notifyRes.ok) {
    const errBody = await notifyRes.text();
    throw new Error(`Resend notification email failed (${notifyRes.status}): ${errBody}`);
  }
}

async function syncContactToMailerLite({
  email,
  ip,
  name,
  company,
  icpStatus,
  icpPrimaryState,
}: {
  email: string;
  ip: string;
  name?: string;
  company?: string;
  icpStatus?: string;
  icpPrimaryState?: string;
}): Promise<void> {
  const groups = getContactGroupIds(icpStatus, icpPrimaryState);
  if (groups.length === 0) return;

  const synced = await upsertMailerLiteSubscriber({
    email,
    ip,
    name,
    company,
    groups,
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

    await sendContactEmail(
      name,
      email,
      message,
      lang,
      company,
      inquiryType,
      website,
      entryPoint,
      serviceInterest,
    );
    try {
      await syncContactToMailerLite({
        email,
        ip,
        name,
        company,
        icpStatus,
        icpPrimaryState,
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
