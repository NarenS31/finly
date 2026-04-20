import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/poll — current week's poll + vote counts + user's vote
export async function GET() {
  const supabase = await createClient();

  // Get Monday of this week
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const weekStart = monday.toISOString().slice(0, 10);

  const { data: poll } = await supabase
    .from("polls")
    .select("id, question, options")
    .eq("week_start", weekStart)
    .maybeSingle();

  if (!poll) return NextResponse.json({ poll: null });

  const { data: votes } = await supabase
    .from("poll_votes")
    .select("option_idx")
    .eq("poll_id", poll.id);

  const counts = Array(poll.options.length).fill(0) as number[];
  (votes ?? []).forEach((v) => { counts[v.option_idx] = (counts[v.option_idx] ?? 0) + 1; });
  const total = counts.reduce((a, b) => a + b, 0);

  let myVote: number | null = null;
  const { data: auth } = await supabase.auth.getUser();
  if (auth.user) {
    const { data: mine } = await supabase
      .from("poll_votes")
      .select("option_idx")
      .eq("poll_id", poll.id)
      .eq("user_id", auth.user.id)
      .maybeSingle();
    myVote = mine?.option_idx ?? null;
  }

  return NextResponse.json({ poll: { ...poll, counts, total, myVote } });
}

// POST /api/poll — cast vote
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pollId, optionIdx } = (await req.json()) as { pollId: string; optionIdx: number };

  const { error } = await supabase.from("poll_votes").insert({
    poll_id: pollId,
    user_id: auth.user.id,
    option_idx: optionIdx,
  });

  if (error) return NextResponse.json({ error: "Already voted" }, { status: 409 });
  return NextResponse.json({ ok: true });
}
