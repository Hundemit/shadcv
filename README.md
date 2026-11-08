# ShadCN CV Kit &middot; React Resume Template

A modern, bilingual, accessible resume template and portable React document &mdash; crafted with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHundemit%2Fshadcv)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui)](https://ui.shadcn.com/)

---

[Visit the ShadCV website](https://shadcv.de/)

## Highlights

- 🧩 **Portable React Component (`ResumeDocument`)**: Zero Next.js, Zod, or i18n framework dependencies. Copy `src/components/resume/document/` into any React 19 + Tailwind 4 project.
- 🎨 **shadcn/ui & Tailwind CSS v4 Native**: Seamlessly inherits your host's CSS variables and design tokens (`card`, `muted-foreground`, `border`, font stacks).
- 🌐 **Bilingual by Default**: English and German out of the box with cleanly separated content, contact details, labels, and UI messages. Easily extensible to additional languages.
- 📱 **Responsive & Mobile-Reflow**: Reflows intelligently from a balanced two-column desktop A4 layout into an ergonomic, single-column reading experience for mobile recruiters.
- 🌓 **Theme-Aware**: Instant Light/Dark toggle with system preference detection and smooth transitions.
- 🖨️ **Static A4 PDF Export**: Local Playwright pipeline producing pixel-perfect, selectable-text PDFs with rollback protection and export locking.
- ♿ **Accessible & Semantic**: Built with Base UI primitives, semantic HTML5, screen-reader friendly headings, and `prefers-reduced-motion` support.

---

## Quick Start

### Prerequisites

- **Node.js**: `>=22.13 <23` (tested on Node 22)
- **pnpm**: `10.18.2` (enable via `corepack enable`)

### Installation & Development

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open your browser:

- **`http://localhost:3000/`** &mdash; Configured resume document with toolbar controls (`?lang=en` or `?lang=de`).

---

## Example Data

The live demo at `/` ships with **Jan Hindemit's real resume** as a working, authentic example. All features — bilingual content, PDF export, responsive layout, and theme switching — are demonstrated with actual data.

To use your own data, edit the locale files under `src/data/resume/locales/`:

```
src/data/resume/
├── site.ts                  ← URL, title, languages, PDF filenames
└── locales/
    ├── de/
    │   ├── contact.ts       ← Name, location, email, phone, links, photo
    │   ├── content.ts       ← Role, profile, work, education, skills, projects
    │   ├── labels.ts        ← Section headings (Profile, Work, Education…)
    │   └── website.ts       ← Toolbar and metadata strings
    └── en/
        └── …                ← Same structure for each additional language
```

> [!IMPORTANT]
> After editing resume content, regenerate the static PDFs:
>
> ```sh
> pnpm dev  # in one terminal
> pnpm resume:export http://localhost:3000
> ```
>
> Inspect the generated files in `public/` and commit them alongside your data changes.

> [!NOTE]
> When forking this template, refer to the **Customization Checklist** in [AGENTS.md](AGENTS.md#7-customization-checklist-when-forking-this-template) for files with hardcoded demo metadata (SEO schema, Impressum, Web Manifest, OpenGraph tags, and LLM text files).

---

## Two Ways to Use

### Path A: Copy the Portable Document Component

If you have an existing React application (Next.js, Vite, Remix, Astro), you can copy just the resume component without bringing any of the website boilerplate.

1. **Copy files into your project**:
   - `src/components/resume/document/` (all 9 component files)
   - `src/components/ui/avatar.tsx` and `src/components/ui/separator.tsx` (or adapt to your existing shadcn UI components)

2. **Verify host dependencies**:

   ```sh
   pnpm add @base-ui/react cn
   ```

   _The portable document requires React 19 and Tailwind CSS v4. It does not require Next.js, next-themes, Zod, or lucide-react._

3. **Render `ResumeDocument`**:
   ```tsx
   import {
     ResumeDocument,
     type ResumeData,
   } from "@/components/resume/document";

   const data: ResumeData = {
     language: "en",
     role: "Senior Software Engineer",
     contact: {
       name: "Alex Morgan",
       location: "Berlin, Germany",
       email: "alex@example.com",
       links: [{ label: "GitHub", href: "https://github.com/example" }],
     },
     labels: {
       profile: "Profile",
       work: "Work Experience",
       education: "Education",
       skills: "Skills",
       languages: "Languages",
       projects: "Projects",
     },
     profile:
       "Passionate software engineer focused on accessible web applications.",
     work: [
       {
         title: "Senior Developer",
         organization: "Acme Studio",
         period: "2021 – Present",
         stack: "TypeScript, React, Next.js",
         details: [
           {
             label: "Architecture",
             description: "Led migration to Tailwind CSS v4.",
           },
         ],
       },
     ],
     education: [
       {
         title: "B.Sc. Computer Science",
         organization: "Technical University",
         period: "2017 – 2021",
       },
     ],
     skills: [
       { category: "Frontend", technologies: "React, Next.js, Tailwind CSS" },
       { category: "Backend", technologies: "Node.js, PostgreSQL, GraphQL" },
     ],
     languages: [
       { name: "English", proficiency: "Native" },
       { name: "German", proficiency: "Fluent" },
     ],
     projects: [
       {
         title: "Open Source Tool",
         description: "A fast developer tool for web performance audits.",
         href: "https://github.com/example/tool",
         stack: "TypeScript, Playwright",
       },
     ],
   };

   export function MyResume() {
     return <ResumeDocument data={data} />;
   }
   ```

> [!TIP]
> **Container Queries**: To render the resume inside a dashboard widget, sidebar, or dialog, wrap it in a `@container/resume` parent. The document reflows according to container width rather than the viewport.

---

### Path B: Customize the Turnkey Next.js Website

To use the complete website with multi-language switching, theme toggle, and PDF downloads:

#### 1. Site Configuration (`src/data/resume/site.ts`)

Set your public URL, metadata, default language, and registered locales:

```ts
export const site = validateSite({
  url: "https://yourdomain.com",
  title: "Alex Morgan — Resume",
  description: "Senior Software Engineer CV",
  defaultLanguage: "en",
  homeHref: "/",
  languages: [
    {
      code: "en",
      name: "English",
      flag: "🇬🇧",
      pdfFilename: "alex-morgan-en.pdf",
      resume: en,
    },
    {
      code: "de",
      name: "Deutsch",
      flag: "🇩🇪",
      pdfFilename: "alex-morgan-de.pdf",
      resume: de,
    },
  ],
});
```

#### 2. Edit Locale Data (`src/data/resume/locales/<lang>/`)

Each locale is cleanly separated into four files:

- **`contact.ts`**: Personal details (name, location, email, phone, links, optional photo).
- **`content.ts`**: Role title, profile summary, work experience, education, skills, and projects.
- **`labels.ts`**: Headings for resume sections (`profile`, `work`, `education`, `skills`, `languages`, `projects`).
- **`website.ts`**: UI strings for the toolbar, theme switch, PDF download labels, and page metadata.

> [!NOTE]
> Zod runtime validation runs on build/import. If a required field is missing or an email/URL is malformed, you will get an immediate, descriptive error.

---

## Static PDF Generation

PDF downloads serve pre-rendered static files located in `public/`. Modifying website data does not automatically update static PDFs.

```sh
# 1. Install Playwright Chromium (one-time setup)
pnpm exec playwright install chromium

# 2. Start the dev server in one terminal
pnpm dev

# 3. Export static PDFs for all registered languages
pnpm resume:export http://localhost:3000

# Optional: export with dark theme
pnpm resume:export http://localhost:3000 dark
```

- **Rollback protection**: The exporter writes to a temporary staging directory and verifies all registered PDFs before publishing. If any language fails, existing PDFs in `public/` are preserved.
- **Export locking**: Prevents concurrent export jobs from corrupting files.
- **Local development button**: In local development, the toolbar contains a refresh icon button calling `/api/resume/export` to regenerate PDFs directly from the browser.

---

## Layout & Appearance Settings

Global presentation defaults are configured in `resumeSettings` inside `src/components/resume/resume.tsx`:

```ts
export const resumeSettings: ResumeSettings = {
  maxWidth: "210mm", // Max width on desktop (standard A4 width)
  pagePadding: { mobile: "0.5rem", desktop: "2rem" },
  pagePaddingY: { mobile: "0.5rem", desktop: "2rem" },
  documentPaddingMobile: "4mm",
  documentPaddingDesktop: "8mm",
  pdfPageMargin: null, // null inherits document padding; or e.g. "10mm"
  sectionGap: "1.25rem",
  columnGap: "1.25rem",
  theme: "inherit", // "inherit" follows site; or force "light" / "dark"
  showToolbar: true,
  toolbarControls: { language: true, theme: true, pdf: true },
  fontSize: "0.875rem",
  lineHeight: 1.5,
  letterSpacing: "0em",
  showBorder: true,
};
```

You can also pass custom `settings` overrides directly to the `<Resume />` wrapper component:

```tsx
<Resume data={resumeData} settings={{ maxWidth: "800px", showBorder: false }} />
```

---

## Verification & Testing

Run all quality checks before deploying or contributing:

```sh
# Comprehensive CI check (Prettier, ESLint, TypeScript, Vitest, export tests, Next.js build)
pnpm check

# Browser tests across Chromium, Firefox, and WebKit (requires production build on port 3100)
pnpm exec playwright install chromium firefox webkit
pnpm test:browser

# Individual scripts
pnpm test          # Unit tests (Vitest)
pnpm test:export   # Exporter recovery and staging tests
pnpm lint          # ESLint
pnpm typecheck     # Next.js type generation & TypeScript check
pnpm format:check  # Prettier formatting verification
```

---

## Demo ownership and indexing

The official demo uses Jan Hindemit’s real data and authorized portrait. Replace contact details, every locale, portrait, PDFs and the operator information in `src/app/impressum/page.tsx` before publishing your own resume. The MIT license applies to the code. Personal demo content and portrait are supplied to demonstrate this project, not as another person’s identity or reusable stock assets.

Set your public origin in `src/data/resume/site.ts`, then set `demoMode` to false to enable indexing after customization. Regenerate every PDF after changing content or the public origin. The official demo is https://demo.shadcv.de/ and the product website is https://shadcv.de/.

## Deployment

### Deploy to Vercel

The fastest way to deploy your resume is using [Vercel](https://vercel.com):

1. Click the button below:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHundemit%2Fshadcv)

2. Configure your project:
   - Framework Preset: **Next.js**
   - Node.js Version: **22.x**
   - Package Manager: **pnpm**
3. Ensure `site.url` in `src/data/resume/site.ts` matches your custom production domain.
4. Export and commit your static PDFs (`public/*.pdf`) before deploying.

---

## Deutsch: Schnellstart

1. **Voraussetzungen**: Node.js 22 (`>=22.13 <23`) und pnpm `10.18.2` bereitstellen.
2. **Installation & Start**:
   ```sh
   corepack enable
   pnpm install --frozen-lockfile
   pnpm dev
   ```
   - `http://localhost:3000/` &mdash; Vollständiger Lebenslauf (`?lang=de` oder `?lang=en`).
3. **Inhalte & Kontaktdaten anpassen**:
   - `src/data/resume/locales/de/` und `src/data/resume/locales/en/`: `contact.ts`, `content.ts`, `labels.ts` und `website.ts` mit den eigenen Daten befüllen.
   - `src/data/resume/site.ts`: Öffentliche Domain (`url`), Standard-Sprache (`defaultLanguage`) und PDF-Dateinamen festlegen.
4. **Statische PDFs erzeugen**:
   ```sh
   pnpm exec playwright install chromium
   # Bei laufendem Entwicklungsserver:
   pnpm resume:export http://localhost:3000
   ```
   Die erzeugten PDFs in `public/` prüfen und zusammen mit den Daten im Git einchecken.
5. **Qualitätssicherung & Tests**:
   ```sh
   pnpm check
   pnpm test:browser
   ```
6. **Deployen**: Das Repository auf Vercel importieren (Node 22, pnpm). Keine Datenbank oder API-Schlüssel erforderlich.

---

## AI Agents & Automation

Working with an AI coding assistant (such as Antigravity, Claude Code, Cursor, or Copilot)?
Refer to **[AGENTS.md](AGENTS.md)** for architecture guidelines, component isolation boundaries, Zod data contracts, and integration workflows.

---

## License & Contributing

- **License**: [MIT](LICENSE) &copy; 2026 Jan Hindemit.
- **Contributions**: Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.
- **Security**: For reporting security vulnerabilities, refer to [SECURITY.md](SECURITY.md).
- **Changelog**: See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
