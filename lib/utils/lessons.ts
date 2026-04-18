import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Difficulty, LessonMeta, LessonTopic } from "@/types";

const lessonsDir = path.join(process.cwd(), "content", "lessons");

function normalizeMeta(data: Record<string, unknown>, fileSlug: string): LessonMeta {
  const topic = (data.topic as LessonTopic) ?? "budgeting";
  const ageTier = (data.ageTier as LessonMeta["ageTier"]) ?? "13-17";

  return {
    slug: (data.slug as string) ?? fileSlug,
    title: (data.title as string) ?? "Untitled",
    description: (data.description as string) ?? "",
    topic,
    ageTier,
    difficulty: (data.difficulty as Difficulty) ?? "beginner",
    estimatedMinutes: Number(data.estimatedMinutes) || 5,
    orderIndex: Number(data.orderIndex) ?? 0,
    published: data.published !== false,
    keyTakeaways: Array.isArray(data.keyTakeaways)
      ? (data.keyTakeaways as string[])
      : undefined,
    xpReward: data.xpReward !== undefined ? Number(data.xpReward) : 10,
    quizCount: data.quizCount !== undefined ? Number(data.quizCount) : 3,
  };
}

export function getLessonSlugs(): string[] {
  if (!fs.existsSync(lessonsDir)) return [];
  return fs
    .readdirSync(lessonsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getLessonBySlug(slug: string) {
  const fullPath = path.join(lessonsDir, `${slug}.mdx`);
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
    .filter((l) => l.published)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}
