import { site } from "../../data/resume/site";
import { getResume } from "../../data/resume";

export const siteUrl = site.url.replace(/\/$/, "");

export function resumeUrl(language: string) {
  const base = `${siteUrl}/`;
  return language === site.defaultLanguage
    ? base
    : `${base}?lang=${encodeURIComponent(language)}`;
}

export const resumeAlternates = {
  ...Object.fromEntries(
    site.languages.map(({ code }) => [code, resumeUrl(code)])
  ),
  "x-default": resumeUrl(site.defaultLanguage),
};

/**
 * Builds the Person schema from the selected resume.
 */
export function buildPersonSchema(lang: string = site.defaultLanguage) {
  const resume = getResume(lang);
  const skillsList =
    resume.skills?.flatMap((s) =>
      s.technologies.split(",").map((t) => t.trim())
    ) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: resume.contact.name,
    jobTitle: resume.role,
    description: resume.profile,
    url: resumeUrl(site.defaultLanguage),
    image: resume.contact.photo
      ? new URL(resume.contact.photo.src, site.url).href
      : undefined,
    sameAs: resume.contact.links?.map(({ href }) => href),
    knowsAbout: [...new Set(skillsList)],
  };
}

/**
 * Builds ProfilePage schema for /template.
 */
export function buildProfilePageSchema(lang: string) {
  const resume = getResume(lang);
  const person = buildPersonSchema(lang);

  const educationList = resume.education?.map((e) => ({
    "@type": "EducationalOccupationalCredential",
    name: e.title,
    recognizedBy: {
      "@type": "EducationalOrganization",
      name: e.organization,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${resumeUrl(resume.language)}#webpage`,
    url: resumeUrl(resume.language),
    name: `${resume.contact.name} — ${resume.role}`,
    description: resume.profile,
    inLanguage: resume.language,
    mainEntity: {
      ...person,
      hasCredential: educationList,
    },
  };
}

/**
 * Builds BreadcrumbList schema for structured navigation hierarchy.
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${siteUrl}${item.path}`,
    })),
  };
}
