# Repository split — 2026-11-08

Extracted from landing snapshot `332b18b`, tagged `backup/pre-repository-split-2026-11-08` in Hundemit/shadcv-landing. The public repository starts with fresh history. Jan Hindemit authorized the existing personal demo data, portrait and regenerated PDFs.

## Ownership

- Public source and issues — https://github.com/Hundemit/shadcv
- Official template — https://demo.shadcv.de/
- Marketing — https://shadcv.de/
- Local public checkout — /Users/hindemit/Documents/Github/shadcv-template

The portable document API is preserved. The website now serves the resume at `/`; legacy routes redirect with query parameters. The toolbar language links and exporter use `/`. `demoMode` in site.ts controls search indexing. Replace the public origin, all personal data and assets, and legal notice before publishing your own site.

## Verification

Initial complete `pnpm check` passed. Browser suite passed 52 tests with 2 existing Chromium-only PDF scenarios skipped on other engines. Both languages were regenerated and all four PDF pages visually inspected. Final verification and deployment results are recorded below as completed.
