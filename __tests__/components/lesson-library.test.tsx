import { fireEvent, render, screen } from '@testing-library/react';
import { LessonLibraryClient } from '@/components/lesson/lesson-library-client';

const mockLessons = [
  {
    slug: 'budget-1',
    title: 'Budgeting Basics',
    description: 'Plan spending before it disappears.',
    topic: 'budgeting',
    ageTier: '13-17',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    orderIndex: 1,
    published: true,
  },
  {
    slug: 'saving-1',
    title: 'Saving Moves',
    description: 'Build a savings habit for your next goal.',
    topic: 'saving',
    ageTier: '13-17',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    orderIndex: 2,
    published: true,
  },
  {
    slug: 'kids-lesson',
    title: 'Kids Lesson',
    description: 'A foundation tier lesson.',
    topic: 'money_basics',
    ageTier: '8-12',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    orderIndex: 3,
    published: true,
  },
];

jest.mock('@/lib/store/age-tier-store', () => ({
  useAgeTierStore: (selector: (state: { ageTier: '8-12' | '13-17' }) => unknown) =>
    selector({ ageTier: '13-17' }),
}));

jest.mock('@/lib/store/progress-store', () => ({
  useProgressStore: (selector: (state: { guestProgress: Record<string, never> }) => unknown) =>
    selector({ guestProgress: {} }),
}));

describe('LessonLibraryClient', () => {
  test('renders matching lessons for the active age tier by default', () => {
    render(<LessonLibraryClient lessons={mockLessons} isLoggedIn={false} />);

    expect(screen.getByText('Budgeting Basics')).toBeInTheDocument();
    expect(screen.getByText('Saving Moves')).toBeInTheDocument();
    expect(screen.queryByText('Kids Lesson')).not.toBeInTheDocument();
  });

  test('filters lessons by search query', () => {
    render(<LessonLibraryClient lessons={mockLessons} isLoggedIn={false} />);

    fireEvent.change(screen.getByPlaceholderText(/search lessons/i), {
      target: { value: 'saving' },
    });

    expect(screen.getByText('Saving Moves')).toBeInTheDocument();
    expect(screen.queryByText('Budgeting Basics')).not.toBeInTheDocument();
  });

  test('filters lessons by topic button and can clear filters', () => {
    render(<LessonLibraryClient lessons={mockLessons} isLoggedIn={false} />);

    fireEvent.click(screen.getByRole('button', { name: 'Budgeting' }));

    expect(screen.getByText('Budgeting Basics')).toBeInTheDocument();
    expect(screen.queryByText('Saving Moves')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(screen.getByText('Saving Moves')).toBeInTheDocument();
  });

  test('shows an empty state when nothing matches', () => {
    render(<LessonLibraryClient lessons={mockLessons} isLoggedIn={false} />);

    fireEvent.change(screen.getByPlaceholderText(/search lessons/i), {
      target: { value: 'zzznomatch' },
    });

    expect(screen.getByText(/no lessons found/i)).toBeInTheDocument();
  });
});
