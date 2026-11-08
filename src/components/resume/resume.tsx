import type { CSSProperties } from "react";
import { ResumeDocument } from "./document";
import type { ResumeDocumentProps } from "./document/types";
import { Toolbar, type ToolbarProps } from "./toolbar";

// Shared website/PDF defaults. Lengths accept CSS units. Regenerate static PDFs
// after edits. A4 export uses the desktop document, without website controls.
export const resumeSettings: ResumeSettings = {
  maxWidth: "210mm",
  pagePadding: { mobile: "0.5rem", desktop: "2rem" },
  pagePaddingY: { mobile: "0rem", desktop: "0rem" },
  documentPaddingMobile: "4mm",
  documentPaddingDesktop: "8mm",
  pdfPageMargin: null, // null follows documentPadding on every A4 page; or e.g. "10mm".
  sectionGap: "1.25rem",
  columnGap: "1.25rem",
  theme: "inherit", // "inherit" follows the website; or force "light" / "dark".
  showToolbar: true,
  toolbarControls: { language: true, theme: true, pdf: true },
  fontSize: "0.875rem",
  lineHeight: 1.5,
  letterSpacing: "0em", // Text tracking, separate from sectionGap.
  showBorder: true,
};

export interface ResumeSettings {
  maxWidth: string;
  pagePadding: { mobile: string; desktop: string };
  pagePaddingY: { mobile: string; desktop: string };
  documentPaddingMobile: string;
  documentPaddingDesktop: string;
  pdfPageMargin: string | null;
  sectionGap: string;
  columnGap: string;
  theme: "inherit" | "light" | "dark";
  showToolbar: boolean;
  toolbarControls: { language: boolean; theme: boolean; pdf: boolean };
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
  showBorder: boolean;
}

export type ResumeSettingsOverride = Partial<
  Omit<ResumeSettings, "toolbarControls" | "pagePadding" | "pagePaddingY">
> & {
  toolbarControls?: Partial<ResumeSettings["toolbarControls"]>;
  pagePadding?: Partial<ResumeSettings["pagePadding"]>;
  pagePaddingY?: Partial<ResumeSettings["pagePaddingY"]>;
};

export interface ResumeProps extends ResumeDocumentProps {
  toolbar?: Omit<ToolbarProps, "language" | "controls" | "theme">;
  settings?: ResumeSettingsOverride;
}

export function Resume({ toolbar, settings, ...documentProps }: ResumeProps) {
  const config = { ...resumeSettings, ...settings };
  const padding = { ...resumeSettings.pagePadding, ...settings?.pagePadding };
  const paddingY = {
    ...resumeSettings.pagePaddingY,
    ...settings?.pagePaddingY,
  };
  const controls = {
    ...resumeSettings.toolbarControls,
    ...settings?.toolbarControls,
  };
  const variables = {
    "--document-width": config.maxWidth,
    "--page-padding": padding.mobile,
    "--page-padding-desktop": padding.desktop,
    "--page-padding-y": paddingY.mobile,
    "--page-padding-y-desktop": paddingY.desktop,
    "--document-padding-mobile": config.documentPaddingMobile,
    "--document-padding-desktop": config.documentPaddingDesktop,
    "--pdf-page-margin": config.pdfPageMargin ?? "",
    "--section-gap": config.sectionGap,
    "--column-gap": config.columnGap,
    "--document-font-size": config.fontSize,
    "--document-line-height": config.lineHeight,
    "--document-tracking": config.letterSpacing,
    "--document-ring-width": config.showBorder ? "1px" : "0px",
  } as CSSProperties;
  return (
    <div
      data-resume-layout
      className={`${config.theme === "inherit" ? "" : config.theme} px-(--page-padding) py-(--page-padding-y) transition-[padding] duration-500 motion-reduce:transition-none sm:px-(--page-padding-desktop) sm:py-(--page-padding-y-desktop) @max-[640px]/resume:px-(--page-padding) @max-[640px]/resume:py-(--page-padding-y) @min-[640px]/resume:px-(--page-padding-desktop) @min-[640px]/resume:py-(--page-padding-y-desktop) print:bg-white print:p-0 print:transition-none`}
      style={variables}
    >
      {config.showToolbar && toolbar ? (
        <Toolbar
          {...toolbar}
          language={documentProps.data.language}
          controls={controls}
          theme={config.theme}
        />
      ) : null}
      <ResumeDocument {...documentProps} />
    </div>
  );
}
