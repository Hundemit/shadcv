import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Toolbar } from "../../src/components/resume/toolbar";
import { website } from "../../src/data/resume/locales/de/website";

it("omits language navigation with one configured language", () => {
  const html = renderToStaticMarkup(
    <Toolbar
      pdfFilename="resume-de.pdf"
      homeHref="/"
      defaultLanguage="de"
      language="de"
      languages={[{ code: "de", name: "Deutsch" }]}
      labels={website}
    />
  );
  expect(html).not.toContain(`aria-label="${website.language}"`);
  expect(html).toContain(website.download);
});
it("renders the current language as a dropdown trigger before hydration", () => {
  const html = renderToStaticMarkup(
    <Toolbar
      pdfFilename="resume-de.pdf"
      homeHref="/"
      defaultLanguage="de"
      language="en"
      languages={[
        { code: "de", name: "Deutsch" },
        { code: "en", name: "English" },
      ]}
      labels={website}
    />
  );
  expect(html).toContain('data-slot="dropdown-menu-trigger"');
  expect(html).toContain(`aria-label="${website.language}"`);
  expect(html).toContain('aria-haspopup="menu"');
});

it("omits the home button when homeHref is undefined", () => {
  const html = renderToStaticMarkup(
    <Toolbar
      pdfFilename="resume-de.pdf"
      defaultLanguage="de"
      language="de"
      languages={[{ code: "de", name: "Deutsch" }]}
      labels={website}
    />
  );
  expect(html).not.toContain(website.home);
});

it("renders the home button when homeHref is provided", () => {
  const html = renderToStaticMarkup(
    <Toolbar
      pdfFilename="resume-de.pdf"
      homeHref="/portfolio"
      defaultLanguage="de"
      language="de"
      languages={[{ code: "de", name: "Deutsch" }]}
      labels={website}
    />
  );
  expect(html).toContain('href="/portfolio"');
  expect(html).toContain(website.home);
});
