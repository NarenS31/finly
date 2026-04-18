/** @jest-environment node */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/lesson-complete/route';

let mockClient: {
  auth: { getUser: jest.Mock };
  from: jest.Mock;
  rpc: jest.Mock;
};
const updateStreak = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockClient),
}));

jest.mock('@/lib/utils/update-streak', () => ({
  updateStreak: (...args: unknown[]) => updateStreak(...args),
}));

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/lesson-complete', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildClient({
  user = { id: 'user-1' },
  existing = null,
  upsertError = null,
  xpResult = { xp_awarded: 17, total_xp: 200, new_level: 'Saver', leveled_up: false },
} = {}) {
  const maybeSingle = jest.fn().mockResolvedValue({ data: existing, error: null });
  const chain = {
    eq: jest.fn(() => chain),
    maybeSingle,
  };
  const select = jest.fn(() => chain);
  const upsert = jest.fn().mockResolvedValue({ error: upsertError });

  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user } }),
    },
    from: jest.fn(() => ({ select, upsert })),
    rpc: jest.fn((name: string) => {
      if (name === 'award_lesson_xp') {
        return Promise.resolve({ data: xpResult, error: null });
      }
      return Promise.resolve({ data: { newly_earned: [] }, error: null });
    }),
  };
}

describe('POST /api/lesson-complete', () => {
  beforeEach(() => {
    updateStreak.mockClear();
  });

  test('returns 401 when the request is unauthenticated', async () => {
    mockClient = buildClient({ user: null });

    const response = await POST(makeRequest({ lessonId: 'lesson-1', slug: 'test-lesson' }));

    expect(response.status).toBe(401);
  });

  test('returns 400 when lessonId or slug is missing', async () => {
    mockClient = buildClient();

    const response = await POST(makeRequest({ lessonId: 'lesson-1' }));

    expect(response.status).toBe(400);
  });

  test('returns XP and achievement results for a valid completion', async () => {
    mockClient = buildClient();

    const response = await POST(
      makeRequest({
        lessonId: 'lesson-1',
        slug: 'test-lesson',
        quizCorrect: 4,
        quizTotal: 4,
        scrollProgress: 100,
      })
    );

    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.alreadyCompleted).toBe(false);
    expect(json.xpResult).toEqual(
      expect.objectContaining({
        xp_awarded: expect.any(Number),
      })
    );
    expect(updateStreak).toHaveBeenCalled();
  });

  test('returns alreadyCompleted when the lesson was already completed', async () => {
    mockClient = buildClient({ existing: { id: 'progress-1', status: 'completed', quiz_score: 100 } });

    const response = await POST(makeRequest({ lessonId: 'lesson-1', slug: 'test-lesson' }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        alreadyCompleted: true,
        xpResult: null,
      })
    );
  });
});
