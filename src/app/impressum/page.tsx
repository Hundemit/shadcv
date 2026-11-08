import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema, siteUrl } from "@/lib/seo/schema";

const operator = {
  name: "Jan Hindemit",
  street: "Lesingstr 3",
  postalCode: "24610",
  locality: "Trappenkamp",
  country: "Deutschland",
  email: "janhindemit1@gmail.com",
  phone: "+49 1627 19 5858",
};
const emailHref = `mailto:${operator.email}`;
const phoneHref = `tel:${operator.phone.replaceAll(" ", "")}`;

export const metadata: Metadata = {
  title: { absolute: "Impressum & Datenschutz | Jan Hindemit" },
  description:
    "Angaben gemäß § 5 DDG und Datenschutzerklärung nach Art. 13 DSGVO für Jan Hindemit (Trappenkamp, Schleswig-Holstein).",
  alternates: {
    canonical: `${siteUrl}/impressum`,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Impressum & Datenschutz | Jan Hindemit",
    description:
      "Rechtliche Angaben und Datenschutzerklärung gemäß § 5 DDG und Art. 13 DSGVO.",
    url: `${siteUrl}/impressum`,
  },
};

export default function ImpressumPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${siteUrl}/impressum#webpage`,
      url: `${siteUrl}/impressum`,
      name: "Impressum & Datenschutz",
      description: "Angaben gemäß § 5 DDG und Datenschutzhinweise.",
      inLanguage: "de",
      mainEntity: {
        "@type": "Person",
        name: operator.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: operator.street,
          addressLocality: operator.locality,
          postalCode: operator.postalCode,
          addressCountry: "DE",
        },
        email: operator.email,
        telephone: operator.phone,
      },
    },
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Impressum", path: "/impressum" },
    ]),
  ];

  return (
    <div
      lang="de"
      className="bg-background text-foreground [&_a:focus-visible]:outline-ring min-h-screen [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4"
    >
      <JsonLd data={structuredData} />
      {/* ── Header (matches landing style) ── */}
      <header className="bg-background border-b">
        <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between gap-5 px-5 sm:h-[72px] sm:px-[5vw]">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-semibold tracking-tight"
          >
            <span className="flex items-center justify-center rounded-md border p-1">
              <FileText className="text-primary" size={20} />
            </span>
            ShadCV
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Zur Startseite
          </Link>
        </div>
      </header>

      {/* ── Content ── */}
      <main
        lang="de"
        className="mx-auto max-w-[1380px] px-5 py-14 sm:px-[5vw] sm:py-20"
      >
        {/* Page heading */}
        <div className="mb-10">
          <span className="text-muted-foreground mb-3 block font-mono text-xs tracking-[.14em] uppercase">
            Rechtliches
          </span>
          <h1 className="text-4xl font-medium tracking-tight">Impressum</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
          </p>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-2">
          {/* ── Anbieter ── */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-lg font-semibold">Anbieter</h2>
              <CardDescription>
                Verantwortlicher im Sinne des DDG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <address className="not-italic">
                <p className="font-medium">{operator.name}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {operator.street}
                  <br />
                  {operator.postalCode} {operator.locality}
                  <br />
                  {operator.country}
                </p>
                <Separator className="my-4" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Mail aria-hidden="true" size={14} />
                    <a
                      href={emailHref}
                      className="underline underline-offset-2"
                    >
                      {operator.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone aria-hidden="true" size={14} />
                    <a
                      href={phoneHref}
                      className="underline underline-offset-2"
                    >
                      {operator.phone}
                    </a>
                  </li>
                </ul>
              </address>
            </CardContent>
          </Card>

          {/* ── Datenschutz ── */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-lg font-semibold">Datenschutzerklärung</h2>
              <CardDescription>Gemäß Art. 13 DSGVO</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-5 text-sm leading-relaxed [&_a]:underline [&_a]:underline-offset-2">
              <section>
                <h3 className="text-foreground font-semibold">
                  Verantwortlicher
                </h3>
                <p>
                  {`Für die Datenverarbeitung auf dieser Website ist ${operator.name} verantwortlich.`}{" "}
                  Die Anschrift und die Kontaktdaten stehen im Impressum auf
                  dieser Seite.
                </p>
              </section>
              <section>
                <h3 className="text-foreground font-semibold">
                  Hosting und Zugriffsdaten
                </h3>
                <p>
                  Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Abruf
                  verarbeitet Vercel technische Zugriffsdaten wie die
                  IP-Adresse, den Zeitpunkt und die angeforderte Seite, um die
                  Website bereitzustellen und ihren sicheren Betrieb zu
                  ermöglichen. Rechtsgrundlage ist Art. 6 Abs. 1 Buchst. f
                  DSGVO. Das berechtigte Interesse liegt in der sicheren und
                  zuverlässigen Bereitstellung der Website.
                </p>
                <p className="mt-2">
                  Die Verfügbarkeit von Laufzeitprotokollen hängt vom
                  Hosting-Tarif ab. Vercel veröffentlicht die jeweiligen Fristen
                  in der{" "}
                  <a href="https://vercel.com/docs/logs/runtime">
                    Dokumentation zu Laufzeitprotokollen
                  </a>
                  . Eine Weiterleitung dieser Protokolle über Log Drains ist
                  deaktiviert. Bei der Verarbeitung können Daten in die USA
                  übermittelt werden. Vercel gibt an, am EU–US Data Privacy
                  Framework teilzunehmen. Weitere Informationen enthält die{" "}
                  <a href="https://vercel.com/legal/privacy-notice">
                    Datenschutzerklärung von Vercel
                  </a>
                  .
                </p>
              </section>
              <section>
                <h3 className="text-foreground font-semibold">
                  Darstellung und Reichweitenmessung
                </h3>
                <p>
                  Wenn du den Farbmodus änderst, speichert die Website deine
                  Auswahl lokal im Browser (localStorage, Schlüssel „theme“).
                  Der Eintrag dient dazu, die von dir gewählte Darstellung bei
                  weiteren Besuchen wiederherzustellen. Du kannst ihn über die
                  Website-Daten deines Browsers löschen. Vercel Web Analytics
                  und Speed Insights sind deaktiviert.
                </p>
              </section>
              <section>
                <h3 className="text-foreground font-semibold">
                  Kontaktaufnahme
                </h3>
                <p>
                  Wenn du per E-Mail oder telefonisch Kontakt aufnimmst, werden
                  deine Kontaktdaten und der Inhalt deiner Anfrage zur
                  Bearbeitung verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1
                  Buchst. f DSGVO (Interesse an der Beantwortung von Anfragen)
                  oder bei vertragsbezogenen Anfragen Art. 6 Abs. 1 Buchst. b
                  DSGVO. E-Mails werden über Gmail verarbeitet. Die Daten werden
                  gelöscht, sobald sie für die Bearbeitung nicht mehr
                  erforderlich sind und keine gesetzlichen
                  Aufbewahrungspflichten entgegenstehen.
                </p>
              </section>
              <section>
                <h3 className="text-foreground font-semibold">Deine Rechte</h3>
                <p>
                  Du hast nach Maßgabe der DSGVO das Recht auf Auskunft,
                  Berichtigung, Löschung, Einschränkung der Verarbeitung und
                  Datenübertragbarkeit. Gegen eine Verarbeitung auf Grundlage
                  von Art. 6 Abs. 1 Buchst. f DSGVO kannst du aus Gründen, die
                  sich aus deiner besonderen Situation ergeben, Widerspruch
                  einlegen. Außerdem kannst du dich bei einer
                  Datenschutzaufsicht beschweren, etwa beim{" "}
                  <a href="https://www.datenschutzzentrum.de/dse_kontakt/">
                    Unabhängigen Landeszentrum für Datenschutz
                    Schleswig-Holstein
                  </a>
                  .
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ── Footer (matches landing style) ── */}
      <footer className="mx-auto flex max-w-[1380px] items-center gap-4 border-t px-[5vw] py-7 text-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-semibold tracking-tight"
        >
          <span className="flex items-center justify-center rounded-md border p-1">
            <FileText className="text-primary" size={20} />
          </span>
          ShadCV
        </Link>
        <Link href="/" className="ml-auto text-sm hover:underline">
          Zur Startseite
        </Link>
      </footer>
    </div>
  );
}
