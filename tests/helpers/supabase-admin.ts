/**
 * Direct Supabase Admin API helpers for test setup/teardown.
 * Uses service role key — never import this from production code.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

interface AdminUser {
  id: string;
  email: string;
}

export async function createTestUser(
  email: string,
  password: string,
  displayName = "Test User",
  ageTier: "8-12" | "13-17" = "13-17"
): Promise<AdminUser> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create test user: ${body}`);
  }

  const { id } = (await res.json()) as { id: string };

  // Create profile row
  await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id,
      display_name: displayName,
      age_tier: ageTier,
      currency_code: "USD",
      onboarding_complete: true,
      xp: 0,
      level: 1,
      streak_current: 0,
      streak_longest: 0,
      streak_shields: 0,
    }),
  });

  return { id, email };
}

export async function deleteTestUser(id: string): Promise<void> {
  // Delete profile first (FK constraint)
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  // Delete auth user
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
}

export async function setUserXp(userId: string, xp: number): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ xp }),
  });
}

export async function createTestClass(
  teacherId: string,
  name: string,
  ageTier: "8-12" | "13-17" = "13-17"
): Promise<{ id: string; code: string }> {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ name, age_tier: ageTier, teacher_id: teacherId, code }),
  });

  const body = await res.json();
  if (!res.ok || !Array.isArray(body) || body.length === 0) {
    throw new Error(`createTestClass failed: ${JSON.stringify(body)}`);
  }
  const cls = body[0] as { id: string; code: string };
  return { id: cls.id, code: cls.code };
}

export async function deleteTestClass(classId: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/class_members?class_id=eq.${classId}`, {
    method: "DELETE",
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
  await fetch(`${SUPABASE_URL}/rest/v1/classes?id=eq.${classId}`, {
    method: "DELETE",
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
}

export async function getClassMembers(classId: string): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/class_members?class_id=eq.${classId}&select=user_id`,
    {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
  const rows = (await res.json()) as Array<{ user_id: string }>;
  return rows.map((r) => r.user_id);
}

export async function getMoneyGoals(userId: string): Promise<unknown[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/money_goals?user_id=eq.${userId}&order=created_at.desc`,
    {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
  return (await res.json()) as unknown[];
}

export async function getUserProfile(userId: string): Promise<Record<string, unknown>> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
    {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
  const rows = (await res.json()) as Array<Record<string, unknown>>;
  return rows[0] ?? {};
}

export async function seedDailyChallenge(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);

  // Check if one exists
  const check = await fetch(
    `${SUPABASE_URL}/rest/v1/daily_challenges?date=eq.${today}&select=id`,
    {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
  const existing = (await check.json()) as Array<{ id: string }>;
  if (existing.length > 0) return existing[0].id;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/daily_challenges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      date: today,
      question: "What is the 50/30/20 rule?",
      options: [
        "50% needs, 30% wants, 20% savings",
        "50% savings, 30% needs, 20% wants",
        "50% wants, 30% savings, 20% needs",
        "Equal splits across three categories",
      ],
      correct: 0,
      explanation: "The 50/30/20 rule means you spend 50% on needs, 30% on wants, and save 20%.",
      xp_reward: 10,
    }),
  });

  const [challenge] = (await res.json()) as Array<{ id: string }>;
  return challenge.id;
}

export async function deleteDailyChallenge(challengeId: string): Promise<void> {
  await fetch(
    `${SUPABASE_URL}/rest/v1/daily_challenge_completions?challenge_id=eq.${challengeId}`,
    {
      method: "DELETE",
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
  await fetch(`${SUPABASE_URL}/rest/v1/daily_challenges?id=eq.${challengeId}`, {
    method: "DELETE",
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
}

export async function deleteDailyChallengeCompletion(
  userId: string,
  challengeId: string
): Promise<void> {
  await fetch(
    `${SUPABASE_URL}/rest/v1/daily_challenge_completions?user_id=eq.${userId}&challenge_id=eq.${challengeId}`,
    {
      method: "DELETE",
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
}

export async function seedWeeklyPoll(): Promise<string> {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const weekStart = monday.toISOString().slice(0, 10);

  const check = await fetch(
    `${SUPABASE_URL}/rest/v1/polls?week_start=eq.${weekStart}&select=id`,
    {
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
  const existing = (await check.json()) as Array<{ id: string }>;
  if (existing.length > 0) return existing[0].id;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/polls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      week_start: weekStart,
      question: "You have $50 left after bills. What do you do?",
      options: ["Save all of it", "Spend $25, save $25", "Buy something fun", "Invest it"],
    }),
  });

  const [poll] = (await res.json()) as Array<{ id: string }>;
  return poll.id;
}

export async function deletePollVote(userId: string, pollId: string): Promise<void> {
  await fetch(
    `${SUPABASE_URL}/rest/v1/poll_votes?user_id=eq.${userId}&poll_id=eq.${pollId}`,
    {
      method: "DELETE",
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    }
  );
}
