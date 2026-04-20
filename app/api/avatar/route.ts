import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { hat?: string | null; accessory?: string | null; badge?: string | null };

  await supabase
    .from("profiles")
    .update({ avatar: body, updated_at: new Date().toISOString() })
    .eq("id", auth.user.id);

  return NextResponse.json({ ok: true });
}
