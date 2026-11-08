import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

// Real Chromium and a local HTTP fixture exercise rendering and safe publication.
test("exports both languages and preserves both previous PDFs when English fails", async () => {
  const { exportResumePdfs } = await import("./export-resume.mjs");
  const outputDirectory = await mkdtemp(join(tmpdir(), "resume-export-test-"));
  let failEnglish = false;
  let missingImage = false;
  const server = createServer((request, response) => {
    const language = new URL(request.url, "http://localhost").searchParams.get(
      "lang"
    );
    if (failEnglish && language === "en") {
      response.writeHead(500).end("Render unavailable");
      return;
    }
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(
      `<main><div><article lang="${language}"><h1>Alex Morgan</h1>${missingImage ? '<img src="/missing.png">' : ""}<h2>${language === "en" ? "Experience" : "Berufserfahrung"}</h2><p>ÄÖÜ äöü ß</p><a href="/blog/rangeview">Range View</a></article></div></main>`
    );
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    await exportResumePdfs({
      origin,
      outputDirectory,
      config: {
        url: "https://example.com",
        languages: [
          { code: "de", pdfFilename: "resume-de.pdf" },
          { code: "en", pdfFilename: "resume-en.pdf" },
        ],
      },
    });
    for (const language of ["de", "en"]) {
      const pdf = await readFile(
        join(outputDirectory, `resume-${language}.pdf`)
      );
      assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
      assert.match(
        pdf.toString("latin1"),
        /https:\/\/example.com\/blog\/rangeview/
      );
      assert.doesNotMatch(pdf.toString("latin1"), /127\.0\.0\.1/);
      await writeFile(
        join(outputDirectory, `resume-${language}.pdf`),
        `previous ${language}`
      );
    }
    failEnglish = true;
    await assert.rejects(
      exportResumePdfs({
        origin,
        outputDirectory,
        config: {
          url: "https://example.com",
          languages: [
            { code: "de", pdfFilename: "resume-de.pdf" },
            { code: "en", pdfFilename: "resume-en.pdf" },
          ],
        },
      }),
      /500/
    );
    for (const language of ["de", "en"]) {
      assert.equal(
        await readFile(join(outputDirectory, `resume-${language}.pdf`), "utf8"),
        `previous ${language}`
      );
    }
    failEnglish = false;
    missingImage = true;
    await assert.rejects(
      exportResumePdfs({
        origin,
        outputDirectory,
        config: {
          url: "https://example.com",
          languages: [
            { code: "de", pdfFilename: "resume-de.pdf" },
            { code: "en", pdfFilename: "resume-en.pdf" },
          ],
        },
      })
    );
    for (const language of ["de", "en"])
      assert.equal(
        await readFile(join(outputDirectory, `resume-${language}.pdf`), "utf8"),
        `previous ${language}`
      );
    await writeFile(join(outputDirectory, ".resume-export.lock"), "busy");
    await assert.rejects(
      exportResumePdfs({ origin, outputDirectory }),
      /already running/
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(outputDirectory, { recursive: true, force: true });
  }
});

test("rejects external or ambiguous render origins before exporting", async () => {
  const { exportResumePdfs } = await import("./export-resume.mjs");
  for (const origin of [
    "https://example.com",
    "http://localhost.evil.test",
    "file:///tmp/resume",
    "http://user:secret@localhost",
    "http://localhost/resume",
    "http://localhost?lang=en",
  ]) {
    await assert.rejects(exportResumePdfs({ origin }), /local HTTP origin/);
  }
});

test("missing browser preserves published PDFs and releases the export lock", async () => {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const { access } = await import("node:fs/promises");
  const directory = await mkdtemp(join(tmpdir(), "resume-no-browser-"));
  try {
    await writeFile(join(directory, "resume-de.pdf"), "previous de");
    await assert.rejects(
      promisify(execFile)(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `
      import { exportResumePdfs } from './scripts/export-resume.mjs';
      await exportResumePdfs({ outputDirectory: ${JSON.stringify(directory)}, config: { url: 'https://example.com', languages: [{ code: 'de', pdfFilename: 'resume-de.pdf' }] } });
    `,
        ],
        {
          env: {
            ...process.env,
            PLAYWRIGHT_BROWSERS_PATH: join(directory, "absent"),
          },
        }
      ),
      /Executable doesn't exist/
    );
    assert.equal(
      await readFile(join(directory, "resume-de.pdf"), "utf8"),
      "previous de"
    );
    await assert.rejects(access(join(directory, ".resume-export.lock")));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("does not follow a loopback asset redirect to another origin", async () => {
  const { exportResumePdfs } = await import("./export-resume.mjs");
  const outputDirectory = await mkdtemp(join(tmpdir(), "resume-redirect-"));
  let hits = 0;
  const external = createServer((_, res) => {
    hits++;
    res.end("outside");
  });
  await new Promise((resolve) => external.listen(0, "127.0.0.1", resolve));
  const server = createServer((req, res) => {
    if (req.url === "/redirect")
      res
        .writeHead(302, {
          Location: `http://127.0.0.1:${external.address().port}/outside`,
        })
        .end();
    else
      res
        .setHeader("Content-Type", "text/html")
        .end('<main><article lang="de"><img src="/redirect"></article></main>');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await assert.rejects(
      exportResumePdfs({
        origin: `http://127.0.0.1:${server.address().port}`,
        outputDirectory,
        config: {
          url: "https://example.com",
          languages: [{ code: "de", pdfFilename: "resume-de.pdf" }],
        },
      })
    );
    assert.equal(hits, 0, "redirected asset reached an unapproved origin");
  } finally {
    await Promise.all(
      [external, server].map(
        (item) => new Promise((resolve) => item.close(resolve))
      )
    );
    await rm(outputDirectory, { recursive: true, force: true });
  }
});

test("a publish failure restores old files and removes only newly created PDFs", async () => {
  const { publishStagedPdfs } = await import("./export-resume.mjs");
  const directory = await mkdtemp(join(tmpdir(), "resume-rollback-"));
  const staging = await mkdtemp(join(directory, ".stage-"));
  try {
    await writeFile(join(directory, "old.pdf"), "original");
    await writeFile(join(staging, "old.pdf.backup"), "original");
    for (const name of ["old.pdf", "new.pdf"])
      await writeFile(join(staging, name), "replacement");
    await assert.rejects(
      publishStagedPdfs(
        directory,
        staging,
        ["old.pdf", "new.pdf", "missing.pdf"],
        new Set(["old.pdf"])
      ),
      { code: "ENOENT" }
    );
    assert.equal(
      await readFile(join(directory, "old.pdf"), "utf8"),
      "original"
    );
    await assert.rejects(readFile(join(directory, "new.pdf")), {
      code: "ENOENT",
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("keeps recovery files and continues restoring other PDFs after rollback error", async () => {
  const { publishStagedPdfs } = await import("./export-resume.mjs");
  const directory = await mkdtemp(join(tmpdir(), "resume-recovery-"));
  const staging = await mkdtemp(join(directory, ".stage-"));
  try {
    for (const name of ["recover.pdf", "damaged.pdf"])
      await writeFile(join(staging, name), "replacement");
    await writeFile(join(staging, "recover.pdf.backup"), "recoverable");
    await writeFile(join(staging, "untouched.pdf.backup"), "spare backup");
    await assert.rejects(
      publishStagedPdfs(
        directory,
        staging,
        ["recover.pdf", "damaged.pdf", "missing.pdf"],
        new Set(["recover.pdf", "damaged.pdf"])
      ),
      /Recovery files retained/
    );
    assert.equal(
      await readFile(join(staging, "untouched.pdf.backup"), "utf8"),
      "spare backup"
    );
    assert.equal(
      await readFile(join(directory, "recover.pdf"), "utf8"),
      "recoverable"
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("renders a configured local portrait from the server-rendered Avatar without hydration", async () => {
  const { exportResumePdfs } = await import("./export-resume.mjs");
  const outputDirectory = await mkdtemp(join(tmpdir(), "resume-portrait-"));
  const server = createServer((req, res) => {
    if (req.url === "/portrait.svg")
      res
        .setHeader("Content-Type", "image/svg+xml")
        .end(
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="black"/></svg>'
        );
    else
      res
        .setHeader("Content-Type", "text/html")
        .end(
          '<main><article lang="de"><h1>Alex</h1><div data-slot="avatar" style="width:70px;height:70px">AM</div></article></main>'
        );
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await exportResumePdfs({
      origin: `http://127.0.0.1:${server.address().port}`,
      outputDirectory,
      config: {
        url: "https://example.com",
        languages: [
          {
            code: "de",
            pdfFilename: "resume-de.pdf",
            resume: {
              contact: {
                photo: { src: "/portrait.svg", alt: "Example portrait" },
              },
            },
          },
        ],
      },
    });
    assert.equal(
      (await readFile(join(outputDirectory, "resume-de.pdf")))
        .subarray(0, 5)
        .toString(),
      "%PDF-"
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(outputDirectory, { recursive: true, force: true });
  }
});

test("a second exporter cannot enter while the first is rendering", async () => {
  const { exportResumePdfs } = await import("./export-resume.mjs");
  const outputDirectory = await mkdtemp(join(tmpdir(), "resume-concurrent-"));
  const started = Promise.withResolvers();
  const release = Promise.withResolvers();
  const server = createServer(async (_, response) => {
    started.resolve();
    await release.promise;
    response
      .setHeader("Content-Type", "text/html")
      .end('<main><article lang="de">Example</article></main>');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const options = {
    origin: `http://127.0.0.1:${server.address().port}`,
    outputDirectory,
    config: {
      url: "https://example.com",
      languages: [{ code: "de", pdfFilename: "resume-de.pdf" }],
    },
  };
  const first = exportResumePdfs(options);
  try {
    await Promise.race([started.promise, first]);
    await assert.rejects(exportResumePdfs(options), /already running/);
  } finally {
    release.resolve();
    try {
      await first;
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await rm(outputDirectory, { recursive: true, force: true });
    }
  }
});

test("loads the nested resume site configuration independently of the working directory", async () => {
  const { loadSiteConfig } = await import("./site-config.mjs");
  const previousDirectory = process.cwd();
  try {
    process.chdir(tmpdir());
    const site = await loadSiteConfig();
    assert.ok(
      site.languages.some((entry) => entry.code === site.defaultLanguage)
    );
    assert.ok(
      site.languages.every((entry) => entry.pdfFilename.endsWith(".pdf"))
    );
  } finally {
    process.chdir(previousDirectory);
  }
});

test("PDF preparation preserves inherited layout settings and removes website controls", async () => {
  const { chromium } = await import("@playwright/test");
  const { prepareResumePageForPdf } = await import("./resume-pdf-layout.mjs");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(`<style>
      article { font-size: var(--document-font-size, 12px); line-height: var(--document-line-height, 1.4); letter-spacing: var(--document-tracking, 0px); }
      section { margin-top: var(--section-gap, 10px); column-gap: var(--column-gap, 10px); }
    </style><main><div data-resume-layout style="--document-font-size:18px;--document-line-height:1.8;--document-tracking:0.5px;--section-gap:32px;--column-gap:40px">
      <nav data-resume-actions>Website controls</nav><article lang="de">Example resume<section>Experience</section></article>
    </div></main>`);
    await prepareResumePageForPdf(page, { website: "https://example.com" });
    const styles = await page.locator("article").evaluate((article) => {
      const style = getComputedStyle(article);
      const section = getComputedStyle(article.querySelector("section"));
      return {
        fontSize: style.fontSize,
        lineHeight: parseFloat(style.lineHeight),
        tracking: style.letterSpacing,
        sectionGap: section.marginTop,
        columnGap: section.columnGap,
      };
    });
    assert.equal(styles.fontSize, "18px");
    assert.ok(Math.abs(styles.lineHeight - 32.4) < 0.01);
    assert.equal(styles.tracking, "0.5px");
    assert.equal(styles.sectionGap, "32px");
    assert.equal(styles.columnGap, "40px");
    assert.equal(await page.locator("[data-resume-actions]").count(), 0);
    assert.equal(
      (await page.pdf({ format: "A4" })).subarray(0, 5).toString(),
      "%PDF-"
    );
  } finally {
    await browser.close();
  }
});

test("PDF uses document padding as repeated page margins and preserves screen colors and border", async () => {
  const { chromium } = await import("@playwright/test");
  const { prepareResumePageForPdf } = await import("./resume-pdf-layout.mjs");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1000, height: 1200 },
    });
    await page.setContent(`<style>
      * { box-sizing: border-box; }
      article { width: 793.7px; padding: 24px; background: rgb(23,23,23); color: rgb(250,250,250); border-radius: 8px; box-shadow: 0 0 0 1px gray; }
      @media print { article { background: white; color: black; padding: 0; } }
    </style><main><div data-resume-layout><article>Example</article></div></main>`);
    await prepareResumePageForPdf(page, { website: "https://example.com" });
    const result = await page.locator("article").evaluate((article) => {
      const style = getComputedStyle(article);
      const rules = Array.from(document.styleSheets).flatMap((sheet) =>
        Array.from(sheet.cssRules)
      );
      const pageRules = rules.filter(
        (rule) => rule.constructor.name === "CSSPageRule"
      );
      return {
        background: style.backgroundColor,
        color: style.color,
        radius: style.borderRadius,
        shadow: style.boxShadow,
        margin: pageRules.at(-1).style.marginTop,
      };
    });
    assert.equal(result.background, "rgb(23, 23, 23)");
    assert.equal(result.color, "rgb(250, 250, 250)");
    assert.equal(result.radius, "8px");
    assert.notEqual(result.shadow, "none");
    assert.equal(result.margin, "24px");
    assert.equal(
      (await page.pdf({ preferCSSPageSize: true, printBackground: true }))
        .subarray(0, 5)
        .toString(),
      "%PDF-"
    );
  } finally {
    await browser.close();
  }
});

test("explicit PDF margin overrides the shared document inset and narrow documents stay centered", async () => {
  const { chromium } = await import("@playwright/test");
  const { prepareResumePageForPdf } = await import("./resume-pdf-layout.mjs");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(
      '<main><div data-resume-layout style="--pdf-page-margin:10mm"><article style="box-sizing:border-box;width:600px;padding:2px">Example</article></div></main>'
    );
    await prepareResumePageForPdf(page, { website: "https://example.com" });
    const margins = await page.evaluate(() => {
      const rules = Array.from(document.styleSheets).flatMap((sheet) =>
        Array.from(sheet.cssRules)
      );
      const style = rules
        .filter((rule) => rule.constructor.name === "CSSPageRule")
        .at(-1).style;
      return [
        parseFloat(style.marginTop),
        parseFloat(style.marginRight),
        parseFloat(style.marginBottom),
        parseFloat(style.marginLeft),
      ];
    });
    assert.ok(Math.abs(margins[0] - (10 * 96) / 25.4) < 0.01);
    assert.equal(margins[0], margins[2]);
    assert.equal(margins[1], margins[3]);
    assert.ok(
      Math.abs(
        margins[1] - ((10 * 96) / 25.4 + ((210 * 96) / 25.4 - 600) / 2)
      ) < 0.01
    );
    await page.pdf({ format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
});

test("invalid export theme is rejected before browser rendering", async () => {
  const { exportResumePdfs } = await import("./export-resume.mjs");
  const outputDirectory = await mkdtemp(join(tmpdir(), "resume-theme-"));
  try {
    await assert.rejects(
      exportResumePdfs({ outputDirectory, theme: "invalid" }),
      /theme must be light or dark/
    );
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
