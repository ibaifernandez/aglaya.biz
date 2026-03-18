import type { Handler } from "@netlify/functions";

/* ── helpers ─────────────────────────────────── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      subject: "Signal received — AGLAYA",
      html: `<!DOCTYPE html>
<html lang="en">
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
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(245,245,245,.3);">The Uncomfortable AI·gency</p>
        </td></tr>

        <!-- HERO -->
        <tr><td style="background:#080808;padding:40px 40px 32px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;color:#e8003d;letter-spacing:.2em;">// TRANSMISSION RECEIVED</p>
          <h1 style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:32px;font-weight:900;line-height:1.05;color:#f5f5f5;letter-spacing:-.5px;">
            We've got<br>your signal.
          </h1>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:rgba(245,245,245,.6);">
            ${name ? `${name},` : 'Hey there,'}<br><br>
            Your message landed. A human — not a bot — will read it, think about it, and get back to you within <span style="color:#f5f5f5;font-weight:700;">24 hours</span>.<br><br>
            No templates. No auto-replies. Just real thinking.
          </p>
        </td></tr>

        <!-- MESSAGE BLOCK -->
        <tr><td style="background:#080808;padding:0 40px 40px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#0d0d0d;border:1px solid #1f1f1f;border-left:3px solid #e8003d;padding:20px 24px;">
              <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,245,245,.3);">// YOUR MESSAGE</p>
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
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:rgba(245,245,245,.15);letter-spacing:.1em;">AI executes. Humans strategize.</p>
        </td></tr>

        <!-- RED BOTTOM BAR -->
        <tr><td style="background:#e8003d;height:3px;font-size:0;">&nbsp;</td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
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
