import { describe, expect, it } from "vitest";
import {
  buildPersonSchema,
  buildProfilePageSchema,
  buildBreadcrumbSchema,
  siteUrl,
} from "../../src/lib/seo/schema";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";

describe("SEO and GEO Schema generators", () => {
  it("generates a public Person profile with professional facts and profile links", () => {
    const person = buildPersonSchema("de");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Jan Hindemit");
    expect(person.jobTitle).toBe("Softwareentwickler");
    expect(person).not.toHaveProperty("address");
    expect(person).not.toHaveProperty("email");
    expect(person).not.toHaveProperty("telephone");
    expect(person.sameAs).toContain("https://janhindemit.de");
    expect(person).not.toHaveProperty("givenName");
    expect(person.knowsAbout).toContain("React");
    expect(person.knowsAbout).toContain("TypeScript");
    expect(person.knowsAbout).toContain("Next.js");
  });

  it("generates ProfilePage schema for English and German locales", () => {
    const deProfile = buildProfilePageSchema("de");
    expect(deProfile["@type"]).toBe("ProfilePage");
    expect(deProfile.inLanguage).toBe("de");
    expect(deProfile.mainEntity.jobTitle).toBe("Softwareentwickler");

    const enProfile = buildProfilePageSchema("en");
    expect(enProfile["@type"]).toBe("ProfilePage");
    expect(enProfile.inLanguage).toBe("en");
    expect(enProfile.mainEntity.jobTitle).toBe("Software Developer");
    expect(enProfile.mainEntity["@id"]).toBe(deProfile.mainEntity["@id"]);
    expect(enProfile.mainEntity.url).toBe(deProfile.mainEntity.url);
    expect(enProfile.mainEntity).not.toHaveProperty("hasOccupation");
  });

  it("generates valid BreadcrumbList schema", () => {
    const breadcrumb = buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Template", path: "/" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${siteUrl}/`,
    });
    expect(breadcrumb.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Template",
      item: `${siteUrl}/`,
    });
  });
});

describe("Technical SEO routes: robots & sitemap", () => {
  it("provides robots rules with AI bot permissions and sitemap pointer", () => {
    const res = robots();
    expect(res.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(res.host).toBe(siteUrl);

    const rules = Array.isArray(res.rules) ? res.rules : [res.rules];
    const defaultRule = rules.find((r) => r.userAgent === "*");
    expect(defaultRule).toBeDefined();
    expect(defaultRule?.allow).toBe("/");

    const aiRule = rules.find(
      (r) => Array.isArray(r.userAgent) && r.userAgent.includes("GPTBot")
    );
    expect(aiRule).toBeDefined();
    expect(aiRule?.allow).toContain("/llms.txt");
  });

  it("omits noindex demo pages from the sitemap", () => {
    expect(sitemap()).toEqual([]);
  });
});
