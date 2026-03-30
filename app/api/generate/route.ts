import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { manuscript } = await req.json();

  if (!manuscript || manuscript.trim().length < 50) {
    return NextResponse.json({ error: "Please paste a manuscript (abstract or full text, min 50 characters)." }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });

  const systemPrompt = `You are an experienced peer reviewer and academic editor. Provide a constructive, detailed peer review of the submitted manuscript. Be rigorous, fair, and specific.

Format your review as follows:

# Peer Review Report

## Summary
Brief 2-3 sentence overview of the manuscript and its contribution.

## Strengths
- [List 3-5 genuine strengths: novelty, clarity, methodology, reproducibility, significance]

## Areas for Improvement

### novelty & Significance
[Assess whether the research question is novel and its importance to the field]

### Methodology
[Evaluate study design, sample size, controls, statistical methods, and data analysis. Note any methodological concerns.]

### Results & Interpretation
[Comment on data presentation, statistical rigor, and whether conclusions are supported by the evidence]

### Clarity & Organization
[Assess writing quality, structure, figure/table clarity, and whether the narrative is coherent]

### Literature Review
[Evaluate whether prior work is adequately cited and discussed]

### Reproducibility
[Note concerns about data/code availability, transparency of methods]

## Major Concerns
[List 1-3 critical issues that must be addressed before publication]

## Minor Concerns
[List specific, actionable suggestions for improvement]

## Questions for Authors
[2-3 specific questions that would clarify the authors' reasoning or methods]

## Recommendation
**Decision: [Accept / Minor Revision / Major Revision / Reject]**
Brief justification for this recommendation.

Be constructive, scholarly, and specific. Ground critiques in the manuscript content.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Manuscript:\n${manuscript}` },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    const result = completion.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("DeepSeek API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
