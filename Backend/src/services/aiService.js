import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEN_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall match score between the candidate and job description from 0 to 100"
    ),

  technicalQuestion: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .min(5)
    .describe("At least 5 personalized technical interview questions"),

  behavioralQuestion: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .min(3)
    .describe("At least 3 personalized behavioral interview questions"),

  skillGaps: z
    .array(
      z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"]),
      })
    )
    .min(1)
    .describe(
      "Actual skill gaps found by comparing resume with job description"
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().int().positive(),
        focus: z.string(),
        task: z.string(),
      })
    )
    .min(5)
    .describe("At least 5 days of interview preparation plan"),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated"
    ),
  strengths: z.array(z.string()).min(3).max(5),

  overallFeedback: z.string(),
  resumeAnalysis: z.object({
    atsScore: z.number().min(0).max(100),

    weaknesses: z.array(z.string()).min(3).max(5),

    missingKeywords: z.array(z.string()).min(3).max(8),

    suggestions: z.array(z.string()).min(3).max(6),
  }),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer, recruiter, and career advisor.

Analyze the candidate's resume, self-description, and job description carefully.

Your task is to create a personalized interview preparation report.

====================
CANDIDATE RESUME
====================
${resume}

====================
SELF DESCRIPTION
====================
${selfDescription}

====================
JOB DESCRIPTION
====================
${jobDescription}

====================
REQUIRED ANALYSIS
====================

1. MATCH SCORE

Calculate a realistic match score from 0 to 100.

Compare the candidate specifically against the job description.

Consider:
- Required technical skills
- Frontend skills
- Backend skills
- Database skills
- Projects
- Practical experience
- Work experience
- Education
- Job responsibilities

Do not give a high score simply because the candidate knows many technologies.

The score must be a number between 0 and 100.

2. TECHNICAL QUESTIONS

Generate at least 5 personalized technical interview questions.

Questions must be based on:
- Job description
- Resume
- Candidate projects
- Candidate experience
- Skill gaps

Include:
- Conceptual questions
- Practical questions
- Project-based questions
- Scenario-based questions

For every question provide:
- question
- intention
- answer

The answer should explain what the candidate should say and which important points should be covered.

3. BEHAVIORAL QUESTIONS

Generate at least 3 personalized behavioral interview questions.

Base them on:
- Candidate projects
- Experience
- Background
- Job responsibilities

For every question provide:
- question
- intention
- answer

4. SKILL GAPS

Compare the candidate's resume with the job requirements.

Only include genuine gaps.

Use:
- high = important requirement candidate lacks
- medium = candidate has limited experience
- low = minor gap

Do not mark a skill as a gap if the candidate clearly demonstrates it.

5. PREPARATION PLAN

Create at least a 5-day preparation plan.

Prioritize high-severity skill gaps first.

Every day must contain:
- day
- focus
- task

Tasks must be practical and actionable.

6. PERSONALIZATION

Do not provide generic career advice.

Use specific information from the candidate's resume and projects.

Return ONLY the requested structured JSON data.

7. STRENGTHS

Return 3-5 major strengths.

8. OVERALL FEEDBACK

Write a short executive summary.

9. RESUME ANALYSIS

Analyze the resume and return:

- ATS Score (0-100)
- 3-5 weaknesses in the resume
- 3-8 important ATS keywords missing from the resume
- 3-6 practical suggestions to improve the resume

Focus only on resume quality and ATS optimization.
Do not give hiring recommendations.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,

    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  const parsedResponse = JSON.parse(response.text);

  const validatedResponse = interviewReportSchema.parse(parsedResponse);

  return validatedResponse;
}

export default generateInterviewReport;
