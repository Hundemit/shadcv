import { z } from "zod";
import type { ResumeData } from "../../components/resume/document/types";

const text = z.string().trim().min(1, "Must not be empty");
const publicUrl = z.url({ protocol: /^https?$/ });
const history = z.object({
  title: text,
  period: text,
  organization: text,
  stack: text.optional(),
  details: z.array(z.object({ label: text, description: text })).optional(),
});

export const resumeSchema: z.ZodType<ResumeData> = z.object({
  language: text,
  contact: z.object({
    name: text,
    location: text.optional(),
    email: z.email().optional(),
    phone: text.regex(/^\+?[\d ()-]+$/, "Use a phone number").optional(),
    links: z.array(z.object({ label: text, href: publicUrl })).optional(),
    photo: z
      .object({
        src: z.union([
          publicUrl,
          text.regex(
            /^\/(?!\/)[^\s\\]+$/,
            "Use a local /path or an HTTP(S) URL"
          ),
        ]),
        alt: text,
      })
      .optional(),
  }),
  role: text,
  labels: z.object({
    profile: text,
    work: text,
    education: text,
    skills: text,
    languages: text,
    projects: text,
  }),
  profile: text.optional(),
  work: z.array(history).optional(),
  education: z.array(history).optional(),
  skills: z.array(z.object({ category: text, technologies: text })).optional(),
  languages: z.array(z.object({ name: text, proficiency: text })).optional(),
  projects: z
    .array(
      z.object({
        title: text,
        description: text,
        href: publicUrl.optional(),
        stack: text.optional(),
      })
    )
    .optional(),
});

export function validateResume(input: unknown, language: string): ResumeData {
  const result = resumeSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      result.error.issues
        .map(
          (issue) => `${language}: ${issue.path.join(".")} — ${issue.message}`
        )
        .join("\n")
    );
  }
  if (result.data.language !== language)
    throw new Error(`${language}: language — must match the language file`);
  return result.data;
}
