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
import { Button } from "@/components/ui/button";
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
import { getEpfCurriculumModule, isMissingEpfLessonError } from "@/lib/utils/epf-curriculum";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const module = getEpfCurriculumModule(slug);
    return { title: `${module.meta.title} | Finly` };
  } catch {
    return { title: `${slug} | Finly` };
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const module = getEpfCurriculumModule(slug);
    const headings = extractHeadings(module.content);
    const meta = module.meta;
    const topicLabel = topicMeta[meta.topic]?.label ?? meta.topic;
    const supabase = await createClient();
    const { data: lessonRow } = await supabase
      .from("lessons")
      .select("id")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    const { content } = await compileMDX({
      source: module.content,
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
          quizCount={0}
          backHref="/curriculum"
          backLabel="Back to curriculum"
        >
          {content}
        </LessonViewer>
        {module.quizPrompts.length > 0 ? (
          <div className="mx-auto mt-10 max-w-[720px] text-center">
            <Button asChild>
              <Link href={`/epf-curriculum/${slug}/quiz`}>Open module questions ({module.quizPrompts.length}) →</Link>
            </Button>
          </div>
        ) : null}
      </div>
    );
  } catch (err) {
    if (isMissingEpfLessonError(err, slug)) {
      notFound();
    }
    throw err;
  }
}
