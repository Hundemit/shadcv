import type { ResumeData } from "../../../../components/resume/document/types";

// Personal content supplied by Jan Hindemit; maintained independently per locale.
export const content: Omit<ResumeData, "language" | "contact" | "labels"> = {
  role: "Softwareentwickler",
  profile:
    "Softwareentwickler mit Schwerpunkt auf React, TypeScript, Next.js und skalierbarer Frontendarchitektur. Ich entwickle Greenfield-Projekte eigenständig, von der Architektur und den Entwicklungsstandards über das Tooling bis zur CI/CD-Pipeline. Besonders begeistern mich intuitive Benutzeroberflächen, durchdachte UI-Komponenten, Designsysteme und Animationen. Dabei lege ich Wert auf sauberen Code, Performance und eine hochwertige User Experience.",
  work: [
    {
      period: "01/2022 – 12/2022",
      organization: "Northern Lights GmbH, Flensburg",
      stack:
        "Figma · Angular · TypeScript · HTML · CSS · Microservices · Scrum · Code-Review",
      title: "Frontend-Entwickler (Werkstudent)",
      details: [
        {
          label: "UX/UI-Konzeption und Prototyping",
          description:
            "Anforderungen mit Product Ownern und Nutzer:innen abgestimmt, Wireframes und User Flows entwickelt und in Figma zu klickbaren High-Fidelity-Prototypen ausgearbeitet.",
        },
        {
          label: "Frontend-Entwicklung",
          description:
            "Frontend-Komponenten, Views und Formularlogik mit Angular und TypeScript entwickelt sowie responsive Benutzeroberflächen umgesetzt.",
        },
        {
          label: "Systemintegration",
          description:
            "Microservices und APIs angebunden und im Scrum-Umfeld durch Code Reviews und Pair Programming zur Codequalität beigetragen.",
        },
      ],
    },
  ],
  education: [
    {
      period: "09/2018 – 09/2025",
      title: "B.Sc. Medieninformatik",
      organization: "Hochschule Flensburg, Abschlussnote: 1.8",
      stack:
        "Kotlin Multiplatform · UI/UX Design · Webentwicklung · Datenbanken · Usability Testing · Softwareentwicklung",
      details: [
        {
          label: "Programmierung",
          description:
            "Entwicklung mit Kotlin Multiplatform, JavaScript/TypeScript, React und Node.js; Arbeit mit SQL und REST-APIs sowie Versionskontrolle mit Git. Kenntnisse in sauberer Code-Struktur und grundlegender Softwarearchitektur.",
        },
        {
          label: "Methoden & Technik",
          description:
            "Strukturiertes Arbeiten, wissenschaftliches Arbeiten, Anforderungsanalyse und systematische Problemlösung",
        },
      ],
    },
    {
      period: "07/2007 – 07/2016",
      organization: "Richard-Hallmann-Schule, Trappenkamp",
      title: "Fachabitur mit Hochschulreife",
    },
  ],
  skills: [
    {
      category: "Programmiersprachen",
      technologies: "TypeScript, JavaScript, SQL, Kotlin",
    },
    {
      category: "Frontend",
      technologies: "React, Next.js, HTML, CSS, Tailwind CSS",
    },
    {
      category: "Backend & APIs",
      technologies: "Node.js, REST-APIs, MySQL",
    },
    {
      category: "Tools & Workflow",
      technologies: "Figma, Git, Docker, Jira, Confluence",
    },
    {
      category: "Web & CMS",
      technologies: "WordPress, Framer AI",
    },
  ],
  languages: [
    {
      name: "Deutsch",
      proficiency: "Muttersprache",
    },
    {
      name: "Englisch",
      proficiency: "B1",
    },
    {
      name: "Russisch",
      proficiency: "B1",
    },
  ],
  projects: [
    {
      title: "Rangeview – Solana Liquidity Analytics",
      description:
        "Entwicklung einer Webanwendung zur Analyse und Überwachung von Liquidity Pools auf der Solana-Blockchain. Umsetzung eines interaktiven Dashboards mit historischen Transaktionen, Renditeberechnung und Preisalarmen. Integration von Blockchain-APIs mit Next.js, React und TypeScript.",
      href: "https://janhindemit.de/blog/range-view",
      stack: "Next.js · React · TypeScript · Tailwind CSS ",
    },
    {
      title: "KI-Chatbot mit RAG-System",
      description:
        "Entwicklung eines modularen KI-Chatbots mit auswählbaren KI-Modellen und RAG-basierter Dokumenteneinbindung. Umsetzung mit Next.js, React und TypeScript sowie Integration des Vercel AI SDK und OpenRouter.",
      href: "https://janhindemit.de/blog/nordi-ai",
      stack: "Next.js · React · TypeScript · Vercel AI SDK · RAG · shadcn/ui",
    },
    {
      title: "Webanwendung Fahrzeugkostenanalyse",
      description:
        "Entwicklung einer interaktiven Webanwendung zur Berechnung und zum Vergleich von Fahrzeuggesamtkosten unter Berücksichtigung von Versicherung, Wartung, Kraftstoff und Wertverlust. Umsetzung mit Next.js, React und TypeScript.",
      href: "https://janhindemit.de/blog/vergleiche-dein-auto",
      stack: "Next.js · React · TypeScript · Tailwind CSS · shadcn/ui",
    },
    {
      title: "Kundenprojekte – Webentwicklung",
      description:
        "Individuelle Kundenwebsites mit Next.js/React, Framer oder WordPress konzipiert und entwickelt. Die Technologie anhand der Anforderungen, des Umfangs und der Umsetzungserfordernisse des jeweiligen Projekts ausgewählt.",
      href: "https://janhindemit.de/#projects",
      stack: "Next.js · React · WordPress · Framer · UI/UX",
    },
    {
      title: "Portfolio Website",
      description:
        "Entwicklung einer eigenen Portfolio-Webanwendung mit Next.js, React und TypeScript zur Präsentation meiner Arbeiten und Projekte.",
      href: "https://janhindemit.de/",
      stack: "Next.js · React · TypeScript · Tailwind CSS · UI/UX",
    },
  ],
};
