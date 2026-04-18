import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = Deno.env.get("NEXT_PUBLIC_SITE_URL") ?? "https://finpath.app";

Deno.serve(async () => {
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), { status: 500 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, display_name, streak_current, last_active_date, email_notify_streak")
    .gte("streak_current", 2)
    .eq("email_notify_streak", true)
    .lt("last_active_date", today);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  for (const p of profiles ?? []) {
    const { data: authUser, error: userErr } = await admin.auth.admin.getUserById(p.id);
    if (userErr || !authUser.user?.email) continue;
    const email = authUser.user.email;
    // TODO: Replace with your verified sender domain before production
    // e.g. from: 'FinPath <hello@yourverifieddomain.com>'
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "FinPath <onboarding@resend.dev>",
        to: email,
        subject: `Your ${p.streak_current}-day streak is at risk 🔥`,
        html: `<p>Hi ${p.display_name},</p><p>Your ${p.streak_current}-day learning streak is waiting — a five-minute lesson keeps the flame alive.</p><p><a href="${SITE}/learn">Open FinPath</a></p>`,
        text: `Hi ${p.display_name}, your ${p.streak_current}-day streak is at risk. Continue: ${SITE}/learn`,
      }),
    });
    if (res.ok) sent += 1;
  }

  return new Response(JSON.stringify({ candidates: profiles?.length ?? 0, sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
