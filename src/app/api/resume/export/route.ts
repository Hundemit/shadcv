import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { getLocalResumeExportOrigin } from "@/lib/resume/resume-export-request";

export const runtime = "nodejs";
const run = promisify(execFile);
let exporting = false;

export async function POST(request: Request) {
  // A visibility prop is UI configuration, never authorization to write files.
  if (process.env.NODE_ENV !== "development" || process.env.VERCEL) {
    return new Response(null, { status: 404 });
  }
  const origin = getLocalResumeExportOrigin(request);
  if (!origin)
    return Response.json(
      { error: "Nur lokal vom selben Ursprung erlaubt." },
      { status: 403 }
    );
  if (exporting)
    return Response.json(
      { error: "Ein PDF-Export läuft bereits." },
      { status: 409 }
    );

  let theme = "light";
  if (request.body) {
    try {
      const input: unknown = await request.json();
      if (
        !input ||
        typeof input !== "object" ||
        !("theme" in input) ||
        (input.theme !== "light" && input.theme !== "dark")
      )
        return Response.json(
          { error: "Theme muss light oder dark sein." },
          { status: 400 }
        );
      theme = input.theme;
    } catch {
      return Response.json(
        { error: "Ungültige Export-Einstellungen." },
        { status: 400 }
      );
    }
  }
  // Recheck after awaiting the request body to avoid admitting concurrent calls.
  if (exporting)
    return Response.json(
      { error: "Ein PDF-Export läuft bereits." },
      { status: 409 }
    );
  exporting = true;
  try {
    // Run the developer script outside Next's bundle, without a shell or user commands.
    await run(
      process.execPath,
      [join(process.cwd(), "scripts/export-resume.mjs"), origin, theme],
      {
        cwd: process.cwd(),
        timeout: 120_000,
        maxBuffer: 1024 * 1024,
      }
    );
    return Response.json(
      { message: "PDFs erstellt. Bitte prüfen und committen." },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Local resume export failed", error);
    return Response.json(
      {
        error:
          "PDF-Export fehlgeschlagen. Prüfe das Terminal und installiere bei Bedarf Chromium mit pnpm exec playwright install chromium.",
      },
      { status: 500 }
    );
  } finally {
    exporting = false;
  }
}
