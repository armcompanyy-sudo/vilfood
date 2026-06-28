// Vercel serverless function: emails contact-form submissions to info@vilfood.am
// via Resend. Requires the RESEND_API_KEY env var (set in Vercel project settings).
// Optional MAIL_FROM env var to send from a verified domain address; otherwise it
// uses Resend's onboarding sender (works for delivering to your own inbox).

const TO = "info@vilfood.am";

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel parses JSON bodies for Node functions; fall back to manual parse.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const name = (body?.name ?? "").toString().trim();
  const email = (body?.email ?? "").toString().trim();
  const message = (body?.message ?? "").toString().trim();

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 4) {
    return res.status(400).json({ error: "Invalid form data" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const from = process.env.MAIL_FROM || "Vilfood Website <onboarding@resend.dev>";

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [TO],
        reply_to: email,
        subject: `New message from ${name} — vilfood.am`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html:
          `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
          `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
          `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!resp.ok) {
      console.error("Resend error", resp.status, await resp.text());
      return res.status(502).json({ error: "Failed to send" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact function error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
