import type { Metadata } from "next";
import type { ComponentProps } from "react";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { LessonViewer } from "@/components/lesson/lesson-viewer";
import { extractHeadings } from "@/lib/utils/content";
import { getAllLessons, getLessonBySlug, getLessonSlugs } from "@/lib/utils/lessons";
import { topicMeta } from "@/lib/data/site";
import { createClient } from "@/lib/supabase/server";
import { QuizQuestion } from "@/components/interactive/quiz-question";
import {
  ConceptCard,
  InteractiveCalculator,
  Scenario,
  KeyTakeaway,
  RealWorldExample,
  FunFact,
  Term,
  h2,
  h3,
} from "@/components/lesson/mdx-components";

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const lesson = getLessonBySlug(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const ogImageUrl = new URL("/api/og", siteUrl);
    ogImageUrl.searchParams.set("title", lesson.meta.title);
    ogImageUrl.searchParams.set("topic", lesson.meta.topic);
    ogImageUrl.searchParams.set("tier", lesson.meta.ageTier ?? "");
    ogImageUrl.searchParams.set("xp", String(lesson.meta.xpReward ?? 10));

    return {
      title: `${lesson.meta.title} | Finly`,
      description: lesson.meta.description,
      openGraph: {
        title: lesson.meta.title,
        description: lesson.meta.description,
        type: "article",
        images: [
          {
            url: ogImageUrl.toString(),
            width: 1200,
            height: 630,
            alt: lesson.meta.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: lesson.meta.title,
        description: lesson.meta.description,
        images: [ogImageUrl.toString()],
      },
    };
  } catch {
    return { title: "Lesson | Finly" };
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const lesson = getLessonBySlug(slug);
    const lessons = getAllLessons();
    const headings = extractHeadings(lesson.content);
    const currentIndex = lessons.findIndex((item) => item.slug === slug);
    const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : undefined;
    const relatedLessons = lessons
      .filter((item) => item.topic === lesson.meta.topic && item.slug !== slug)
      .slice(0, 3);
    const topicLabel = topicMeta[lesson.meta.topic]?.label ?? lesson.meta.topic;

    const supabase = await createClient();
    const { data: lessonRow } = await supabase
      .from("lessons")
      .select("id")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    const { content } = await compileMDX({
      source: lesson.content,
      options: { parseFrontmatter: false },
      components: {
        ConceptCard,
        InteractiveCalculator,
        Scenario,
        QuizQuestion: (props: { lessonSlug?: string } & ComponentProps<typeof QuizQuestion>) => (
          <QuizQuestion {...props} lessonSlug={props.lessonSlug ?? slug} />
        ),
        KeyTakeaway,
        RealWorldExample,
        FunFact,
        Term,
        h2,
        h3,
      },
    });

    return (
      <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <LessonViewer
          slug={lesson.meta.slug}
          lessonId={lessonRow?.id ?? null}
          title={lesson.meta.title}
          topicLabel={topicLabel}
          ageTier={lesson.meta.ageTier}
          estimatedMinutes={lesson.meta.estimatedMinutes}
          headings={headings}
          summary={lesson.meta.description}
          nextLesson={nextLesson}
          relatedLessons={relatedLessons}
          keyTakeaways={lesson.meta.keyTakeaways ?? []}
          xpReward={lesson.meta.xpReward ?? 10}
          quizCount={lesson.meta.quizCount ?? 0}
        >
          {content}
        </LessonViewer>
        <div className="mx-auto mt-10 max-w-[720px] text-center">
          <Link
            href={`/learn/${slug}/quiz`}
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Open full quiz mode →
          </Link>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
