import { prepareResumePageForPdf } from "../../scripts/resume-pdf-layout.mjs";
import { site } from "../../src/data/resume/site";
import { expectCardTheme } from "./theme";
import { expect, test } from "@playwright/test";

const locale = site.languages.find(
  (item) => item.code === site.defaultLanguage
)!.resume;
const sections = Object.entries(locale.labels).filter(
  ([key]) => locale.content[key as keyof typeof locale.labels]?.length
);

test("renders the complete resume on the template page without horizontal mobile overflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    locale.contact.name
  );
  await expect(page.getByRole("article")).toHaveAttribute(
    "lang",
    site.defaultLanguage
  );
  for (const [, name] of sections)
    await expect(
      page.getByRole("heading", { name, exact: true })
    ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(
    sections.length
  );
  await expectCardTheme(page.getByRole("article"));
  const work = page.getByRole("heading", {
    name: locale.labels.work,
    exact: true,
  });
  const skills = page.getByRole("heading", {
    name: locale.labels.skills,
    exact: true,
  });
  if (locale.content.work?.length && locale.content.skills?.length)
    expect((await skills.boundingBox())!.x).toBeGreaterThan(
      (await work.boundingBox())!.x
    );
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320
  );
  if (locale.content.work?.length && locale.content.skills?.length)
    expect((await skills.boundingBox())!.y).toBeGreaterThan(
      (await work.boundingBox())!.y
    );
});

test("stays readable without JavaScript and disables animation for reduced motion", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(
    page.getByRole("heading", { name: locale.contact.name })
  ).toBeVisible();
  await expect(
    page.locator("main > section").filter({ has: page.getByRole("article") })
  ).toHaveCSS("animation-name", "none");
  await context.close();
});

test("inherits shadcn tokens without changing document geometry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const article = page.getByRole("article");
  const before = await article.boundingBox();
  await page.evaluate(() => {
    document.documentElement.style.setProperty(
      "--card-foreground",
      "rgb(123, 52, 30)"
    );
    document.documentElement.style.setProperty("--card", "rgb(255, 247, 237)");
  });
  await expect(article).toHaveCSS("background-color", "rgb(255, 247, 237)");
  await expect(article.locator("header h1 + p")).toHaveCSS(
    "color",
    "rgb(123, 52, 30)"
  );
  expect(await article.boundingBox()).toEqual(before);
  await expect(article.locator("header")).toHaveCount(1);
  await expect(
    article.locator('[data-slot="separator"][data-orientation="horizontal"]')
  ).toHaveCount(sections.length);
});

test("uses the same resume fonts on screen and in print", async ({ page }) => {
  await page.goto("/");
  const article = page.getByRole("article");
  const heading = article.locator("h1");
  const screenFonts = await Promise.all([
    article.evaluate((element) => getComputedStyle(element).fontFamily),
    heading.evaluate((element) => getComputedStyle(element).fontFamily),
  ]);
  await page.emulateMedia({ media: "print" });
  expect(
    await article.evaluate((element) => getComputedStyle(element).fontFamily)
  ).toBe(screenFonts[0]);
  expect(
    await heading.evaluate((element) => getComputedStyle(element).fontFamily)
  ).toBe(screenFonts[1]);
});

test("prints both locales with embedded fonts and Unicode mappings", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Playwright PDF generation requires Chromium"
  );
  for (const { code: language } of site.languages) {
    await page.goto(`/?lang=${language}`);
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.fonts.ready);
    const pdf = (await page.pdf({ format: "A4" })).toString("latin1");
    expect(pdf).toMatch(/\/FontFile2\b|\/FontFile3\b/);
    expect(pdf).toMatch(/\/ToUnicode\b/);
  }
});

test("respects reduced motion for layout and menu transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main")).toHaveCSS("transition-property", "none");
  await expect(page.getByRole("article")).toHaveCSS(
    "transition-property",
    "none"
  );
});

test("layout settings control screen geometry, spacing and typography while print stays A4", async ({
  page,
}) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1400, height: 1000 });
  const article = page.getByRole("article");
  const wrapper = article.locator("..");
  await wrapper.evaluate((element) => {
    const style = (element as HTMLElement).style;
    style.setProperty("--document-width", "600px");
    style.setProperty("--document-padding-desktop", "20px");
    style.setProperty("--document-padding-mobile", "5mm");
    style.setProperty("--section-gap", "32px");
    style.setProperty("--column-gap", "40px");
    style.setProperty("--document-font-size", "16px");
    style.setProperty("--document-line-height", "1.8");
    style.setProperty("--document-tracking", "0.5px");
    style.setProperty("--document-ring-width", "0px");
  });
  await expect(article).toHaveCSS("max-width", "600px");
  await expect(page.getByRole("toolbar")).toHaveCSS("max-width", "600px");
  await expect(article).toHaveCSS("padding-left", "20px");
  await expect(article).toHaveCSS("font-size", "16px");
  expect(
    await article.evaluate((element) =>
      parseFloat(getComputedStyle(element).lineHeight)
    )
  ).toBeCloseTo(28.8, 2);
  await expect(article).toHaveCSS("letter-spacing", "0.5px");
  expect(
    await article
      .locator("section > div")
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).lineHeight))
  ).toBeCloseTo(28.8, 2);
  await expect(article.locator(":scope > div > header")).toHaveCSS(
    "margin-bottom",
    "32px"
  );
  await expect(article.locator(":scope > div > div.grid")).toHaveCSS(
    "column-gap",
    "40px"
  );
  await page.emulateMedia({ media: "print" });
  await expect(article).toHaveCSS("max-width", "none");
  await expect(article).toHaveCSS("padding-left", "0px");
  await expect(wrapper).toHaveCSS("padding-left", "0px");
  // Exercise the actual export preparation, which restructures the DOM.
  await prepareResumePageForPdf(page, { website: site.url, photo: undefined });
  await expect(article).toHaveCSS("font-size", "16px");
  await expect(article).toHaveCSS("letter-spacing", "0.5px");
  expect(
    await article
      .locator("section > div")
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).lineHeight))
  ).toBeCloseTo(28.8, 2);
  await expect(article.locator(":scope > div > header")).toHaveCSS(
    "margin-bottom",
    "32px"
  );
  await expect(article.locator(":scope > div > div.grid")).toHaveCSS(
    "column-gap",
    "40px"
  );
  await expect(page.getByRole("toolbar")).toHaveCount(0);
});

test("fixed local themes survive PDF export while ordinary printing stays light", async ({
  page,
}) => {
  await page.goto("/");
  const article = page.getByRole("article");
  const wrapper = article.locator("..");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await wrapper.evaluate((element) => element.classList.add("light"));
  await expect(article).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await wrapper.evaluate((element) => {
    element.classList.remove("light");
    element.classList.add("dark");
  });
  await expect(article).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await page.emulateMedia({ media: "print" });
  await expect(article).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await prepareResumePageForPdf(page, { website: site.url, photo: undefined });
  await expect(article).toHaveCSS("background-color", "rgb(23, 23, 23)");
  await expect(article).toHaveCSS("color", "rgb(250, 250, 250)");
});

test("prints the resume without the website greeting", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByText("Hello, welcome to my website", { exact: true })
  ).toBeHidden();
  await expect(page.getByRole("article")).toBeVisible();
});
