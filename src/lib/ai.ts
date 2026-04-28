/**
 * Placeholder for the AI sample-essay generator.
 * This will later be wired to a Lovable AI Gateway edge function.
 *
 * The prompt template below is the exact one specified in the product brief
 * and should be passed verbatim to the model (with substitutions made).
 */

export const SAMPLE_ESSAY_PROMPT_TEMPLATE = (
  targetBand: number,
) => `You are an experienced IELTS Writing teacher. Based on the question prompt and the student's essay, write a model answer at band ${targetBand}. Keep the student's original main ideas where possible, but improve logic, vocabulary, grammar, cohesion, and task achievement. The answer should sound natural, clear, and teachable. Do not use overly advanced vocabulary that a band ${targetBand} student cannot learn from.`;

export interface GenerateSampleEssayInput {
  questionPrompt: string;
  studentEssay: string;
  targetBand: number;
  style: "simple" | "natural" | "teacher";
  instructions?: string;
}

/** Mock generator. Replace with a real edge-function call later. */
export async function generateSampleEssay(
  input: GenerateSampleEssayInput,
): Promise<string> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 1200));

  const styleNote =
    input.style === "simple"
      ? "(Simple, clear style — short sentences, common vocabulary.)"
      : input.style === "teacher"
        ? "(Teacher-style sample — annotated rhetorical structure.)"
        : "(Natural academic style — idiomatic, cohesive.)";

  return `Model answer · Band ${input.targetBand} ${styleNote}

The question of whether modern lifestyles are truly improving our well-being is a contested one. While critics point to rising stress and screen-time, I would argue that, on balance, the conveniences and opportunities afforded by modern life outweigh its drawbacks — provided individuals make conscious choices.

On the one hand, the pace of contemporary life has clear costs. People work longer hours, sleep less, and spend significant time on devices, all of which contribute to anxiety and a weakened sense of community. For example, recent studies in several Asian cities have linked heavy commuting and constant connectivity to higher rates of burnout among young professionals.

On the other hand, modern life provides remarkable benefits. Access to information, healthcare, and global communication has never been broader, and flexible working arrangements increasingly allow people to design lives that suit their personal goals. With deliberate boundaries — limited screen time, regular exercise, and meaningful relationships — these advantages can be enjoyed without serious harm.

In conclusion, while modern lifestyles undeniably bring challenges, the opportunities they create are substantial. Individuals who actively manage their time and habits can reap the rewards while minimising the costs.

— (Demo output. Connect Lovable AI to generate a real sample.)`;
}