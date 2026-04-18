import { LessonLibraryClient } from "@/components/lesson/lesson-library-client";
import { createClient } from "@/lib/supabase/server";
import { getAllLessons } from "@/lib/utils/lessons";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; joined?: string }>;
}) {
  const lessons = getAllLessons();
  const sp = await searchParams;
  const initialTopic = sp.topic && lessons.some((l) => l.topic === sp.topic) ? sp.topic! : "all";
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const joined = sp.joined === "true";

  return <LessonLibraryClient lessons={lessons} initialTopic={initialTopic} isLoggedIn={Boolean(data.user)} showJoinedToast={joined} />;
}
