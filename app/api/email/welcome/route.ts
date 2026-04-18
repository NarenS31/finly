import { NextResponse } from "next/server";
import { Resend } from "resend";
import { welcomeEmailHtml, welcomeEmailText } from "@/lib/email/welcome-email";

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY not configured" }, { status: 501 });
  }

  const body = (await req.json()) as { to?: string; name?: string };
  if (!body.to || !body.name) {
    return NextResponse.json({ error: "Missing to or name" }, { status: 400 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const resend = new Resend(key);
  // TODO: Replace with your verified sender domain before production
  // e.g. from: 'Finly <hello@yourverifieddomain.com>'
  const { error } = await resend.emails.send({
    from: "Finly <onboarding@resend.dev>",
    to: body.to,
    subject: "You just took the first step",
    html: welcomeEmailHtml({ name: body.name, ctaUrl: `${site}/learn` }),
    text: welcomeEmailText({ name: body.name, ctaUrl: `${site}/learn` }),
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
