import { build } from "esbuild";
import { fileURLToPath } from "node:url";
export async function loadSiteConfig() {
  const result = await build({
    entryPoints: [
      fileURLToPath(new URL("../src/data/resume/site.ts", import.meta.url)),
    ],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
  });
  const bundledConfig = await import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
  );
  return bundledConfig.site;
}
