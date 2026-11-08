import { Separator } from "../../ui/separator";
import { ResumeSection } from "./section";
import type { ResumeData } from "./types";

export function ResumeSidebar({ data }: { data: ResumeData }) {
  if (!data.skills?.length && !data.languages?.length) return null;
  return (
    <aside className="flex gap-(--section-gap,1.25rem)">
      <Separator
        orientation="vertical"
        className="max-md:hidden @max-[768px]/resume:hidden @min-[768px]/resume:block"
      />

      <div className="w-full space-y-(--section-gap,1.25rem)">
        {/* Skills  */}
        {data.skills?.length ? (
          <ResumeSection heading={data.labels.skills}>
            <dl className="space-y-1.5 leading-snug">
              {data.skills.map((skill, index) => (
                <div key={index}>
                  <dt className="font-semibold">{skill.category}</dt>
                  <dd className="text-muted-foreground">
                    {skill.technologies}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>
        ) : null}
        {/* Languages  */}
        {data.languages?.length ? (
          <ResumeSection heading={data.labels.languages}>
            <dl className="space-y-1.5 leading-snug">
              {data.languages.map((language, index) => (
                <div key={index}>
                  <dt className="font-semibold">{language.name}</dt>
                  <dd className="text-muted-foreground text-xs">
                    {language.proficiency}
                  </dd>
                </div>
              ))}
            </dl>
          </ResumeSection>
        ) : null}
      </div>
    </aside>
  );
}
