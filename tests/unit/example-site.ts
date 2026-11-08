import { validateResume } from "../../src/lib/resume/validate-resume";
import { example } from "./example-resume";
import { labels as deLabels } from "../../src/data/resume/locales/de/labels";
import { labels as enLabels } from "../../src/data/resume/locales/en/labels";
import { website as deWebsite } from "../../src/data/resume/locales/de/website";
import { website as enWebsite } from "../../src/data/resume/locales/en/website";
const content = {
  ...example,
  projects: [{ title: "Example", description: "A fictional design project." }],
};
const de = {
  contact: { ...example.contact },
  labels: deLabels,
  website: { ...deWebsite, description: "Beispiel" },
  content,
};
const en = {
  contact: { ...example.contact, location: "Berlin, Germany" },
  labels: enLabels,
  website: { ...enWebsite, description: "Example" },
  content,
};
export const exampleSite = {
  url: "https://example.com",
  title: "Example",
  description: "Fictional resume",
  homeHref: "/",
  defaultLanguage: "de",
  languages: [
    { code: "de", name: "Deutsch", pdfFilename: "example-de.pdf", resume: de },
    { code: "en", name: "English", pdfFilename: "example-en.pdf", resume: en },
  ],
};
export function exampleResume(code: string) {
  const locale = exampleSite.languages.find(
    (item) => item.code === code
  )!.resume;
  return validateResume(
    {
      ...locale.content,
      language: code,
      contact: locale.contact,
      labels: locale.labels,
    },
    code
  );
}
