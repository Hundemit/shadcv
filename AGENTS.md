# ShadCV public template

## Framework and tooling

Read the applicable installed Next.js guides under node_modules/next/dist/docs before framework edits. Inspect git status and preserve unrelated changes. Use Node >=22.13 <23 and pnpm 10.18.2. Install with pnpm install --frozen-lockfile.

## Architecture

The resume is served at /. /template and /demo redirect to / with query parameters preserved. Marketing is maintained separately at https://shadcv.de. This repository is the authoritative source for reusable resume code.

ResumeDocument in src/components/resume/document is portable. Preserve its exported types and relative UI imports. React, Base UI and cn are allowed. Keep Next.js, validation, routing, translation providers and export controls outside this subtree. Use static Tailwind 4 classes and host shadcn tokens. Keep shadcn UI modules unmodified.

Resume composes Toolbar and ResumeDocument. Locale contact, content, labels and website translations live separately under src/data/resume/locales. Register languages only in src/data/resume/site.ts. Preserve optional sections and default-language fallback.

## Personal demo

Jan Hindemit authorized the existing facts, portrait and PDFs for this official demo. Preserve supplied facts and ask about ambiguities. Integrators must replace the demo data, portrait, PDFs and legal notice with their own authorized content. Never copy environment files. The official demo origin is https://demo.shadcv.de. demoMode in site.ts controls indexing and sitemap inclusion; users disable it after customization.

## PDF and verification

Downloads serve static PDFs. After content or print-layout changes, run a local development server and pnpm resume:export http://localhost:3000. Generate every enabled language and inspect every page. Preserve A4, selectable text, public links, screen-theme export, light browser-print behavior and readable multipage layout.

Preserve development-only export, local origin/host checks, network isolation, locking, staged replacement and rollback. Never remove a lock before verifying no export process is running.

Run pnpm check, then pnpm test:browser for behavior changes. Browser tests use the production build on port 3100. Verify portable-component changes in a separate React host when available. Document actual checks in MIGRATION.md or the handoff. Documentation is English with a German quickstart.
