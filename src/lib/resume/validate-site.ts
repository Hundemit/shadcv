import { z } from "zod";
import type {
  ResumeContact,
  ResumeData,
  ResumeLabels,
} from "../../components/resume";
import type { WebsiteLabels } from "../../components/resume/toolbar";
export interface SiteConfig {
  url: string;
  title: string;
  description: string;
  homeHref: string;
  defaultLanguage: string;
  languages: {
    code: string;
    name: string;
    flag?: string;
    pdfFilename: string;
    resume: {
      website: WebsiteLabels;
      contact: ResumeContact;
      labels: ResumeLabels;
      content: Omit<ResumeData, "contact" | "labels" | "language">;
    };
  }[];
}

const text = z
  .string()
  .min(1)
  .refine((value) => value.trim() === value, "Remove surrounding whitespace");
const website = z.object({
  toolbar: text,
  language: text,
  appearance: text,
  light: text,
  dark: text,
  system: text,
  home: text,
  download: text,
  regenerate: text,
  regenerating: text,
  title: text,
  description: text,
});
const schema = z
  .object({
    url: z.url({ protocol: /^https?$/ }),
    title: text,
    description: text,
    homeHref: z.union([
      z.url({ protocol: /^https?$/ }),
      text.regex(/^\/(?!\/)[^\\\s]*$/),
    ]),
    defaultLanguage: text,
    languages: z
      .array(
        z.object({
          code: text.regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/),
          name: text,
          pdfFilename: text.regex(/^[a-zA-Z0-9_-]+\.pdf$/),
          resume: z.object({ website }),
        })
      )
      .min(1),
  })
  .superRefine((site, context) => {
    for (const key of ["code", "pdfFilename"] as const) {
      if (
        new Set(site.languages.map((item) => item[key].toLowerCase())).size !==
        site.languages.length
      )
        context.addIssue({
          code: "custom",
          path: ["languages"],
          message: `Duplicate ${key}`,
        });
    }
    if (!site.languages.some((item) => item.code === site.defaultLanguage))
      context.addIssue({
        code: "custom",
        path: ["defaultLanguage"],
        message: "Must be an enabled language",
      });
  });

export function validateSite(site: SiteConfig): SiteConfig {
  const result = schema.safeParse(site);
  if (!result.success)
    throw new Error(
      result.error.issues
        .map((issue) => `site.${issue.path.join(".")}: ${issue.message}`)
        .join("\n")
    );
  return site;
}
