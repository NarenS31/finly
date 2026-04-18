import { notFound } from "next/navigation";
import { LessonQuizClient } from "@/components/lesson/lesson-quiz-client";
import { extractQuizQuestionsFromMdx } from "@/lib/utils/extract-quiz-from-mdx";
import { getAllLessons, getLessonBySlug, getLessonSlugs } from "@/lib/utils/lessons";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export default async function LessonQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const lesson = getLessonBySlug(slug);
    const questions = extractQuizQuestionsFromMdx(lesson.content);
    const lessons = getAllLessons();
    const idx = lessons.findIndex((l) => l.slug === slug);
    const nextLessonSlug = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1]?.slug ?? null : null;

    const supabase = await createClient();
    const { data: lessonRow } = await supabase
      .from("lessons")
      .select("id")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    return (
      <LessonQuizClient
        slug={slug}
        title={lesson.meta.title}
        lessonId={lessonRow?.id ?? null}
        xpReward={lesson.meta.xpReward ?? 10}
        questions={questions}
        nextLessonSlug={nextLessonSlug}
      />
    );
  } catch {
    notFound();
  }
}
