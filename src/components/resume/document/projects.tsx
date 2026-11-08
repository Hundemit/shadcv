import { ResumeSection } from "./section";
import type { ResumeData } from "./types";
import { LinkArrow } from "./link-arrow";

export function ResumeProjects({
  heading,
  projects,
}: {
  heading: string;
  projects: ResumeData["projects"];
}) {
  if (!projects?.length) return null;
  return (
    <ResumeSection heading={heading}>
      <ul className="space-y-4">
        {projects.map((project, index) => (
          <li key={index} className="print:break-inside-avoid">
            <h3 className="font-semibold">
              {project.href ? (
                <a
                  target="_blank"
                  className="flex items-center gap-1"
                  href={project.href}
                >
                  {project.title} <LinkArrow />
                </a>
              ) : (
                project.title
              )}
            </h3>
            {project.stack ? (
              <p className="text-muted-foreground mb-1 text-xs">
                {project.stack}
              </p>
            ) : null}
            <p className="text-card-foreground/70">{project.description}</p>
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
}
