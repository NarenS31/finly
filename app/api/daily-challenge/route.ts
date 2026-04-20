import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/daily-challenge — return today's challenge + completion status for authed user
export async function GET() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: challenge, error } = await supabase
    .from("daily_challenges")
    .select("id, date, question, options, correct, explanation, xp_reward")
    .eq("date", today)
    .single();

  if (error || !challenge) {
    return NextResponse.json({ error: "No challenge for today" }, { status: 404 });
  }

  const { data: auth } = await supabase.auth.getUser();
  let completion = null;
  if (auth.user) {
    const { data } = await supabase
      .from("daily_challenge_completions")
      .select("chosen, correct")
      .eq("user_id", auth.user.id)
      .eq("challenge_id", challenge.id)
      .maybeSingle();
    completion = data;
  }

  // Don't reveal correct answer until user has answered
  const safe = {
    id: challenge.id,
    question: challenge.question,
    options: challenge.options,
    xp_reward: challenge.xp_reward,
    ...(completion
      ? { correct: challenge.correct, explanation: challenge.explanation, completion }
      : {}),
  };

  return NextResponse.json({ challenge: safe });
}

// POST /api/daily-challenge — submit answer
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { challengeId: string; chosen: number };
  const { challengeId, chosen } = body;

  const { data: challenge } = await supabase
    .from("daily_challenges")
    .select("id, correct, xp_reward, date")
    .eq("id", challengeId)
    .single();

  if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

  const isCorrect = chosen === challenge.correct;

  const { error: insertErr } = await supabase.from("daily_challenge_completions").insert({
    user_id: auth.user.id,
    challenge_id: challengeId,
    chosen,
    correct: isCorrect,
  });

  if (insertErr) {
    // Already answered
    return NextResponse.json({ error: "Already answered" }, { status: 409 });
  }

  // Award XP if correct
  let xp_awarded = 0;
  if (isCorrect) {
    xp_awarded = challenge.xp_reward ?? 10;
    await supabase.rpc("award_xp", { p_user_id: auth.user.id, p_xp: xp_awarded }).maybeSingle();
  }

  return NextResponse.json({ correct: isCorrect, xp_awarded });
}
