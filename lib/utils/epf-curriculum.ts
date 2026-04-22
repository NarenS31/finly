import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { buildEpfSupplementalPrompts, ensureMinimumQuizPrompts } from "@/lib/utils/quiz-prompts";
import type { LessonMeta, LessonQuizPrompt } from "@/types";

const epfCurriculumDir = path.join(process.cwd(), "content", "epf-curriculum");

type SectionMap = {
  standard: string;
  objective: string;
  overview: string[];
  teacherNotes: string[];
  activities: string[];
  assessment: string[];
  resources: string[];
  questions: string;
};

function getModuleTitle(content: string, slug: string) {
  const match = content.match(/^#\s+Module\s+[^:]+:\s*(.+)$/m);
  return match?.[1]?.trim() || slug;
}

function stripQuestionSection(content: string) {
  const lines = content.split(/\r?\n/);
  const contentLines: string[] = [];
  const questionLines: string[] = [];
  let inQuestions = false;

  for (const line of lines) {
    if (!inQuestions && /^##\s+Questions\s*$/.test(line)) {
      inQuestions = true;
      continue;
    }
    if (inQuestions && /^##\s+/.test(line)) {
      inQuestions = false;
      contentLines.push(line);
      continue;
    }
    if (inQuestions) {
      questionLines.push(line);
    } else {
      contentLines.push(line);
    }
  }

  return {
    contentWithoutQuestions: contentLines.join("\n").trim(),
    questionSection: questionLines.join("\n").trim(),
  };
}

function getSection(content: string, heading: string) {
  const match = content.match(new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`));
  return match?.[1]?.trim() ?? "";
}

function getBulletList(section: string) {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim());
}

function parseSections(content: string): SectionMap {
  const standard = content.match(/^##\s+Standard:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const objective = content.match(/^\*\*Objective:\*\*\s*(.+)$/m)?.[1]?.trim() ?? "";
  const overview = getBulletList(getSection(content, "Lesson Overview"));
  const teacherNotes = getBulletList(getSection(content, "Teacher Notes"));
  const activities = getBulletList(getSection(content, "Activities"));
  const assessment = getBulletList(getSection(content, "Assessment"));
  const resources = getBulletList(getSection(content, "Resources"));
  const { questionSection } = stripQuestionSection(content);

  return {
    standard,
    objective,
    overview,
    teacherNotes,
    activities,
    assessment,
    resources,
    questions: questionSection,
  };
}

function formatBulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function makeFocusSection(title: string, objective: string, point: string, index: number) {
  const lead =
    index === 0
      ? `Start with this core idea: ${point}.`
      : `Another important part of ${title} is this idea: ${point}.`;
  const bridge = objective
    ? `It connects directly to the module objective, which is to ${objective.charAt(0).toLowerCase()}${objective.slice(1)}`
    : `It matters because it shapes how people make decisions, solve problems, and explain what they see in the economy`;

  return `### Focus ${index + 1}: ${point}

${lead} When you study it as a student, do more than memorize the phrase. Break it down into the choices, trade-offs, and incentives hiding underneath the vocabulary.

${bridge}. Ask yourself who is affected, what evidence would prove the point, and how the idea would show up in a real money decision or headline.
`;
}

function buildStudentLessonMarkdown(title: string, sections: SectionMap) {
  const focusSections = sections.overview.length
    ? sections.overview.map((point, index) => makeFocusSection(title, sections.objective, point, index)).join("\n")
    : `### Focus 1: Understand the core idea

This module is about ${title}. As you read, pay attention to the choices people make, the incentives they respond to, and the real-world consequences that follow.
`;

  const teacherGuideParts = [
    sections.teacherNotes.length ? `### Teacher notes\n${formatBulletList(sections.teacherNotes)}` : "",
    sections.activities.length ? `### Activities\n${formatBulletList(sections.activities)}` : "",
    sections.assessment.length ? `### Assessment\n${formatBulletList(sections.assessment)}` : "",
    sections.resources.length ? `### Resources\n${formatBulletList(sections.resources)}` : "",
  ].filter(Boolean);

  return `## Student lesson

${sections.objective || `This module helps you understand ${title.toLowerCase()} in a practical way.`}

Instead of only reading directions written for a teacher, treat this page like a guided lesson. Your job is to understand the ideas well enough to explain them, apply them, and notice them in everyday life.

## What to pay attention to

${focusSections}

## Why this matters in real life

Topics like ${title.toLowerCase()} shape the prices people pay, the choices families make, and the trade-offs communities debate. If you can explain the main ideas clearly, you are not just learning for a test. You are building a way to read news, compare options, and make smarter financial choices.

## How to study this module

- Read each big idea slowly enough to paraphrase it in your own words
- Connect the concept to one real example from your life, school, news, or community
- Use the activities and assessments below as practice, not just as tasks to finish

${teacherGuideParts.length > 0 ? `---\n\n## Teacher guide\n\n${teacherGuideParts.join("\n\n")}` : ""}
`;
}

function extractAuthoredQuestions(questionSection: string): LessonQuizPrompt[] {
  if (!questionSection) return [];

  const blocks = questionSection
    .split(/(?:^|\n)(?=\d+\.\s+\*\*(?:Multiple Choice|Short Answer)\*\*:)/m)
    .map((block) => block.trim())
    .filter(Boolean);

  const prompts: LessonQuizPrompt[] = [];

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const firstLine = lines[0] ?? "";
    const headerMatch = firstLine.match(/^\d+\.\s+\*\*(Multiple Choice|Short Answer)\*\*:\s*(.+)$/);
    if (!headerMatch) continue;

    const [, kind, prompt] = headerMatch;

    if (kind === "Multiple Choice") {
      const options = lines
        .slice(1)
        .map((line) => line.match(/^-\s+[a-z]\)\s+(.+)$/i)?.[1]?.trim())
        .filter((option): option is string => Boolean(option));

      if (options.length > 0) {
        prompts.push({
          type: "multiple_choice",
          prompt: prompt.trim(),
          options,
          correct: 0,
          explanation: "Review the lesson notes and explain why your choice makes the most sense.",
        });
      }
      continue;
    }

    prompts.push({
      type: "short_answer",
      prompt: prompt.trim(),
      placeholder: "Write your response here...",
      guidance: "Use evidence and examples from the module.",
    });
  }

  return prompts;
}

export function getEpfCurriculumModule(slug: string) {
  const filePath = path.join(epfCurriculumDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Lesson not found for slug: ${slug}`);
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const title = (data.title as string) ?? getModuleTitle(content, slug);
  const sections = parseSections(content);
  const studentLessonContent = buildStudentLessonMarkdown(title, sections);
  const authoredQuestions = extractAuthoredQuestions(sections.questions);
  const supplementalQuestions = buildEpfSupplementalPrompts({
    title,
    objective: sections.objective,
    overview: sections.overview,
    activities: sections.activities,
    assessment: sections.assessment,
  });
  const quizPrompts = ensureMinimumQuizPrompts(authoredQuestions, supplementalQuestions);
  const keyTakeaways =
    Array.isArray(data.keyTakeaways) && data.keyTakeaways.length > 0
      ? (data.keyTakeaways as string[])
      : sections.overview.slice(0, 3);

  const meta: LessonMeta = {
    slug,
    title,
    description: ((data.description as string) ?? sections.objective) || "North Carolina EPF module.",
    topic: (data.topic as LessonMeta["topic"]) ?? "money_basics",
    ageTier: (data.ageTier as LessonMeta["ageTier"] | "both") ?? "13-17",
    difficulty: (data.difficulty as LessonMeta["difficulty"]) ?? "beginner",
    estimatedMinutes: Number(data.estimatedMinutes) || 8,
    orderIndex: Number(data.orderIndex) || 0,
    published: data.published !== false,
    keyTakeaways,
    xpReward: data.xpReward !== undefined ? Number(data.xpReward) : 10,
    quizCount: quizPrompts.length,
  };

  return {
    meta,
    content: studentLessonContent,
    sections,
    quizPrompts,
  };
}

export function isMissingEpfLessonError(error: unknown, slug: string) {
  return error instanceof Error && error.message === `Lesson not found for slug: ${slug}`;
}
