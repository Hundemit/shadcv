import { site } from "./site";
import { validateResume } from "../../lib/resume/validate-resume";
import type { ResumeData } from "../../components/resume/document/types";
// site.ts is the single registration point for enabled languages and their data.
const resumes = new Map(
  site.languages.map(({ code, resume }) => [
    code,
    validateResume(
      {
        ...resume.content,
        language: code,
        contact: resume.contact,
        labels: resume.labels,
      },
      code
    ),
  ])
);
if (!resumes.has(site.defaultLanguage))
  throw new Error("site.defaultLanguage must be an enabled language");

export function resolveLanguage(
  value: unknown,
  config: { defaultLanguage: string; languages: { code: string }[] } = site
): string {
  return typeof value === "string" &&
    config.languages.some(({ code }) => code === value)
    ? value
    : config.defaultLanguage;
}

export function getResume(language: unknown): ResumeData {
  return resumes.get(resolveLanguage(language))!;
}
