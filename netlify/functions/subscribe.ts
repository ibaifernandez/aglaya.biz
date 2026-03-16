import type { Handler } from "@netlify/functions";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET ?? "";
const FROM_EMAIL = "AGLAYA <hola@aglaya.biz>";
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "hola@aglaya.biz";

/* ── helpers ─────────────────────────────────── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    // Dev / staging without a secret — skip verification
    console.warn("[subscribe] TURNSTILE_SECRET not set — skipping verification");
    return true;
  }
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    }
  );
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function sendViaResend(email: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[subscribe] RESEND_API_KEY not set — skipping send");
    return;
  }

  // 1. Add contact to Resend Contacts audience
  // Replace RESEND_AUDIENCE_ID env var once you create an audience in Resend
  const audienceId = process.env.RESEND_AUDIENCE_ID ?? "";
  if (audienceId) {
    await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  }

  // 2. Send confirmation email to subscriber
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: "You're in. AGLAYA is coming.",
      html: `
        <div style="background:#080808;color:#f5f5f5;font-family:Inter,sans-serif;padding:48px 32px;max-width:560px;margin:0 auto;">
          <p style="color:#e8003d;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 24px">AGLAYA</p>
          <h1 style="font-size:32px;font-weight:900;margin:0 0 16px;line-height:1.1;">You're on<br/>the list.</h1>
          <p style="color:rgba(245,245,245,.6);margin:0 0 32px;line-height:1.6;">
            We'll let you know the moment the new AGLAYA is live.<br/>
            Something uncomfortable is coming.
          </p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:0 0 24px"/>
          <p style="font-size:12px;color:rgba(245,245,245,.35);">
            © AGLAYA · <a href="https://aglaya.biz" style="color:#e8003d;text-decoration:none;">aglaya.biz</a>
          </p>
        </div>
      `,
    }),
  });

  // 3. Notify the agency of a new lead
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      subject: `🔥 New lead: ${email}`,
      html: `<p>New subscription on aglaya.biz: <strong>${email}</strong></p>`,
    }),
  });
}

/* ── handler ─────────────────────────────────── */

export const handler: Handler = async (event) => {
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

  let body: { email?: string; token?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const token = body.token ?? "";

  // Validate email
  if (!email || !isValidEmail(email)) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: "Invalid email address" }),
    };
  }

  // Verify Turnstile
  const ip = event.headers["x-forwarded-for"] ?? event.headers["x-nf-client-connection-ip"] ?? "";
  const turnstileOk = await verifyTurnstile(token, ip);
  if (!turnstileOk) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: "Bot verification failed" }),
    };
  }

  // Send via Resend
  try {
    await sendViaResend(email);
  } catch (err) {
    console.error("[subscribe] Resend error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to process subscription" }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
};
