import { expect, test } from "@playwright/test";

test("shows the legal contact and privacy information in German", async ({
  page,
}) => {
  await page.goto("/impressum");
  await expect(page.getByRole("main")).toHaveAttribute("lang", "de");
  const address = page.locator("address");
  await expect(address).toContainText("Jan Hindemit");
  await expect(address).toContainText("Lesingstr 3");
  await expect(address).toContainText("24610 Trappenkamp");
  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!
  );
  expect(structuredData[0].mainEntity.address).toMatchObject({
    streetAddress: "Lesingstr 3",
    postalCode: "24610",
    addressLocality: "Trappenkamp",
  });
  await expect(address.getByRole("link", { name: /@/ })).toHaveAttribute(
    "href",
    /^mailto:(?!mail@example\.com$)/
  );
  await expect(
    page.getByRole("heading", { name: "Datenschutzerklärung" })
  ).toBeVisible();
  await expect(page.getByText(/localStorage/)).toBeVisible();
});

test("links to the public source from the resume footer", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", { name: "GitHub", exact: true })
  ).toHaveAttribute("href", "https://github.com/Hundemit/shadcv");
});

test("both deploy buttons open the public ShadCV template", async ({
  page,
}) => {
  await page.goto("/");
  const links = page.getByRole("link", { name: "Deploy with Vercel" });
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute(
      "href",
      "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHundemit%2Fshadcv"
    );
  }
});
