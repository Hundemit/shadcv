import { NextRequest, NextResponse } from "next/server";
import { resolveLanguage } from "./data/resume";
export function proxy(request: NextRequest) {
  const values = request.nextUrl.searchParams.getAll("lang");
  const headers = new Headers(request.headers);
  headers.set(
    "x-resume-language",
    resolveLanguage(values.length === 1 ? values[0] : undefined)
  );
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/"] };
