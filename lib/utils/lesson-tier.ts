import type { LessonMeta } from "@/types";

export function lessonMatchesTier(lesson: LessonMeta, tier: "8-12" | "13-17") {
  return lesson.ageTier === "both" || lesson.ageTier === tier;
}
