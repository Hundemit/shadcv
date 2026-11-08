import { expect, it } from "vitest";
import { exampleSite as site } from "./example-site";
import { validateSite } from "../../src/lib/resume/validate-site";

it("accepts a single language and an additional language", () => {
  const single = {
    ...site,
    defaultLanguage: "en",
    languages: [site.languages[1]],
  };
  expect(validateSite(single)).toBe(single);
  const additional = {
    ...site,
    languages: [
      ...site.languages,
      {
        ...site.languages[1],
        code: "fr",
        name: "Français",
        pdfFilename: "resume-fr.pdf",
      },
    ],
  };
  expect(validateSite(additional)).toBe(additional);
});
it.each([
  [
    "duplicate languages",
    { ...site, languages: [site.languages[0], site.languages[0]] },
  ],
  [
    "unsafe filename",
    {
      ...site,
      languages: [{ ...site.languages[0], pdfFilename: "../private.pdf" }],
    },
  ],
  ["missing default", { ...site, defaultLanguage: "fr" }],
  ["invalid public URL", { ...site, url: "javascript:alert(1)" }],
  [
    "invalid locale code",
    { ...site, languages: [{ ...site.languages[0], code: 'de"' }] },
  ],
  [
    "missing website translation",
    {
      ...site,
      languages: [
        {
          ...site.languages[0],
          resume: {
            ...site.languages[0].resume,
            website: { ...site.languages[0].resume.website, system: "" },
          },
        },
      ],
    },
  ],
])("rejects %s", (_, config) => {
  expect(() => validateSite(config)).toThrow(/site/);
});

it("rejects filenames that collide on case-insensitive filesystems", () => {
  const first = site.languages[0];
  expect(() =>
    validateSite({
      ...site,
      languages: [
        first,
        {
          ...site.languages[1],
          pdfFilename: first.pdfFilename
            .toUpperCase()
            .replace(/\.PDF$/, ".pdf"),
        },
      ],
    })
  ).toThrow(/Duplicate pdfFilename/);
});
