import { cn } from "cn";
import { ResumeHeader } from "./header";
import { ResumeHistory } from "./history";
import { ResumeProjects } from "./projects";
import { ResumeSidebar } from "./sidebar";
import { ResumeSection } from "./section";
import type { ResumeDocumentProps } from "./types";

export function ResumeDocument({
  data,
  className = "",
  style,
}: ResumeDocumentProps) {
  const hasHistory = Boolean(data.work?.length || data.education?.length);
  const hasSidebar = Boolean(data.skills?.length || data.languages?.length);
  return (
    <article
      lang={data.language}
      style={style}
      className={cn(
        "border-border bg-card text-card-foreground resume [&_a:focus-visible]:outline-ring ring-border relative z-5 mx-auto flex w-full max-w-[var(--document-width,210mm)] flex-col gap-0 overflow-visible rounded-lg border-0 p-[var(--document-padding-mobile,2mm)] font-sans text-sm leading-[var(--document-line-height,1.6)] tracking-[var(--document-tracking,0em)] [overflow-wrap:anywhere] shadow-none ring-[length:var(--document-ring-width,1px)] transition-[padding] duration-500 [--text-3xl:calc(var(--document-font-size,0.875rem)*15/7)] [--text-sm--line-height:var(--document-line-height,1.428571)] [--text-sm:var(--document-font-size,0.875rem)] [--text-xs:calc(var(--document-font-size,0.875rem)*6/7)] motion-reduce:animate-none motion-reduce:transition-none sm:p-[var(--document-padding-desktop,8mm)] md:min-h-[297mm] @max-[768px]/resume:min-h-0 @max-[640px]/resume:p-[var(--document-padding-mobile,2mm)] @min-[640px]/resume:p-[var(--document-padding-desktop,8mm)] @min-[768px]/resume:min-h-[297mm] print:min-h-0 print:max-w-none print:animate-none print:rounded-none print:border-0 print:p-0 print:transition-none [&_a]:underline-offset-[3px] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-[3px] [&_a:hover]:underline [&_h2]:break-after-avoid [&_h3]:break-after-avoid [&_li]:[orphans:3] [&_li]:[widows:3] [&_p]:[orphans:3] [&_p]:[widows:3]",
        className
      )}
    >
      <div className="flex flex-col gap-0 space-y-(--section-gap,1.25rem) p-0">
        <ResumeHeader contact={data.contact} role={data.role} />
        {data.profile ? (
          <ResumeSection heading={data.labels.profile}>
            {data.profile}
          </ResumeSection>
        ) : null}
        {hasHistory || hasSidebar ? (
          <div
            className={
              hasHistory && hasSidebar
                ? "grid grid-cols-1 gap-x-(--column-gap,1.25rem) gap-y-(--section-gap,1.25rem) md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] @max-[768px]/resume:grid-cols-1 @min-[768px]/resume:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] print:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]"
                : "grid grid-cols-1 gap-x-(--column-gap,1.25rem) gap-y-(--section-gap,1.25rem)"
            }
          >
            {hasHistory ? (
              <div className="min-w-0 space-y-(--section-gap,1.25rem)">
                <ResumeHistory heading={data.labels.work} entries={data.work} />
                <ResumeHistory
                  heading={data.labels.education}
                  entries={data.education}
                />
              </div>
            ) : null}
            {hasSidebar ? <ResumeSidebar data={data} /> : null}
          </div>
        ) : null}
        <ResumeProjects
          heading={data.labels.projects}
          projects={data.projects}
        />
      </div>
    </article>
  );
}
