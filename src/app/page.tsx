import { demoMode } from "@/data/resume/site";
import type { Metadata } from "next";
import { ConfiguredResume } from "@/components/configured-resume";
import { getResume, resolveLanguage } from "@/data/resume";
import { site } from "@/data/resume/site";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildProfilePageSchema,
  buildBreadcrumbSchema,
  resumeAlternates,
  resumeUrl,
} from "@/lib/seo/schema";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Triangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const repo = "https://github.com/Hundemit/shadcv";
const deployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repo)}`;

type Props = { searchParams: Promise<{ lang?: string | string[] }> };

async function selection(props: Props) {
  const language = resolveLanguage((await props.searchParams).lang);
  return {
    language,
    data: getResume(language),
    labels: site.languages.find((item) => item.code === language)!.resume
      .website,
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { language, data, labels } = await selection(props);
  const title = `${data.contact.name} — ${labels.title}`;
  const profileSnippet = data.profile
    ? data.profile.length > 155
      ? `${data.profile.slice(0, 155).trimEnd()}…`
      : data.profile
    : labels.description;
  const description = `${data.contact.name} (${data.role}) — ${profileSnippet}`;

  return {
    robots: {
      index: !demoMode && process.env.VERCEL_ENV !== "preview",
      follow: true,
    },
    title: {
      absolute: title,
    },
    description,
    authors: [{ name: data.contact.name, url: resumeUrl(language) }],
    alternates: {
      canonical: resumeUrl(language),
      languages: resumeAlternates,
    },
    openGraph: {
      type: "profile",
      siteName: site.title,
      title,
      description: profileSnippet,
      url: resumeUrl(language),
      locale: language.replaceAll("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profileSnippet,
    },
  };
}

function Greeting() {
  return (
    <section
      lang="en"
      className={`mx-auto max-w-[210mm] space-y-3 px-4 pt-12 text-center sm:pt-16 print:hidden`}
    >
      <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Hello, welcome to my website.
      </p>
      <p className="text-muted-foreground mx-auto max-w-lg text-base text-pretty sm:text-lg">
        Feel free to look at my CV below. If you have any questions, don&rsquo;t
        hesitate to reach out.
      </p>

      <Button
        variant="outline"
        nativeButton={false}
        role="link"
        render={
          <a
            aria-label="Deploy with Vercel"
            href={deployUrl}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <Triangle className="fill-primary mr-0.5" />
        <Separator orientation="vertical" />
        Deploy
      </Button>
    </section>
  );
}

function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t print:hidden">
      <div className="mx-auto max-w-[210mm] px-4 py-3 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            &copy; {year} {name}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              role="link"
              render={
                <a
                  aria-label="Deploy with Vercel"
                  href={deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <Triangle className="fill-primary mr-0.5" />
              <Separator orientation="vertical" />
              Deploy
            </Button>
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              GitHub <ArrowUpRight size={12} />
            </a>
            <a
              href="/impressum"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Impressum
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default async function Home(props: Props) {
  const { language, data, labels } = await selection(props);

  const structuredData = [
    buildProfilePageSchema(language),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: labels.title, path: resumeUrl(language) },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <main className="bg-background space-y-8 motion-reduce:transition-none sm:space-y-16 print:transition-none">
        <Greeting />
        <section>
          <ConfiguredResume language={language} />
        </section>

        <Footer name={data.contact.name} />
      </main>
    </>
  );
}
