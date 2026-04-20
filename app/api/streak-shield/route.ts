import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/streak-shield/use — spend one shield to protect streak on a missed day
export async function POST() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_shields, streak_current, last_active_date")
    .eq("id", auth.user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if ((profile.streak_shields ?? 0) < 1) return NextResponse.json({ error: "No shields remaining" }, { status: 400 });

  const today = new Date().toISOString().slice(0, 10);
  // Mark as active today, preserve streak, spend one shield
  await supabase
    .from("profiles")
    .update({
      streak_shields: (profile.streak_shields ?? 1) - 1,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  return NextResponse.json({ ok: true, shields_remaining: (profile.streak_shields ?? 1) - 1 });
}
