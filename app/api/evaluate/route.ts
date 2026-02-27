import { NextRequest, NextResponse } from "next/server";

type EvaluationPayload = {
  code?: string;
  prompt?: string;
  reasoning?: string;
  mcScore?: number;
  correctCount?: number;
};

type EvaluationResult = {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
};

function simpleHeuristicEvaluation(
  reasoning: string,
  baseScore?: number,
): EvaluationResult {
  const text = reasoning.toLowerCase();
  const tokens = reasoning.trim().split(/\s+/).length;
  let score =
    typeof baseScore === "number"
      ? Math.min(100, Math.max(0, baseScore))
      : Math.min(100, Math.max(30, tokens * 2));

  if (text.includes("while") && text.includes("loop")) score += 5;
  if (text.includes("infinite") || text.includes("never stops")) score += 10;
  if (text.includes("i +=") || text.includes("increment")) score += 10;
  score = Math.min(score, 100);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (text.includes("goal") || text.includes("supposed to")) {
    strengths.push("You tried to describe the goal of the function.");
  } else {
    improvements.push("Start by clearly stating what the code is supposed to do.");
  }

  if (text.includes("loop") || text.includes("line")) {
    strengths.push("You referenced specific parts of the code (like the loop or lines).");
  } else {
    improvements.push("Refer to specific lines or parts of the code to make your reasoning concrete.");
  }

  if (text.includes("infinite") || text.includes("never") || text.includes("stuck")) {
    strengths.push("You noticed that the loop can run forever, which is the key bug.");
  } else {
    improvements.push("Explain what actually goes wrong when the code runs (e.g. it never finishes).");
  }

  if (text.includes("increment") || text.includes("i +=") || text.includes("i = i + 1")) {
    strengths.push("You proposed a concrete fix (incrementing i inside the loop).");
  } else {
    improvements.push("Propose a specific change to the code that would fix the problem.");
  }

  const summary =
    "This score is based on a simple offline rubric that looks for goal understanding, decomposition of the loop, identification of the infinite loop bug, and a concrete fix.";

  return { score, strengths, improvements, summary };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EvaluationPayload;
    const reasoning = body.reasoning?.trim();
    const mcScore = body.mcScore;

    if (!reasoning) {
      return NextResponse.json(
        { error: "Missing reasoning text." },
        { status: 400 },
      );
    }

    // Placeholder: offline heuristic evaluation.
    // This keeps the MVP working without requiring an API key.
    const result = simpleHeuristicEvaluation(reasoning, mcScore);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Could not evaluate your answer." },
      { status: 500 },
    );
  }
}

