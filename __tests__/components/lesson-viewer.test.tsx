import { act, render, screen } from '@testing-library/react';
import { LessonViewer } from '@/components/lesson/lesson-viewer';

const setLessonProgress = jest.fn();
const toast = jest.fn();
let progressEntry: {
  status: 'not_started' | 'in_progress' | 'completed';
  answeredQuestions: Record<number, boolean>;
  scrollProgress: number;
};

jest.mock('canvas-confetti', () => jest.fn());

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/lib/hooks/use-progress', () => ({
  useProgress: () => ({
    entry: progressEntry,
    setLessonProgress,
  }),
}));

jest.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('@/lib/store/age-tier-store', () => ({
  useAgeTierStore: (selector: (state: { ageTier: '8-12' | '13-17' }) => unknown) =>
    selector({ ageTier: '13-17' }),
}));

jest.mock('@/lib/store/toast-store', () => ({
  useToastStore: (selector: (state: { show: typeof toast }) => unknown) => selector({ show: toast }),
}));

function renderViewer(quizCount: number) {
  return render(
    <LessonViewer
      slug="test-lesson"
      lessonId={null}
      title="Test Lesson"
      topicLabel="Budgeting"
      ageTier="13-17"
      estimatedMinutes={8}
      headings={[{ id: 'why-it-matters', text: 'Why it matters' }]}
      summary="A lesson used for tests."
      relatedLessons={[]}
      keyTakeaways={['One', 'Two', 'Three']}
      xpReward={10}
      quizCount={quizCount}
    >
      <div style={{ height: '1200px' }}>content</div>
    </LessonViewer>
  );
}

function triggerScroll({ scrollY, scrollHeight, innerHeight }: { scrollY: number; scrollHeight: number; innerHeight: number }) {
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: scrollHeight, configurable: true });

  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('LessonViewer completion trigger', () => {
  beforeEach(() => {
    setLessonProgress.mockClear();
    toast.mockClear();
    progressEntry = {
      status: 'in_progress',
      answeredQuestions: {},
      scrollProgress: 0,
    };
  });

  test('does not show completion on initial render', () => {
    renderViewer(2);
    expect(screen.queryByText('Lesson complete!')).not.toBeInTheDocument();
  });

  test('does not complete when quizzes are not all answered', () => {
    renderViewer(2);
    triggerScroll({ scrollY: 950, scrollHeight: 1000, innerHeight: 100 });

    expect(screen.queryByText('Lesson complete!')).not.toBeInTheDocument();
  });

  test('completes when scroll passes 90 percent and all quizzes are answered', async () => {
    progressEntry = {
      status: 'in_progress',
      answeredQuestions: { 0: true, 1: false },
      scrollProgress: 50,
    };

    renderViewer(2);
    triggerScroll({ scrollY: 950, scrollHeight: 1000, innerHeight: 100 });

    expect(await screen.findByText('Lesson complete!')).toBeInTheDocument();
    expect(setLessonProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
      })
    );
  });

  test('lessons with zero quizzes complete on scroll alone', async () => {
    renderViewer(0);
    triggerScroll({ scrollY: 950, scrollHeight: 1000, innerHeight: 100 });

    expect(await screen.findByText('Lesson complete!')).toBeInTheDocument();
  });
});
