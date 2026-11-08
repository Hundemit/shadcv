/** Adapted from the source's browser-based PDF preparation; keeps real text/links. */
export async function prepareResumePageForPdf(page, { website, photo }) {
  // Freeze transitions before switching media or measuring the shared padding.
  await page.addStyleTag({
    content: "* { animation: none !important; transition: none !important; }",
  });
  await page.emulateMedia({ media: "screen" });
  // The HTML document is server-rendered. Base UI normally loads its image after
  // hydration; print the same configured portrait without running client code.
  if (photo) {
    await page.evaluate(async ({ src, alt }) => {
      const target = new URL(src, location.href);
      if (target.origin !== location.origin)
        throw new Error(
          "PDF portraits must be served from the local export origin"
        );
      const avatar = document.querySelector('article [data-slot="avatar"]');
      if (!avatar)
        throw new Error("Configured PDF portrait container is missing");
      const image = new Image();
      image.src = target.href;
      image.alt = alt;
      image.style.cssText =
        "width:100%;height:100%;object-fit:cover;border-radius:inherit";
      await image.decode();
      avatar.replaceChildren(image);
    }, photo);
  }
  await page.evaluate(async (publicWebsite) => {
    await document.fonts.ready;
    const article = document.querySelector("article");
    const main = document.querySelector("main");
    // Keep the settings owner: detaching only the article loses inherited
    // typography and spacing variables supplied by Resume.
    const layout = article.closest("[data-resume-layout]") ?? article;
    main.replaceChildren(layout);
    for (const controls of main.querySelectorAll("[data-resume-actions]"))
      controls.remove();
    document.body.replaceChildren(main);

    for (const link of main.querySelectorAll("a[href]")) {
      const target = new URL(link.href);
      if (target.origin === location.origin)
        link.href = new URL(
          `${target.pathname}${target.search}${target.hash}`,
          publicWebsite
        ).href;
    }
    await Promise.all(Array.from(document.images, (image) => image.decode()));
  }, website);
  // Measure the desktop document before changing geometry. Repeated @page
  // margins replace article padding, so continuation pages get the same inset.
  const geometry = await page.evaluate(() => {
    const article = document.querySelector("article");
    const style = getComputedStyle(article);
    const paperWidth = (210 * 96) / 25.4;
    const paperHeight = (297 * 96) / 25.4;
    const width = Math.min(article.getBoundingClientRect().width, paperWidth);
    const configured = style.getPropertyValue("--pdf-page-margin").trim();
    let inset = style;
    let probe;
    if (configured) {
      if (!CSS.supports("padding", configured))
        throw new Error("Invalid pdfPageMargin: use non-negative CSS lengths");
      probe = document.createElement("div");
      probe.style.cssText =
        "position:absolute;visibility:hidden;width:0;height:0";
      probe.style.padding = configured;
      article.append(probe);
      inset = getComputedStyle(probe);
    }
    const margins = [
      inset.paddingTop,
      inset.paddingRight,
      inset.paddingBottom,
      inset.paddingLeft,
    ].map((value) => {
      if (!value.endsWith("px") || !Number.isFinite(parseFloat(value)))
        throw new Error("PDF margins must resolve to absolute lengths");
      return parseFloat(value);
    });
    probe?.remove();
    const center = Math.max(0, (paperWidth - width) / 2);
    margins[1] += center;
    margins[3] += center;
    if (
      margins[0] + margins[2] >= paperHeight ||
      margins[1] + margins[3] >= paperWidth
    )
      throw new Error("PDF margins leave no space for A4 content");
    return { margins, background: style.backgroundColor };
  });
  await page.addStyleTag({
    content: `
    @page { size: A4; margin: ${geometry.margins.map((value) => `${value}px`).join(" ")}; background: ${geometry.background}; }
    html, body, main { background: ${geometry.background} !important; margin: 0 !important; padding: 0 !important; min-height: 0 !important; height: auto !important; }
    [data-resume-layout] { margin: 0 !important; padding: 0 !important; }
    main, article { width: 100% !important; max-width: none !important; }
    article { min-height: 0 !important; padding: 0 !important; }
    * { filter: none !important; backdrop-filter: none !important; animation: none !important; transition: none !important; print-color-adjust: exact; }
    h2, h3 { break-after: avoid; } p, li { orphans: 3; widows: 3; }
    article section > div > ul > li { break-inside: avoid; }
  `,
  });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  );
}
