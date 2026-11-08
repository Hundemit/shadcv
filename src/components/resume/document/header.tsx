import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import type { ResumeContact } from "./types";
import { LinkArrow } from "./link-arrow";

export function ResumeHeader({
  contact,
  role,
}: {
  contact: ResumeContact;
  role: string;
}) {
  return (
    <header className="flex flex-wrap gap-(--section-gap,1.25rem) rounded-none p-0">
      <div className="">
        <h1 className="font-serif text-3xl leading-none font-medium">
          {contact.name}
        </h1>
        <p className="mt-2 text-xs tracking-widest uppercase">{role}</p>
      </div>

      <address className="text-muted-foreground ml-auto grid grid-cols-2 gap-1 text-sm leading-tight not-italic max-sm:order-3 max-sm:w-full max-sm:gap-x-2 sm:grid-cols-1 sm:text-right @max-[640px]/resume:order-3 @max-[640px]/resume:w-full @max-[640px]/resume:grid-cols-2 @max-[640px]/resume:gap-x-2 @max-[640px]/resume:text-left @min-[640px]/resume:order-none @min-[640px]/resume:w-auto @min-[640px]/resume:grid-cols-1 @min-[640px]/resume:text-right">
        {contact.location ? <p>{contact.location}</p> : null}
        {contact.phone ? (
          <p>
            <a href={`tel:${contact.phone.replace(/[ ()-]/g, "")}`}>
              {contact.phone}
            </a>
          </p>
        ) : null}
        {contact.email ? (
          <p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        ) : null}
        {contact.links?.map((link, index) => (
          <p key={index}>
            <a
              target="_blank"
              className="flex items-center gap-0.5 sm:justify-end @max-[640px]/resume:justify-start @min-[640px]/resume:justify-end"
              href={link.href}
            >
              {link.label} <LinkArrow />
            </a>
          </p>
        ))}
      </address>

      {contact.photo ? (
        <Avatar
          className="border-border size-16 overflow-hidden rounded-lg border transition-[width,height] duration-500 after:hidden motion-reduce:transition-none max-sm:ml-auto sm:size-32 @max-[640px]/resume:ml-auto @max-[640px]/resume:size-16 @min-[640px]/resume:ml-0 @min-[640px]/resume:size-32 print:transition-none"
          role="img"
          aria-label={contact.photo.alt}
        >
          <AvatarImage
            src={contact.photo.src}
            alt={contact.photo.alt}
            className="rounded-lg"
          />
          <AvatarFallback className="rounded-lg" aria-hidden="true">
            {contact.name
              .trim()
              .split(/\s+/)
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </AvatarFallback>
        </Avatar>
      ) : null}
    </header>
  );
}
