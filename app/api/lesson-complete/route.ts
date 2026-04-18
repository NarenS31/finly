import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/utils/update-streak";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    lessonId: string;
    slug: string;
    scrollProgress?: number;
    quizCorrect?: number;
    quizTotal?: number;
  };

  const { lessonId, slug } = body;
  if (!lessonId || !slug) {
    return NextResponse.json({ error: "lessonId and slug required" }, { status: 400 });
  }

  const quizTotal = body.quizTotal ?? 0;
  const quizCorrect = body.quizCorrect ?? 0;
  const scrollProgress = body.scrollProgress ?? 0;
  const quizPercent = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : null;

  const { data: existing, error: exErr } = await supabase
    .from("lesson_progress")
    .select("id, status, quiz_score, started_at")
    .eq("user_id", auth.user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (exErr) {
    console.error("[lesson-complete] select lesson_progress", exErr.message);
    return NextResponse.json({ error: exErr.message }, { status: 500 });
  }

  const wasCompleted = existing?.status === "completed";
  const now = new Date().toISOString();

  const { error: upErr } = await supabase.from("lesson_progress").upsert(
    {
      user_id: auth.user.id,
      lesson_id: lessonId,
      status: "completed",
      scroll_progress: scrollProgress,
      quiz_score: quizPercent,
      quiz_correct: quizTotal > 0 ? quizCorrect : null,
      quiz_total: quizTotal > 0 ? quizTotal : null,
      completed_at: now,
      started_at: existing?.started_at ?? now,
      updated_at: now,
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (upErr) {
    console.error("[lesson-complete] upsert lesson_progress", upErr.message);
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  await updateStreak(supabase, auth.user.id);

  if (wasCompleted) {
    return NextResponse.json({
      alreadyCompleted: true,
      xpResult: null,
      achievementResult: null,
    });
  }

  const { data: xpResult, error: xpErr } = await supabase.rpc("award_lesson_xp", {
    p_user_id: auth.user.id,
    p_lesson_id: lessonId,
    p_quiz_score: quizCorrect,
    p_quiz_total: quizTotal,
  });

  if (xpErr) {
    console.error("[lesson-complete] award_lesson_xp", xpErr.message);
  }

  const { data: achievementResult, error: achErr } = await supabase.rpc("check_and_award_achievements", {
    p_user_id: auth.user.id,
  });

  if (achErr) {
    console.error("[lesson-complete] check_and_award_achievements", achErr.message);
  }

  return NextResponse.json({
    alreadyCompleted: false,
    xpResult: xpResult ?? null,
    achievementResult: achievementResult ?? null,
  });
}
