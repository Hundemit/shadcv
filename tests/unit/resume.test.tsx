import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDocument } from "../../src/components/resume/document";
import { ResumeSection } from "../../src/components/resume/document/section";
import { validateResume } from "../../src/lib/resume/validate-resume";
import {
  exampleSite as site,
  exampleResume as getResume,
} from "./example-site";
import { resolveLanguage } from "../../src/data/resume";

describe("resume data", () => {
  it.each(["de", "en"])("validates the complete %s example", (language) => {
    const data = getResume(language);
    expect(validateResume(data, language)).toEqual(data);
    expect(data.contact.name).toBe(
      site.languages.find((item) => item.code === language)!.resume.contact.name
    );
  });
  it("keeps contact details independent for each locale", () => {
    expect(getResume("de").contact.location).toBe(
      site.languages[0].resume.contact.location
    );
    expect(getResume("en").contact.location).toBe(
      site.languages[1].resume.contact.location
    );
    expect(getResume("de").contact).not.toBe(getResume("en").contact);
  });
  it("accepts a minimal dataset without optional sections or contact methods", () => {
    const { labels, language } = getResume("de");
    expect(
      validateResume(
        { labels, language, contact: { name: "Alex" }, role: "Developer" },
        "de"
      )
    ).toMatchObject({ contact: { name: "Alex" } });
  });
  it.each([
    [
      "contact.name",
      (data: ReturnType<typeof getResume>) => {
        data.contact.name = " ";
      },
    ],
    [
      "contact.links.0.href",
      (data: ReturnType<typeof getResume>) => {
        data.contact.links = [{ label: "Bad", href: "javascript:alert(1)" }];
      },
    ],
    [
      "labels.work",
      (data: ReturnType<typeof getResume>) => {
        data.labels.work = "";
      },
    ],
  ])("reports the language and invalid field %s", (path, mutate) => {
    const data = structuredClone(getResume("en"));
    mutate(data);
    expect(() => validateResume(data, "en")).toThrow(`en: ${path}`);
  });
  it("resolves only enabled languages and falls back safely", () => {
    expect(resolveLanguage("en", site)).toBe("en");
    expect(resolveLanguage("unknown", site)).toBe("de");
    expect(resolveLanguage(["en", "de"], site)).toBe("de");
    expect(resolveLanguage("toString", site)).toBe("de");
    expect(
      resolveLanguage("en", {
        defaultLanguage: "fr",
        languages: [{ code: "fr" }],
      })
    ).toBe("fr");
  });
});

describe("portable ResumeDocument", () => {
  it("renders section paragraphs and lists inside a valid block container", () => {
    const html = renderToStaticMarkup(
      <ResumeSection heading="Example">
        <p>Profile text</p>
        <ul>
          <li>Example</li>
        </ul>
      </ResumeSection>
    );
    expect(html).toContain('<div class="text-sm"><p>Profile text</p><ul>');
  });
  it("renders all sections with resolved text and native links", () => {
    const html = renderToStaticMarkup(
      <ResumeDocument data={getResume("en")} />
    );
    for (const text of [
      getResume("en").contact.name,
      "Work experience",
      "Education",
      "Tech stack",
      "Languages",
      "Projects",
    ])
      expect(html).toContain(text);
    expect(html).toContain('lang="en"');
    expect(html).toContain("<article");
    expect(html).toContain("<header");
    expect(html).toContain('data-slot="separator"');
    expect(html).toContain(`href="mailto:${getResume("en").contact.email}"`);
    expect(html).not.toContain("<img");
  });
  it("omits every empty optional section and its sidebar divider", () => {
    const data = {
      ...getResume("de"),
      profile: undefined,
      work: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
    };
    const html = renderToStaticMarkup(<ResumeDocument data={data} />);
    expect(html).not.toContain("<section");
    expect(html).not.toContain("<aside");
    expect(html).not.toContain("<h2");
  });
  it("accepts container styling and an optional photo", () => {
    const data = structuredClone(getResume("en"));
    data.contact.photo = { src: "/portrait.png", alt: "Portrait of Alex" };
    const html = renderToStaticMarkup(
      <ResumeDocument data={data} className="custom" style={{ opacity: 0.9 }} />
    );
    expect(html).not.toContain("data-resume-theme");
    expect(html).toContain("opacity:0.9");
    expect(html).toContain("custom");
    expect(html).toContain('aria-label="Portrait of Alex"');
  });
});
