import type { Metadata } from "next";
import type { ComponentProps } from "react";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { LessonViewer } from "@/components/lesson/lesson-viewer";
import { extractHeadings } from "@/lib/utils/content";
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


import { epfCurriculumFiles } from "@/content/epf-curriculum/index";
import matter from "gray-matter";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { title: params.slug };
}


export default async function LessonPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const mod = epfCurriculumFiles[slug as keyof typeof epfCurriculumFiles];
    if (!mod) throw new Error("Lesson not found");
    const mdModule = await mod();
    const source = mdModule.default ?? mdModule;
    let data = {};
    let rawContent = "";
    if (typeof source === "string") {
      const parsed = matter(source);
      data = parsed.data;
      rawContent = parsed.content;
    }
    const headings = rawContent ? extractHeadings(rawContent) : [];
    // Fallbacks for meta fields
    const meta = {
      slug,
      title: (data as any)?.title ?? slug,
      description: (data as any)?.description ?? "",
      topic: (data as any)?.topic ?? "money_basics",
      ageTier: (data as any)?.ageTier ?? "13-17",
      difficulty: (data as any)?.difficulty ?? "beginner",
      estimatedMinutes: (data as any)?.estimatedMinutes ?? 5,
      keyTakeaways: (data as any)?.keyTakeaways ?? [],
      xpReward: (data as any)?.xpReward ?? 10,
      quizCount: (data as any)?.quizCount ?? 0,
    };
    const topicLabel = topicMeta[meta.topic]?.label ?? meta.topic;
    const supabase = await createClient();
    const { data: lessonRow } = await supabase
      .from("lessons")
      .select("id")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (!rawContent) {
      throw new Error("Lesson content is not available or MDX could not be loaded as string.");
    }
    const { content } = await compileMDX({
      source: rawContent,
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
          slug={meta.slug}
          lessonId={lessonRow?.id ?? null}
          title={meta.title}
          topicLabel={topicLabel}
          ageTier={meta.ageTier}
          estimatedMinutes={meta.estimatedMinutes}
          headings={headings}
          summary={meta.description}
          nextLesson={undefined}
          relatedLessons={[]}
          keyTakeaways={meta.keyTakeaways}
          xpReward={meta.xpReward ?? 10}
          quizCount={0}
        >
          {content}
        </LessonViewer>
      </div>
    );
  } catch (err) {
    // Debug log for 404 errors
    // eslint-disable-next-line no-console
    console.error("[epf-curriculum] 404 for slug:", slug, err);
    notFound();
  }
}
