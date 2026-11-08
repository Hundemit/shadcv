import { it, expect } from "vitest";
import { build } from "esbuild";
it("bundles the portable document using only its documented dependencies", async () => {
  const result = await build({
    entryPoints: ["src/components/resume/document/index.tsx"],
    bundle: true,
    write: false,
    packages: "external",
    metafile: true,
  });
  const imports = Object.values(result.metafile!.outputs).flatMap((output) =>
    output.imports.map((item) => item.path)
  );
  expect(
    imports.filter(
      (path) => !/^(react(?:\/.*)?|cn|@base-ui\/react\/.*)$/.test(path)
    )
  ).toEqual([]);
});
