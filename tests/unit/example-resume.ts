import type { ResumeData } from "@/components/resume/document";
// Fictional data for the resume tests.
export const example: ResumeData = {
  language: "de",
  contact: {
    name: "Clara Weiss",
    location: "Berlin, Deutschland",
    email: "clara@example.com",
  },
  role: "Produktdesignerin",
  labels: {
    profile: "Profil",
    work: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Kenntnisse",
    languages: "Sprachen",
    projects: "Projekte",
  },
  profile:
    "Ich gestalte digitale Produkte mit einem Blick für Typografie, klare Strukturen und die Menschen, die sie nutzen.",
  work: [
    {
      title: "Senior Product Designer",
      organization: "Studio Falz",
      period: "2022 – heute",
      details: [
        {
          label: "Designsystem",
          description:
            "Komponenten und Gestaltungsrichtlinien für eine digitale Bibliothek.",
        },
      ],
    },
    {
      title: "Visual Designer",
      organization: "Büro Kontur",
      period: "2019 – 2022",
    },
  ],
  skills: [
    {
      category: "Gestaltung",
      technologies: "Typografie, Designsysteme, Prototyping",
    },
  ],
  education: [
    {
      title: "B.A. Kommunikationsdesign",
      organization: "Hochschule für Gestaltung",
      period: "2015 – 2019",
    },
  ],
  languages: [
    { name: "Deutsch", proficiency: "Muttersprache" },
    { name: "Englisch", proficiency: "Fließend" },
  ],
};
