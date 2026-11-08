import { cn } from "cn";
import { Separator } from "../../ui/separator";
import type { ReactNode } from "react";

export function ResumeSection({
  heading,
  children,
  className,
}: {
  heading: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0", className)}>
      <h2 className="text-muted-foreground pb-1 text-xs font-semibold tracking-widest uppercase">
        {heading}
      </h2>
      <Separator className="mb-3" />
      <div className="text-sm">{children}</div>
    </section>
  );
}
