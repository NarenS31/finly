import { fireEvent, render, screen } from '@testing-library/react';
import { QuizQuestion } from '@/components/interactive/quiz-question';

const setLessonProgress = jest.fn();

jest.mock('@/lib/hooks/use-progress', () => ({
  useProgress: () => ({
    entry: { answeredQuestions: {} },
    setLessonProgress,
  }),
}));

describe('QuizQuestion', () => {
  const props = {
    lessonSlug: 'test-lesson',
    index: 0,
    question: 'What does compound interest grow on?',
    options: [
      'Only the original principal',
      'The principal and the interest already earned',
      'Only bank fees',
      'Only tax refunds',
    ],
    correct: 1,
    explanation:
      'Compound interest grows on both the starting amount and the interest already added, which is why time matters so much.',
  };

  beforeEach(() => {
    setLessonProgress.mockClear();
  });

  test('renders the question and all four options', () => {
    render(<QuizQuestion {...props} />);

    expect(screen.getByText(props.question)).toBeInTheDocument();
    for (const option of props.options) {
      expect(screen.getByText(option)).toBeInTheDocument();
    }
  });

  test('does not show the explanation before answering', () => {
    render(<QuizQuestion {...props} />);
    expect(screen.queryByText(props.explanation)).not.toBeInTheDocument();
  });

  test('shows the explanation and records a correct answer', () => {
    render(<QuizQuestion {...props} />);

    fireEvent.click(screen.getByText(props.options[1]));

    expect(screen.getByText(props.explanation)).toBeInTheDocument();
    expect(setLessonProgress).toHaveBeenCalledWith({
      status: 'in_progress',
      answeredQuestions: { 0: true },
    });
  });

  test('shows the explanation and records an incorrect answer', () => {
    render(<QuizQuestion {...props} />);

    fireEvent.click(screen.getByText(props.options[0]));

    expect(screen.getByText(props.explanation)).toBeInTheDocument();
    expect(setLessonProgress).toHaveBeenCalledWith({
      status: 'in_progress',
      answeredQuestions: { 0: false },
    });
  });
});
