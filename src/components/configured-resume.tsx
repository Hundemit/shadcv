import { Resume, type ResumeSettingsOverride } from "./resume/resume";
import { getResume } from "@/data/resume";
import { site } from "@/data/resume/site";

export interface ConfiguredResumeProps {
  language?: string;
  homeHref?: string;
  settings?: ResumeSettingsOverride;
}

export function ConfiguredResume({
  language = site.defaultLanguage,
  homeHref,
  settings,
}: ConfiguredResumeProps) {
  const locale = site.languages.find((item) => item.code === language)!;
  return (
    <Resume
      data={getResume(language)}
      settings={settings}
      toolbar={{
        languages: site.languages.map(({ code, name, flag }) => ({
          code,
          name,
          flag,
        })),
        pdfFilename: locale.pdfFilename,
        defaultLanguage: site.defaultLanguage,
        homeHref,
        labels: locale.resume.website,
      }}
    />
  );
}
