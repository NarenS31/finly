import {
  createTestUser,
  deleteTestUser,
} from "../helpers/supabase-admin";

export type FinlyRole = "learner" | "teacher" | "student";

export type FinlyTestUser = {
  id: string;
  email: string;
  password: string;
  displayName: string;
  ageTier: "8-12" | "13-17";
  role: FinlyRole;
};

export const DEFAULT_PASSWORD = "TestPass1!";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export function uniqueEmail(prefix = "qa"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function provisionUser(options?: {
  role?: FinlyRole;
  prefix?: string;
  displayName?: string;
  password?: string;
  ageTier?: "8-12" | "13-17";
}): Promise<FinlyTestUser> {
  const role = options?.role ?? "learner";
  const ageTier = options?.ageTier ?? "13-17";
  const password = options?.password ?? DEFAULT_PASSWORD;
  const email = uniqueEmail(options?.prefix ?? role);
  const displayName =
    options?.displayName ??
    `${role[0].toUpperCase()}${role.slice(1)}_${Math.random().toString(36).slice(2, 6)}`;

  const created = await createTestUser(email, password, displayName, ageTier);

  return {
    id: created.id,
    email,
    password,
    displayName,
    ageTier,
    role,
  };
}

export async function cleanupUser(user?: FinlyTestUser | null): Promise<void> {
  if (!user?.id) return;
  await deleteTestUser(user.id);
}

export async function cleanupUsers(
  users: Array<FinlyTestUser | null | undefined>
): Promise<void> {
  for (const user of users) {
    await cleanupUser(user);
  }
}

export async function deleteUserByEmail(email: string): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return;

  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=200`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!res.ok) return;

  const body = (await res.json()) as {
    users?: Array<{ id: string; email?: string }>;
  };
  const match = body.users?.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );

  if (match?.id) {
    await deleteTestUser(match.id);
  }
}
