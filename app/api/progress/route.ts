import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/utils/update-streak";
import type { GuestLessonProgress } from "@/types";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { guestProgress?: Record<string, GuestLessonProgress> };
  const guestProgress = body.guestProgress ?? {};
  const slugs = Object.keys(guestProgress);
  if (slugs.length === 0) {
    return NextResponse.json({ ok: true, synced: 0 });
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id,slug")
    .in("slug", slugs);

  if (lessonsError || !lessons) {
    return NextResponse.json({ error: lessonsError?.message ?? "Lesson lookup failed" }, { status: 500 });
  }

  const slugToId = new Map(lessons.map((l) => [l.slug, l.id]));

  let synced = 0;
  for (const slug of slugs) {
    const lessonId = slugToId.get(slug);
    if (!lessonId) continue;
    const p = guestProgress[slug];
    const status = p.status === "completed" ? "completed" : p.scrollProgress > 5 ? "in_progress" : "not_started";
    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: auth.user.id,
        lesson_id: lessonId,
        status,
        scroll_progress: p.scrollProgress ?? 0,
        quiz_score: p.quizScore ?? null,
        completed_at: p.status === "completed" ? p.completedAt ?? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );
    if (!error) synced += 1;
  }

  await updateStreak(supabase, auth.user.id);

  return NextResponse.json({ ok: true, synced });
}
