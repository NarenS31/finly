import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, reason } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safeReason = escapeHtml(String(reason ?? "feedback"));
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, "<br>");

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Finly Contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? "your@email.com"],
        replyTo: safeEmail,
        subject: `[Finly Contact] ${safeReason}: message from ${safeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #0a0a0a;">New message from Finly contact form</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name</td><td style="padding: 8px 0; font-size: 14px;">${safeName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Reason</td><td style="padding: 8px 0; font-size: 14px;">${safeReason}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">${safeMessage}</p>
          </div>
        `,
      });
    } else {
      console.log("Contact form submission:", {
        name: safeName,
        email: safeEmail,
        reason: safeReason,
        message: safeMessage,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
