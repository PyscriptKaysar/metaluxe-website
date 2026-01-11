type Env = {
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  RESEND_TO: string;
  TURNSTILE_SECRET_KEY: string;
};

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
  turnstileToken?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isNonEmptyString(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_TO || !env.TURNSTILE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server not configured." }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid content type." }),
      { status: 415, headers: { "content-type": "application/json" } }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON payload." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const { name, phone = "", email, company = "", message, turnstileToken } = payload;

  if (!isNonEmptyString(name, 100) || !isNonEmptyString(email, 200) || !isNonEmptyString(message, 2000)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing or invalid fields." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (!isNonEmptyString(turnstileToken, 2000)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Please complete the verification." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const clientIp =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";

  const turnstileBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: turnstileToken,
  });
  if (clientIp) {
    turnstileBody.set("remoteip", clientIp);
  }

  const turnstileResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: turnstileBody.toString(),
    }
  );

  if (!turnstileResponse.ok) {
    return new Response(
      JSON.stringify({ ok: false, error: "Verification failed." }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  const turnstileResult = (await turnstileResponse.json()) as { success?: boolean };
  if (!turnstileResult.success) {
    return new Response(
      JSON.stringify({ ok: false, error: "Verification failed." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const rows = [
    ["Name", name!],
    ["Email", email!],
    phone.trim() ? ["Phone", phone] : null,
    company.trim() ? ["Company", company] : null,
  ].filter(Boolean) as Array<[string, string]>;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h2 style="margin: 0 0 12px;">New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 6px 0; width: 120px; color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: .04em;">${label}</td>
            <td style="padding: 6px 0; font-size: 14px; color: #111827;">${escapeHtml(value)}</td>
          </tr>
        `
          )
          .join("")}
      </table>
      <div style="border-top: 1px solid #E5E7EB; padding-top: 12px;">
        <div style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px;">Message</div>
        <div style="font-size: 14px; line-height: 1.5;">${escapeHtml(message!).replace(/\n/g, "<br/>")}</div>
      </div>
    </div>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.RESEND_TO],
      subject: "New Metaluxe website inquiry",
      reply_to: email,
      html,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(
      JSON.stringify({ ok: false, error: "Email send failed." }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
