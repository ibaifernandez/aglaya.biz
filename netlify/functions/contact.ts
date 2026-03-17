import type { Handler } from "@netlify/functions";

/* ── helpers ─────────────────────────────────── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET ?? "";
  if (!secret) {
    console.warn("[contact] TURNSTILE_SECRET not set — skipping verification");
    return true;
  }
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    }
  );
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function sendContactEmail(name: string, email: string, message: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const fromEmail = "AGLAYA <info@aglaya.biz>";
  const notifyTo = process.env.NOTIFY_EMAIL ?? "info@aglaya.biz";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — skipping send");
    return;
  }

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
      subject: "Thanks for reaching out to AGLAYA",
      html: `
        <div style="background:#080808;color:#f5f5f5;font-family:sans-serif;padding:48px 32px;max-width:560px;margin:0 auto;">
          <p style="color:#e8003d;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 24px">AGLAYA</p>
          <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;line-height:1.1;">We've received your message.</h1>
          <p style="color:rgba(245,245,245,.6);margin:0 0 32px;line-height:1.6;">
            Hello ${name || 'there'},<br/><br/>
            Thanks for contacting AGLAYA. Our team will review your message and get back to you shortly.
          </p>
          <div style="background:rgba(255,255,255,0.03); padding: 24px; border: 1px solid rgba(255,255,255,0.08);">
            <p style="font-size:12px; color:rgba(245,245,245,0.4); margin:0 0 8px;">Your message:</p>
            <p style="font-size:14px; margin:0; line-height:1.5;">${message}</p>
          </div>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:32px 0 24px"/>
          <p style="font-size:12px;color:rgba(245,245,245,.35);">
            © AGLAYA · <a href="https://aglaya.biz" style="color:#e8003d;text-decoration:none;">aglaya.biz</a>
          </p>
        </div>
      `,
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
      subject: `📩 New Contact: ${name || email}`,
      html: `
        <h2>New lead from aglaya.biz</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
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

  let body: { name?: string; email?: string; message?: string; token?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();
  const token = body.token ?? "";

  if (!email || !isValidEmail(email) || !message) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: "Invalid input" }),
    };
  }

  const ip = event.headers["x-forwarded-for"] ?? event.headers["x-nf-client-connection-ip"] ?? "";
  const turnstileOk = await verifyTurnstile(token, ip);
  
  if (!turnstileOk) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ error: "Bot verification failed" }),
    };
  }

  try {
    await sendContactEmail(name, email, message);
  } catch (err) {
    console.error("[contact] Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to process message" }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
};
