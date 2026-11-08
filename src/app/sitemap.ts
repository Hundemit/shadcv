import type { MetadataRoute } from "next";
import { site, demoMode } from "../data/resume/site";
import { resumeAlternates, resumeUrl } from "../lib/seo/schema";
export default function sitemap(): MetadataRoute.Sitemap {
  return demoMode
    ? []
    : site.languages.map(({ code }) => ({
        url: resumeUrl(code),
        alternates: { languages: resumeAlternates },
      }));
}
