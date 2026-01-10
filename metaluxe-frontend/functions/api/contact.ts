type Env = {
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  RESEND_TO: string;
};

type ContactPayload = {
  name?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
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

  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RESEND_TO) {
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

  const { name, phone, company = "", service = "", message } = payload;

  if (!isNonEmptyString(name, 100) || !isNonEmptyString(phone, 50) || !isNonEmptyString(message, 2000)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing or invalid fields." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name!)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone!)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company || "-")}</p>
    <p><strong>Service:</strong> ${escapeHtml(service || "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message!).replace(/\n/g, "<br/>")}</p>
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
