import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED = [
  "display_name",
  "age_tier",
  "currency_code",
  "email_notify_streak",
  "email_notify_weekly",
] as const;

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in body) {
      update[key] = body[key];
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();

  const { error } = await supabase.from("profiles").update(update).eq("id", auth.user.id);

  if (error) {
    console.error("[profile PATCH]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
