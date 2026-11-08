/** Only an explicit same-origin request to a loopback dev server may write PDFs. */
export function getLocalResumeExportOrigin(request: Request): string | null {
  const url = new URL(request.url);
  if (
    url.protocol !== "http:" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    request.headers.get("origin") !== url.origin ||
    request.headers.get("host") !== url.host
  ) {
    return null;
  }
  return url.origin;
}
