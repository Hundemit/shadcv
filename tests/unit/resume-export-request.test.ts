import { expect, it } from "vitest";
import { getLocalResumeExportOrigin } from "../../src/lib/resume/resume-export-request";
function request(
  url: string,
  origin = new URL(url).origin,
  host = new URL(url).host
) {
  return new Request(url, { method: "POST", headers: { origin, host } });
}
it.each([
  "http://localhost:3000",
  "http://127.0.0.1:3109",
  "http://[::1]:3000",
])("allows same-origin loopback %s", (origin) => {
  expect(
    getLocalResumeExportOrigin(request(`${origin}/api/resume/export`))
  ).toBe(origin);
});
it("rejects remote, missing, null and mismatched origins or hosts", () => {
  for (const value of [
    request("https://example.com/api/resume/export"),
    request("http://localhost.evil.test/api/resume/export"),
    request("http://localhost:3000/api/resume/export", "null"),
    request("http://localhost:3000/api/resume/export", "https://evil.test"),
    request("http://localhost:3000/api/resume/export", "http://localhost:3001"),
    request(
      "http://localhost:3000/api/resume/export",
      "http://localhost:3000",
      "evil.test"
    ),
    new Request("http://localhost:3000/api/resume/export"),
  ])
    expect(getLocalResumeExportOrigin(value)).toBeNull();
});
