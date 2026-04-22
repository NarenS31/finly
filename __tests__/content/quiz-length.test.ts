import { epfCurriculumFiles } from "@/content/epf-curriculum";
import { extractHeadings } from "@/lib/utils/content";
import { getEpfCurriculumModule } from "@/lib/utils/epf-curriculum";
import { buildLessonQuizPrompts, MAX_QUIZ_PROMPTS, MIN_QUIZ_PROMPTS } from "@/lib/utils/quiz-prompts";
import { getLessonBySlug, getLessonSlugs } from "@/lib/utils/lessons";

describe("quiz prompt coverage", () => {
  test("all regular lessons build between 7 and 10 quiz prompts", () => {
    for (const slug of getLessonSlugs()) {
      const lesson = getLessonBySlug(slug);
      const prompts = buildLessonQuizPrompts({
        title: lesson.meta.title,
        description: lesson.meta.description,
        keyTakeaways: lesson.meta.keyTakeaways ?? [],
        headings: extractHeadings(lesson.content),
        content: lesson.content,
      });

      expect(prompts.length).toBeGreaterThanOrEqual(MIN_QUIZ_PROMPTS);
      expect(prompts.length).toBeLessThanOrEqual(MAX_QUIZ_PROMPTS);
    }
  });

  test("all EPF curriculum modules build between 7 and 10 quiz prompts", () => {
    const slugs = Object.keys(epfCurriculumFiles);

    for (const slug of slugs) {
      const module = getEpfCurriculumModule(slug);
      expect(module.quizPrompts.length).toBeGreaterThanOrEqual(MIN_QUIZ_PROMPTS);
      expect(module.quizPrompts.length).toBeLessThanOrEqual(MAX_QUIZ_PROMPTS);
    }
  });
});
