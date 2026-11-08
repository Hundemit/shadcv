"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, ArrowLeft, ArrowDownToLine, Check } from "lucide-react";
import { cn } from "cn";
import { toolbarButtonStyles } from "./toolbar-styles";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { PdfExportButton } from "./pdf-export-button";
import Link from "next/link";

export interface WebsiteLabels {
  toolbar: string;
  language: string;
  appearance: string;
  light: string;
  dark: string;
  system: string;
  home: string;
  download: string;
  regenerate: string;
  regenerating: string;
  title: string;
  description: string;
}
const subscribe = () => () => {};
export interface ToolbarProps {
  controls?: { language: boolean; theme: boolean; pdf: boolean };
  theme?: "inherit" | "light" | "dark";
  language: string;
  languages: { code: string; name: string; flag?: string }[];
  pdfFilename: string;
  homeHref?: string;
  defaultLanguage: string;
  labels: WebsiteLabels;
}

export function Toolbar({
  language,
  languages,
  labels,
  pdfFilename,
  homeHref,
  defaultLanguage,
  controls = { language: true, theme: true, pdf: true },
  theme = "inherit",
}: ToolbarProps) {
  const { resolvedTheme, systemTheme, setTheme } = useTheme();
  const currentLanguage = languages.find(({ code }) => code === language);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
    }
  }, [language]);
  return (
    <div
      role="toolbar"
      aria-label={labels.toolbar}
      data-resume-actions
      className="text-foreground relative z-0 mx-auto flex w-full max-w-[var(--document-width,210mm)] flex-wrap items-end justify-end gap-2 px-4 text-sm sm:px-4 print:hidden"
    >
      {/* Home Button */}
      {homeHref ? (
        <Button
          variant="outline"
          className={cn(
            toolbarButtonStyles.base,
            "mr-auto max-sm:size-9 max-sm:px-0 @max-[640px]/resume:size-9 @max-[640px]/resume:px-0"
          )}
          nativeButton={false}
          role="link"
          render={<Link href={homeHref} aria-label={labels.home} />}
        >
          <ArrowLeft aria-hidden="true" />
          <span className="max-sm:hidden @max-[640px]/resume:hidden @min-[640px]/resume:inline">
            {" "}
            {labels.home}
          </span>
        </Button>
      ) : null}

      {/* Color Theme Buttton */}
      {controls.theme && theme === "inherit" ? (
        <Button
          variant="outline"
          size="icon"
          className={toolbarButtonStyles.base}
          aria-label={labels.appearance}
          aria-pressed={mounted && resolvedTheme === "dark"}
          title={labels.appearance}
          disabled={!mounted}
          onClick={() => {
            const next = resolvedTheme === "dark" ? "light" : "dark";
            setTheme(next === systemTheme ? "system" : next);
          }}
        >
          {mounted && resolvedTheme === "dark" ? (
            <Moon aria-hidden="true" />
          ) : (
            <Sun aria-hidden="true" />
          )}
        </Button>
      ) : null}

      {/* PDF / Language */}
      {controls.pdf ? (
        <ButtonGroup
          aria-label={labels.download}
          className={toolbarButtonStyles.group}
        >
          <PdfExportButton
            label={labels.regenerate}
            pendingLabel={labels.regenerating}
          />
          <Button
            variant="outline"
            className={toolbarButtonStyles.base}
            nativeButton={false}
            role="link"
            render={
              <a
                href={`/${pdfFilename}`}
                download={pdfFilename}
                aria-label={labels.download}
              />
            }
          >
            <ArrowDownToLine aria-hidden="true" />
            PDF
          </Button>
        </ButtonGroup>
      ) : null}

      {/* Language */}
      {controls.language && languages.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={labels.language}
            title={labels.language}
            disabled={!mounted}
            render={
              <Button
                variant="outline"
                className={cn(
                  toolbarButtonStyles.base,
                  toolbarButtonStyles.icon
                )}
              />
            }
          >
            {currentLanguage?.flag ? (
              <span aria-hidden="true">{currentLanguage.flag}</span>
            ) : (
              <span>{currentLanguage?.code}</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "min-w-44 print:hidden",
              theme !== "inherit" && theme
            )}
          >
            <DropdownMenuGroup aria-label={labels.language}>
              {languages.map(({ code, name, flag }) => (
                <DropdownMenuItem
                  key={code}
                  render={
                    <Link
                      href={
                        code === defaultLanguage
                          ? "/"
                          : `/?lang=${encodeURIComponent(code)}`
                      }
                      lang={code}
                      hrefLang={code}
                      aria-label={name}
                      aria-current={code === language ? "page" : undefined}
                    />
                  }
                >
                  {flag ? <span aria-hidden="true">{flag}</span> : null}
                  {name}
                  {code === language ? (
                    <Check className="ml-auto" aria-hidden="true" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
