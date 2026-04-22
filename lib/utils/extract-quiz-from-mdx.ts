import { extractMultipleChoicePromptsFromMdx } from "@/lib/utils/quiz-prompts";

export function extractQuizQuestionsFromMdx(content: string) {
  return extractMultipleChoicePromptsFromMdx(content).filter(
    (prompt): prompt is Extract<
      ReturnType<typeof extractMultipleChoicePromptsFromMdx>[number],
      { type: "multiple_choice" }
    > => prompt.type === "multiple_choice",
  );
}
