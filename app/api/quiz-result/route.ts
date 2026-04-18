import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Save standalone quiz score only if better than existing (or none). */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    lessonId: string;
    slug: string;
    correct: number;
    total: number;
  };

  const { lessonId, correct, total } = body;
  if (!lessonId || total <= 0) {
    return NextResponse.json({ error: "lessonId and total required" }, { status: 400 });
  }

  const percent = Math.round((correct / total) * 100);

  const { data: existing, error: selErr } = await supabase
    .from("lesson_progress")
    .select("id, quiz_score, started_at, status")
    .eq("user_id", auth.user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (selErr) {
    console.error("[quiz-result] select", selErr.message);
    return NextResponse.json({ error: selErr.message }, { status: 500 });
  }

  const prev = existing?.quiz_score;
  if (prev != null && percent <= prev) {
    return NextResponse.json({ updated: false, quiz_score: prev });
  }

  const now = new Date().toISOString();
  const { error: upErr } = await supabase.from("lesson_progress").upsert(
    {
      user_id: auth.user.id,
      lesson_id: lessonId,
      status: existing?.status === "completed" ? "completed" : "in_progress",
      quiz_score: percent,
      quiz_correct: correct,
      quiz_total: total,
      started_at: existing?.started_at ?? now,
      updated_at: now,
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (upErr) {
    console.error("[quiz-result] upsert", upErr.message);
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({ updated: true, quiz_score: percent });
}
