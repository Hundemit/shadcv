import { expect, it } from "vitest";
import config from "../../next.config";
import { resumeUrl } from "../../src/lib/seo/schema";
it("uses the demo root as the resume canonical", () => {
  expect(resumeUrl("de")).toBe("https://demo.shadcv.de/");
  expect(resumeUrl("en")).toBe("https://demo.shadcv.de/?lang=en");
});
it("redirects both legacy routes to the root", async () => {
  expect(await config.redirects!()).toEqual(
    expect.arrayContaining([
      { source: "/template", destination: "/", permanent: true },
      { source: "/demo", destination: "/", permanent: true },
    ])
  );
});
