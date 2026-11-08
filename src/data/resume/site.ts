import { validateSite } from "../../lib/resume/validate-site";
import * as de from "./locales/de";
import * as en from "./locales/en";

// Public origin for this website and internal links in generated PDFs.
export const site = validateSite({
  url: "https://demo.shadcv.de",
  title: "ShadCN CV Kit",
  description:
    "A portable React resume document and bilingual Next.js website with themes and static A4 PDF downloads.",
  defaultLanguage: "de",
  homeHref: "/",
  languages: [
    {
      code: "de",
      name: "Deutsch",
      flag: "🇩🇪",
      pdfFilename: "jan-hindemit-de.pdf",
      resume: de,
    },
    {
      code: "en",
      name: "English",
      flag: "🇬🇧",
      pdfFilename: "jan-hindemit-en.pdf",
      resume: en,
    },
  ],
});

// Set false after replacing the personal demo with your own content.
export const demoMode = true;
