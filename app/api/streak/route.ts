import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/utils/update-streak";

export async function POST() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await updateStreak(supabase, auth.user.id);
  return NextResponse.json({ ok: true });
}
