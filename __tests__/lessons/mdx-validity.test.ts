import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const VALID_TOPICS = [
  'Budgeting',
  'Saving & Goals',
  'Compound Interest',
  'Debt & Credit',
  'Banking',
  'Investing',
  'Goals',
  'Tax',
  'Money Basics',
  'Smart Spending',
  'Income & Tax',
];

const LESSON_ROOT = path.join(process.cwd(), 'content', 'lessons');
const TARGET_DIRS = [
  path.join(LESSON_ROOT, 'foundation'),
  path.join(LESSON_ROOT, 'real-world'),
];

function getLessonFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getLessonFiles(fullPath);
    return entry.name.endsWith('.mdx') ? [fullPath] : [];
  });
}

describe('Generated MDX lesson validity', () => {
  const files = TARGET_DIRS.flatMap((dir) => getLessonFiles(dir)).sort();

  test('exactly 50 generated lesson files exist', () => {
    expect(files).toHaveLength(50);
  });

  for (const filePath of files) {
    const relativeName = path.relative(LESSON_ROOT, filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);

    describe(relativeName, () => {
      test('has required frontmatter fields', () => {
        expect(typeof data.title).toBe('string');
        expect(data.title.length).toBeGreaterThan(0);
        expect(typeof data.description).toBe('string');
        expect(VALID_TOPICS).toContain(data.topic);
        expect(['8-12', '13-17']).toContain(data.ageTier);
        expect(['beginner', 'intermediate', 'advanced']).toContain(data.difficulty);
        expect(Number.isInteger(data.estimatedMinutes)).toBe(true);
        expect(Number.isInteger(data.xpReward)).toBe(true);
        expect(Number.isInteger(data.quizCount)).toBe(true);
        expect(Number.isInteger(data.order)).toBe(true);
      });

      test('has exactly 3 key takeaways', () => {
        expect(Array.isArray(data.keyTakeaways)).toBe(true);
        expect(data.keyTakeaways).toHaveLength(3);
        for (const takeaway of data.keyTakeaways as string[]) {
          expect(typeof takeaway).toBe('string');
          expect(takeaway.length).toBeGreaterThan(20);
        }
      });

      test('quizCount matches the number of QuizQuestion components', () => {
        const matches = content.match(/<QuizQuestion/g) ?? [];
        expect(matches).toHaveLength(data.quizCount);
      });

      test('includes the required lesson components', () => {
        expect((content.match(/<ConceptCard/g) ?? []).length).toBeGreaterThanOrEqual(2);
        expect((content.match(/<InteractiveCalculator/g) ?? []).length).toBeGreaterThanOrEqual(1);
        expect((content.match(/<Scenario/g) ?? []).length).toBeGreaterThanOrEqual(1);
        expect((content.match(/<KeyTakeaway/g) ?? []).length).toBeGreaterThanOrEqual(1);
        expect((content.match(/<RealWorldExample|<FunFact/g) ?? []).length).toBeGreaterThanOrEqual(1);
      });

      test('contains at least 500 words of prose outside components', () => {
        const prose = content
          .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '')
          .replace(/<[^>]+\/>/g, '')
          .trim();
        const wordCount = prose.split(/\s+/).filter(Boolean).length;
        expect(wordCount).toBeGreaterThanOrEqual(500);
      });

      test('does not contain placeholder text', () => {
        const lowered = content.toLowerCase();
        expect(lowered).not.toContain('lorem ipsum');
        expect(lowered).not.toContain('placeholder');
        expect(lowered).not.toContain('todo');
      });
    });
  }
});
