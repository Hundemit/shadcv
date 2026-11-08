import { loadSiteConfig } from "./site-config.mjs";
import { prepareResumePageForPdf } from "./resume-pdf-layout.mjs";
import { chromium } from "@playwright/test";
import {
  open,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

/** Render both languages before replacing any published PDF. Local tooling only. */
async function renderResumePdfs({
  origin = "http://localhost:3000",
  outputDirectory = join(projectRoot, "public"),
  config,
  theme = "light",
} = {}) {
  if (!["light", "dark"].includes(theme))
    throw new Error("Export theme must be light or dark");
  const site = config ?? (await loadSiteConfig());
  const languages = site.languages.map((item) => item.code);
  const filenames = new Map(
    site.languages.map((item) => [item.code, item.pdfFilename])
  );
  if (
    !languages.length ||
    new Set(languages).size !== languages.length ||
    new Set([...filenames.values()].map((name) => name.toLowerCase())).size !==
      languages.length ||
    [...filenames.values()].some((name) => !/^[a-zA-Z0-9_-]+\.pdf$/.test(name))
  )
    throw new Error(
      "Configure unique languages and safe PDF basenames in site.ts"
    );
  const url = new URL(origin);
  if (
    url.protocol !== "http:" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("Use a local HTTP origin, e.g. http://localhost:3000");
  }
  const browser = await chromium.launch({ headless: true });
  const documents = [];
  try {
    for (const language of languages) {
      const page = await browser.newPage({
        viewport: { width: 1000, height: 1200 },
        serviceWorkers: "block",
        reducedMotion: "reduce",
        colorScheme: theme,
      });
      // Browser routing only sees the first request of an HTTP redirect chain.
      // Fetch one response at a time and never hand a redirect back to Chromium.
      await page.routeWebSocket("**/*", (socket) => socket.close());
      await page.route("**/*", async (route) => {
        const target = new URL(route.request().url());
        if (route.request().resourceType() === "script") return route.abort();
        if (target.protocol === "data:") return route.continue();
        if (target.origin !== url.origin) return route.abort();
        const response = await route.fetch({ maxRedirects: 0 });
        try {
          if (response.status() >= 300 && response.status() < 400)
            return await route.abort();
          await route.fulfill({ response });
        } finally {
          await response.dispose();
        }
      });
      const response = await page.goto(
        `${url.origin}/?lang=${encodeURIComponent(language)}`,
        {
          waitUntil: "networkidle",
          timeout: 30000,
        }
      );
      if (!response?.ok()) {
        throw new Error(
          `Cannot render ${language}: HTTP ${response?.status()}`
        );
      }
      await page.locator(`article[lang="${language}"]`).waitFor();
      await page.evaluate((theme) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
      }, theme);
      const entry = site.languages.find((item) => item.code === language);
      await prepareResumePageForPdf(page, {
        website: site.url,
        photo: entry.resume?.contact?.photo,
      });
      documents.push(
        await page.pdf({
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
          tagged: true,
          outline: true,
        })
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }

  await mkdir(outputDirectory, { recursive: true });
  const staging = await mkdtemp(join(outputDirectory, ".resume-export-"));
  const previousFiles = new Set();
  try {
    // Stage both complete PDFs and backups on the same filesystem before renaming.
    for (const [index, language] of languages.entries()) {
      const filename = filenames.get(language);
      await writeFile(join(staging, filename), documents[index]);
      try {
        await writeFile(
          join(staging, `${filename}.backup`),
          await readFile(join(outputDirectory, filename))
        );
        previousFiles.add(filename);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
  await publishStagedPdfs(
    outputDirectory,
    staging,
    [...filenames.values()],
    previousFiles
  );
}

/** Keep recovery files on disk if the filesystem also fails during rollback. */
export async function publishStagedPdfs(
  outputDirectory,
  staging,
  names,
  previousFiles
) {
  const replaced = [];
  try {
    for (const filename of names) {
      await rename(join(staging, filename), join(outputDirectory, filename));
      replaced.push(filename);
    }
  } catch (error) {
    const failures = [];
    for (const filename of replaced.reverse()) {
      try {
        if (previousFiles.has(filename))
          await rename(
            join(staging, `${filename}.backup`),
            join(outputDirectory, filename)
          );
        else await rm(join(outputDirectory, filename));
      } catch (rollbackError) {
        failures.push(rollbackError);
      }
    }
    if (failures.length)
      throw new AggregateError(
        [error, ...failures],
        `PDF rollback incomplete. Recovery files retained at ${staging}`
      );
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
  await rm(staging, { recursive: true, force: true });
}

export async function exportResumePdfs(options = {}) {
  const outputDirectory =
    options.outputDirectory ?? join(projectRoot, "public");
  await mkdir(outputDirectory, { recursive: true });
  const lockPath = join(outputDirectory, ".resume-export.lock");
  let lock;
  try {
    lock = await open(lockPath, "wx");
  } catch (error) {
    if (error.code === "EEXIST")
      throw new Error("A PDF export is already running");
    throw error;
  }
  try {
    return await renderResumePdfs({ ...options, outputDirectory });
  } finally {
    await lock.close();
    await rm(lockPath, { force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    if (process.argv.length > 4)
      throw new Error(
        "Usage: pnpm resume:export [http://localhost:3000] [light|dark]"
      );
    await exportResumePdfs({ origin: process.argv[2], theme: process.argv[3] });
    console.log(
      "Exported all configured PDF files to public/. Review the PDFs before committing."
    );
  } catch (error) {
    console.error(`Resume export failed: ${error.message}`);
    process.exitCode = 1;
  }
}
