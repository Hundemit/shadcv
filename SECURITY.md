# Security reporting

Do not disclose vulnerabilities, credentials or private resume data in public issues, pull requests or discussions. Use the destination repository's **Security → Report a vulnerability** private reporting form when enabled. If it is absent, request a private reporting channel from the maintainer without describing the vulnerability publicly. Private reporting must be enabled before the initial public release.

Include affected versions, reproduction steps using fictional data, expected/actual behavior and impact. Never include real secrets. Rotate any exposed credentials before sharing a report. There is no response-time guarantee yet.

The PDF API is local-development tooling, not a production rendering service. It intentionally rejects production/Vercel and non-loopback or cross-origin requests. Keep browser, framework and dependencies updated; recheck advisories before each release.

## Dependency review — 2026-11-06

The production dependency audit reports no known advisories. The complete audit reports the low-severity advisory [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) in `deepmerge`, through the development dependency `shadcn`; no patched version is currently listed. The application does not invoke the CLI, but its package supplies the `shadcn/tailwind.css` build import, so it remains installed. Recheck both audits before release and reassess the dependency when a supported fix is available. This records a dated result, not a guarantee for future installations.
