import type { HeadingItem } from "@/lib/utils/content";
import type { LessonQuizPrompt } from "@/types";

export const MIN_QUIZ_PROMPTS = 7;
export const MAX_QUIZ_PROMPTS = 10;

function unescapeJsxString(s: string) {
  return s.replace(/\\"/g, '"').replace(/\\n/g, "\n");
}

function parseOptionsArray(raw: string): string[] {
  const inner = raw.trim();
  if (!inner.startsWith("[")) return [];
  const strs: string[] = [];
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(inner))) {
    strs.push(unescapeJsxString(mm[1]));
  }
  return strs;
}

export function extractMultipleChoicePromptsFromMdx(content: string): LessonQuizPrompt[] {
  const results: LessonQuizPrompt[] = [];
  const tagRe = /<QuizQuestion[\s\S]*?\/>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(content))) {
    const block = match[0];
    const qMatch = block.match(/question=\{?"((?:[^"\\]|\\.)*)"\}?/);
    const qAlt = block.match(/question=\{`([^`]*)`\}/);
    const prompt = unescapeJsxString((qMatch?.[1] ?? qAlt?.[1] ?? "").replace(/^"|"$/g, ""));
    if (!prompt) continue;

    const optMatch = block.match(/options=\{(\[[\s\S]*\])\s*\}/);
    const options = optMatch ? parseOptionsArray(optMatch[1]) : [];

    const correctMatch = block.match(/correct=\{(\d+)\}/);
    const correct = correctMatch ? parseInt(correctMatch[1], 10) : 0;

    const explMatch = block.match(/explanation=\{?"((?:[^"\\]|\\.)*)"\}?/);
    const explAlt = block.match(/explanation=\{`([^`]*)`\}/);
    const explanation = unescapeJsxString(
      (explMatch?.[1] ?? explAlt?.[1] ?? "").replace(/^"|"$/g, "")
    );

    if (options.length > 0) {
      results.push({
        type: "multiple_choice",
        prompt,
        options,
        correct,
        explanation,
      });
    }
  }

  return results;
}

function uniquePromptList(prompts: string[]) {
  const seen = new Set<string>();
  const clean: string[] = [];

  for (const prompt of prompts) {
    const normalized = prompt.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    clean.push(normalized);
  }

  return clean;
}

function makeShortAnswerPrompts(prompts: string[]): LessonQuizPrompt[] {
  return uniquePromptList(prompts).map((prompt) => ({
    type: "short_answer",
    prompt,
    placeholder: "Write your response here...",
    guidance: "Use complete thoughts and connect your answer to the lesson.",
  }));
}

export function ensureMinimumQuizPrompts(
  authored: LessonQuizPrompt[],
  supplemental: LessonQuizPrompt[],
  minCount = MIN_QUIZ_PROMPTS,
  maxCount = MAX_QUIZ_PROMPTS,
) {
  const combined = [...authored];
  for (const prompt of supplemental) {
    if (combined.length >= minCount) break;
    combined.push(prompt);
  }
  return combined.slice(0, maxCount);
}

export function countGradablePrompts(prompts: LessonQuizPrompt[]) {
  return prompts.filter((prompt) => prompt.type === "multiple_choice").length;
}

export function buildLessonQuizPrompts({
  title,
  description,
  keyTakeaways,
  headings,
  content,
}: {
  title: string;
  description: string;
  keyTakeaways: string[];
  headings: HeadingItem[];
  content: string;
}) {
  const authored = extractMultipleChoicePromptsFromMdx(content);
  const supplemental = makeShortAnswerPrompts([
    `Summarize the main idea of "${title}" in your own words.`,
    description ? `How would you explain this lesson's big message: ${description}` : "",
    ...keyTakeaways.map((takeaway) => `Explain why this takeaway matters in real life: ${takeaway}`),
    ...headings.slice(0, 4).map((heading) => `What is the most important thing to remember from "${heading.text}"?`),
    `Describe one real-world money decision where "${title}" would help you make a smarter choice.`,
  ]);

  return ensureMinimumQuizPrompts(authored, supplemental);
}

export function buildEpfSupplementalPrompts({
  title,
  objective,
  overview,
  activities,
  assessment,
}: {
  title: string;
  objective: string;
  overview: string[];
  activities: string[];
  assessment: string[];
}) {
  return makeShortAnswerPrompts([
    objective ? `In your own words, what is the main goal of "${title}"? ${objective}` : "",
    ...overview.map((item) => `Teach this idea to a classmate: ${item}`),
    ...activities.slice(0, 2).map((item) => `How would this activity help someone understand the topic better? ${item}`),
    ...assessment.slice(0, 2).map((item) => `What would a strong student response need to show for this checkpoint? ${item}`),
    `Give one real-life example that connects to "${title}".`,
  ]);
}
