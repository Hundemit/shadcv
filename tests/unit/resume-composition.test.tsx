import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Resume } from "../../src/components/resume";
import { exampleResume as getResume } from "./example-site";
import { website } from "../../src/data/resume/locales/en/website";

it("renders the toolbar before the document through one Resume entry point", () => {
  const html = renderToStaticMarkup(
    <Resume
      data={getResume("en")}
      toolbar={{
        languages: [
          { code: "de", name: "Deutsch", flag: "🇩🇪" },
          { code: "en", name: "English", flag: "🇬🇧" },
        ],
        defaultLanguage: "en",
        pdfFilename: "example-en.pdf",
        homeHref: "/portfolio",
        labels: website,
      }}
      className="embedded-resume"
      style={{ opacity: 0.9 }}
    />
  );

  expect(html).toContain('role="toolbar"');
  expect(html).toContain(`aria-label="${website.toolbar}"`);
  expect(html).toContain('href="/portfolio"');
  expect(html).toContain('href="/example-en.pdf"');
  expect(html).toContain("🇬🇧");
  expect(html).not.toContain("🇩🇪");
  expect(html).toContain("<article");
  expect(html).toContain('lang="en"');
  expect(html).toContain("Work experience");
  expect(html).toContain("embedded-resume");
  expect(html).toContain("opacity:0.9");
  expect(html.indexOf('role="toolbar"')).toBeLessThan(html.indexOf("<article"));
});
