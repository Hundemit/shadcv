import { site } from "../../src/data/resume/site";
import { expect, test } from "@playwright/test";

const primary = site.languages.find(
  (item) => item.code === site.defaultLanguage
)!;
const other = site.languages.find((item) => item.code !== site.defaultLanguage);
const labels = primary.resume.website;

test("switches the document through the language dropdown", async ({
  page,
}) => {
  if (!other) {
    await page.goto("/?lang=unknown");
    await expect(
      page.getByRole("button", { name: labels.language, exact: true })
    ).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("lang", primary.code);
    return;
  }
  await page.goto("/");
  await page
    .getByRole("button", { name: labels.language, exact: true })
    .click();
  await expect(
    page.getByRole("menuitem", { name: primary.name, exact: true })
  ).toBeVisible();
  await page.getByRole("menuitem", { name: other.name, exact: true }).click();
  await expect(page).toHaveURL(`/?lang=${encodeURIComponent(other.code)}`);
  await expect(page.locator("html")).toHaveAttribute("lang", other.code);
  await expect(page.getByRole("article")).toHaveAttribute("lang", other.code);
  await expect(
    page.getByRole("heading", { name: other.resume.contact.name })
  ).toBeVisible();
  await expect(page).toHaveTitle(
    `${other.resume.contact.name} — ${other.resume.website.title}`
  );
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("lang", primary.code);
  await page.goForward();
  await expect(page.locator("html")).toHaveAttribute("lang", other.code);
  await page.reload();
  await page
    .getByRole("button", { name: other.resume.website.language, exact: true })
    .click();
  await expect(
    page.getByRole("menuitem", { name: other.name, exact: true })
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", {
      name: other.resume.website.language,
      exact: true,
    })
  ).toBeFocused();
  for (const entry of site.languages.filter(
    (item) => item !== primary && item !== other
  )) {
    await page.goto("/");
    await page
      .getByRole("button", { name: labels.language, exact: true })
      .click();
    await page.getByRole("menuitem", { name: entry.name, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", entry.code);
    await expect(page.getByRole("article")).toHaveAttribute("lang", entry.code);
    await expect(page).toHaveTitle(
      `${entry.resume.contact.name} — ${entry.resume.website.title}`
    );
    if (!entry.flag)
      await expect(
        page.getByRole("button", {
          name: entry.resume.website.language,
          exact: true,
        })
      ).toHaveText(entry.code);
  }
  await page.goto("/?lang=unknown");
  await expect(page.locator("html")).toHaveAttribute("lang", primary.code);
});

test("toggle returns to system when the selected color matches the OS", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: labels.appearance,
    exact: true,
  });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme")))
    .toBe("dark");
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme")))
    .toBe("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme")))
    .toBe("light");
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await toggle.click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("theme")))
    .toBe("system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("does not load external development scripts in production", async ({
  page,
}) => {
  const externalScripts: string[] = [];
  page.on("request", (request) => {
    if (
      request.resourceType() === "script" &&
      new URL(request.url()).origin !== "http://127.0.0.1:3100"
    )
      externalScripts.push(request.url());
  });
  await page.goto("/");
  expect(externalScripts).toEqual([]);
});

test("downloads the stored language PDF and excludes local export in production", async ({
  page,
  request,
}) => {
  for (const { code, pdfFilename: filename, resume } of site.languages) {
    await page.goto(`/?lang=${code}`);
    const link = page.getByRole("link", { name: resume.website.download });
    await expect(
      page.getByRole("button", { name: resume.website.regenerate })
    ).toHaveCount(0);
    await expect(link).toHaveAttribute("href", `/${filename}`);
    const pending = page.waitForEvent("download");
    await link.click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(filename);
    const { readFile } = await import("node:fs/promises");
    const bytes = await readFile((await download.path())!);
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.equals(await readFile(`public/${filename}`))).toBe(true);
  }
  expect((await request.post("/api/resume/export")).status()).toBe(404);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320
  );
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("toolbar")).toBeHidden();
});

test("opens the language menu with the keyboard and shares toolbar styling", async ({
  page,
}) => {
  if (!other) {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: labels.language })
    ).toHaveCount(0);
    return;
  }
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: labels.language,
    exact: true,
  });
  await trigger.focus();
  await trigger.press("Enter");
  await expect(
    page.getByRole("menuitem", { name: primary.name, exact: true })
  ).toBeVisible();
  await page.getByRole("menuitem", { name: other.name, exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(`/?lang=${encodeURIComponent(other.code)}`);
  const otherTrigger = page.getByRole("button", {
    name: other.resume.website.language,
    exact: true,
  });
  const appearance = (element: HTMLElement | SVGElement) => {
    const css = getComputedStyle(element);
    return {
      height: css.height,
      fontSize: css.fontSize,
      borderBottom: css.borderBottomWidth,
      bottomRight: css.borderBottomRightRadius,
    };
  };
  expect(await otherTrigger.evaluate(appearance)).toEqual(
    await page
      .getByRole("link", { name: other.resume.website.download })
      .evaluate(appearance)
  );
  await page.setViewportSize({ width: 320, height: 740 });
  await otherTrigger.click();
  await expect(
    page.getByRole("menuitem", { name: other.name, exact: true })
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320
  );
});

test("keyboard focus has a contrasting outline in light and dark mode", async ({
  page,
}) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    const button = page.getByRole("button", {
      name: labels.appearance,
      exact: true,
    });
    await expect(button).toBeEnabled();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Deploy with Vercel" }).first()
    ).toBeFocused();
    const home = page
      .getByRole("toolbar")
      .getByRole("link", { name: labels.home, exact: true });
    if (await home.isVisible()) {
      await page.keyboard.press("Tab");
      await expect(home).toBeFocused();
    }
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    await expect
      .poll(() =>
        button.evaluate((element) => {
          const style = getComputedStyle(element);
          if (
            style.outlineStyle === "none" ||
            parseFloat(style.outlineWidth) < 2
          )
            return 0;
          const canvas = document.createElement("canvas").getContext("2d")!;
          const background = getComputedStyle(
            document.querySelector("main")!
          ).backgroundColor;
          const luminance = (color: string) => {
            canvas.fillStyle = background;
            canvas.fillRect(0, 0, 1, 1);
            canvas.fillStyle = color;
            canvas.fillRect(0, 0, 1, 1);
            return Array.from(canvas.getImageData(0, 0, 1, 1).data)
              .slice(0, 3)
              .map((v) => v / 255)
              .map((v) =>
                v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
              )
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          };
          const a = luminance(style.outlineColor),
            b = luminance(background);
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        })
      )
      .toBeGreaterThanOrEqual(3);
  }
});

test("hides the redundant home link on the resume root", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await expect(
    page.getByRole("toolbar").getByRole("link", { name: labels.home })
  ).toHaveCount(0);
});
