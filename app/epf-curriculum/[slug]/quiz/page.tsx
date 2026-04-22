import { notFound } from "next/navigation";
import { EpfQuestionsClient } from "@/components/lesson/epf-questions-client";
import { getEpfCurriculumModule, isMissingEpfLessonError } from "@/lib/utils/epf-curriculum";

export default async function EpfCurriculumQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const module = getEpfCurriculumModule(slug);

    return (
      <EpfQuestionsClient
        slug={slug}
        title={module.meta.title}
        questions={module.quizPrompts}
      />
    );
  } catch (error) {
    if (isMissingEpfLessonError(error, slug)) {
      notFound();
    }
    throw error;
  }
}
