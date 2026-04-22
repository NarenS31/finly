import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import type { ComponentProps } from "react";
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
import matter from "gray-matter";

const epfCurriculumDir = path.join(process.cwd(), "content", "epf-curriculum");

function getEpfCurriculumSource(slug: string) {
  const filePath = path.join(epfCurriculumDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Lesson not found for slug: ${slug}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

function isMissingLessonError(error: unknown, slug: string) {
  return error instanceof Error && error.message === `Lesson not found for slug: ${slug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} | Finly` };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const source = getEpfCurriculumSource(slug);
    const { data, content: rawContent } = matter(source);
    const headings = extractHeadings(rawContent);
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
          keyTakeaways={meta.keyTakeaways ?? []}
          xpReward={meta.xpReward ?? 10}
          quizCount={meta.quizCount ?? 0}
        >
          {content}
        </LessonViewer>
      </div>
    );
  } catch (err) {
    if (isMissingLessonError(err, slug)) {
      notFound();
    }
    throw err;
  }
}
