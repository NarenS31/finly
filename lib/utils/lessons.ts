import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Difficulty, LessonMeta, LessonTopic } from "@/types";

const lessonsDir = path.join(process.cwd(), "content", "lessons");

const topicMap: Record<string, LessonTopic> = {
  Budgeting: "budgeting",
  "Saving & Goals": "saving",
  "Compound Interest": "saving",
  "Debt & Credit": "debt",
  Banking: "banking",
  Investing: "investing",
  Goals: "goals",
  Tax: "tax",
  "Income & Tax": "tax",
  "Money Basics": "money_basics",
  "Smart Spending": "goals",
};

function getLessonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getLessonFiles(fullPath);
    return entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

function getLessonFileMap() {
  const allFiles = getLessonFiles(lessonsDir).sort((left, right) => {
    const leftDepth = left.split(path.sep).length;
    const rightDepth = right.split(path.sep).length;
    if (leftDepth !== rightDepth) return rightDepth - leftDepth;
    return left.localeCompare(right);
  });

  const fileMap = new Map<string, string>();
  for (const fullPath of allFiles) {
    const slug = path.basename(fullPath, ".mdx");
    if (!fileMap.has(slug)) {
      fileMap.set(slug, fullPath);
    }
  }
  return fileMap;
}

function normalizeTopic(topic: unknown): LessonTopic {
  if (typeof topic !== "string") return "budgeting";
  return topicMap[topic] ?? (topic as LessonTopic) ?? "budgeting";
}

function normalizeMeta(data: Record<string, unknown>, fileSlug: string): LessonMeta {
  const ageTier = (data.ageTier as LessonMeta["ageTier"]) ?? "13-17";
  const orderIndex = data.order !== undefined ? Number(data.order) : Number(data.orderIndex);

  return {
    slug: (data.slug as string) ?? fileSlug,
    title: (data.title as string) ?? "Untitled",
    description: (data.description as string) ?? "",
    topic: normalizeTopic(data.topic),
    ageTier,
    difficulty: (data.difficulty as Difficulty) ?? "beginner",
    estimatedMinutes: Number(data.estimatedMinutes) || 5,
    orderIndex: Number.isFinite(orderIndex) ? orderIndex : 0,
    published: data.published !== false,
    keyTakeaways: Array.isArray(data.keyTakeaways)
      ? (data.keyTakeaways as string[])
      : undefined,
    xpReward: data.xpReward !== undefined ? Number(data.xpReward) : 10,
    quizCount: data.quizCount !== undefined ? Number(data.quizCount) : 3,
  };
}

export function getLessonSlugs(): string[] {
  return Array.from(getLessonFileMap().keys()).sort();
}

export function getLessonBySlug(slug: string) {
  const fullPath = getLessonFileMap().get(slug);
  if (!fullPath) {
    throw new Error(`Lesson not found for slug: ${slug}`);
  }

  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  return {
    meta: normalizeMeta(data as Record<string, unknown>, slug),
    content,
  };
}

export function getAllLessons(): LessonMeta[] {
  return getLessonSlugs()
    .map((slug) => getLessonBySlug(slug).meta)
    .filter((lesson) => lesson.published)
    .sort((left, right) => {
      if (left.ageTier !== right.ageTier) return left.ageTier.localeCompare(right.ageTier);
      if (left.topic !== right.topic) return left.topic.localeCompare(right.topic);
      if (left.orderIndex !== right.orderIndex) return left.orderIndex - right.orderIndex;
      return left.title.localeCompare(right.title);
    });
}
