import { ResumeSection } from "./section";
import type { HistoryEntry } from "./types";

export function ResumeHistory({
  heading,
  entries,
}: {
  heading: string;
  entries?: HistoryEntry[];
}) {
  if (!entries?.length) return null;
  return (
    <ResumeSection heading={heading}>
      <div className="space-y-5">
        {entries.map((entry, index) => (
          <div key={index}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="font-semibold">{entry.title}</h3>
              <p className="text-muted-foreground text-xs">{entry.period}</p>
            </div>
            <p className="text-muted-foreground flex items-center justify-start gap-1 text-xs">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-3 shrink-0"
              >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>{" "}
              {entry.organization}
            </p>
            {entry.stack ? (
              <p className="text-muted-foreground my-2 text-xs">
                {entry.stack}
              </p>
            ) : null}
            {entry.details?.length ? (
              <ul className="text-card-foreground/70 mt-2 ml-4 list-disc space-y-1.5">
                {entry.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>
                    <strong>{detail.label}:</strong> {detail.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}
