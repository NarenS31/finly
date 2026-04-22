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
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "content/epf-curriculum", `${slug}.md`);
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    return {
      title: data.title || slug,
      description: data.description || "",
    };
  } catch {
    return { title: "Lesson | Finly" };
  }
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "content/epf-curriculum", `${slug}.md`);
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const { data, content: rawContent } = matter(source);
    const headings = extractHeadings(rawContent);
    // Fallbacks for meta fields
    const meta = {
      slug,
      title: data.title || slug,
      description: data.description || "",
      topic: data.topic || "money_basics",
      ageTier: data.ageTier || "13-17",
      difficulty: data.difficulty || "beginner",
      estimatedMinutes: data.estimatedMinutes || 5,
      keyTakeaways: data.keyTakeaways || [],
      xpReward: data.xpReward || 10,
      quizCount: data.quizCount || 0,
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

    // Related lessons logic can be added if needed

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
  } catch {
    notFound();
  }
}
