/**
 * Extract inline quiz data from lesson MDX for the standalone quiz page.
 * Expects <QuizQuestion ... /> blocks with question=, options={[...]}, correct={n}, explanation="..."
 */
export interface ExtractedQuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

function unescapeJsxString(s: string) {
  return s.replace(/\\"/g, '"').replace(/\\n/g, "\n");
}

function parseOptionsArray(raw: string): string[] {
  const inner = raw.trim();
  if (!inner.startsWith("[")) return [];
  const strs: string[] = [];
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(inner))) {
    strs.push(unescapeJsxString(mm[1]));
  }
  return strs;
}

export function extractQuizQuestionsFromMdx(content: string): ExtractedQuizQuestion[] {
  const results: ExtractedQuizQuestion[] = [];
  const tagRe = /<QuizQuestion[\s\S]*?\/>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(content))) {
    const block = m[0];
    const qMatch = block.match(/question=\{?"((?:[^"\\]|\\.)*)"\}?/);
    const qAlt = block.match(/question=\{`([^`]*)`\}/);
    const question = unescapeJsxString((qMatch?.[1] ?? qAlt?.[1] ?? "").replace(/^"|"$/g, ""));
    if (!question) continue;

    const optMatch = block.match(/options=\{(\[[\s\S]*\])\s*\}/);
    const options = optMatch ? parseOptionsArray(optMatch[1]) : [];

    const correctMatch = block.match(/correct=\{(\d+)\}/);
    const correct = correctMatch ? parseInt(correctMatch[1], 10) : 0;

    const explMatch = block.match(/explanation=\{?"((?:[^"\\]|\\.)*)"\}?/);
    const explAlt = block.match(/explanation=\{`([^`]*)`\}/);
    const explanation = unescapeJsxString(
      (explMatch?.[1] ?? explAlt?.[1] ?? "").replace(/^"|"$/g, "")
    );

    if (options.length > 0) {
      results.push({ question, options, correct, explanation });
    }
  }
  return results;
}
