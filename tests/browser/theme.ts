import { expect, type Locator } from "@playwright/test";

export async function expectCardTheme(article: Locator) {
  await expect
    .poll(() =>
      article.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--card)";
        element.append(probe);
        const expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return getComputedStyle(element).backgroundColor === expected;
      })
    )
    .toBe(true);
}
