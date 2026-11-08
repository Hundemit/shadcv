import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Resume } from "../../src/components/resume/resume";
import { site } from "../../src/data/resume/site";
import { getResume } from "../../src/data/resume";

const toolbar = {
  languages: site.languages.map(({ code, name }) => ({ code, name })),
  labels: site.languages[0].resume.website,
  pdfFilename: site.languages[0].pdfFilename,
  homeHref: "/",
  defaultLanguage: site.defaultLanguage,
};

describe("Resume settings", () => {
  it("hides theme switching for a fixed theme and independently hides PDF and language controls", () => {
    const html = renderToStaticMarkup(
      <Resume
        data={getResume("de")}
        toolbar={toolbar}
        settings={{
          theme: "dark",
          toolbarControls: { pdf: false, language: false },
        }}
      />
    );
    expect(html).not.toContain(toolbar.labels.appearance);
    expect(html).not.toContain("download=");
    expect(html).not.toContain(toolbar.labels.language);
    expect(html).toContain("<article");
  });
  it("keeps PDF download when only the language and theme controls are disabled", () => {
    const html = renderToStaticMarkup(
      <Resume
        data={getResume("de")}
        toolbar={toolbar}
        settings={{ toolbarControls: { language: false, theme: false } }}
      />
    );
    expect(html).toContain(`download="${toolbar.pdfFilename}"`);
    expect(html).not.toContain(toolbar.labels.appearance);
    expect(html).not.toContain(toolbar.labels.language);
  });

  it("supports a toolbar-free embedded resume with local layout and fixed theme", () => {
    const html = renderToStaticMarkup(
      <Resume
        data={getResume("de")}
        settings={{
          showToolbar: false,
          theme: "light",
          maxWidth: "60rem",
          sectionGap: "2rem",
        }}
      />
    );
    expect(html).not.toContain('role="toolbar"');
    expect(html).toContain('class="light');
    expect(html).toContain("--document-width:60rem");
    expect(html).toContain("--section-gap:2rem");
    expect(html).toContain("<article");
  });
});
