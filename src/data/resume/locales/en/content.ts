import type { ResumeData } from "../../../../components/resume/document/types";

// Personal content supplied by Jan Hindemit; maintained independently per locale.
export const content: Omit<ResumeData, "language" | "contact" | "labels"> = {
  role: "Software Developer",
  profile:
    "Software developer focused on React, TypeScript, Next.js and scalable frontend architecture. I independently develop web applications – from architecture and development standards to tooling and the CI/CD pipeline. I am particularly passionate about intuitive user interfaces, thoughtfully designed UI components, design systems and animations. I value clean code, performance and a high-quality user experience.",
  work: [
    {
      period: "01/2022 – 12/2022",
      organization: "Northern Lights GmbH, Flensburg",
      stack:
        "Figma · Angular · TypeScript · HTML · CSS · Microservices · Scrum · Code review",
      title: "Frontend Developer (Working Student)",
      details: [
        {
          label: "UX/UI design and prototyping",
          description:
            "Aligned requirements with product owners and users, created wireframes and user flows, and built interactive high-fidelity prototypes in Figma.",
        },
        {
          label: "Frontend development",
          description:
            "Developed frontend components, views and form logic with Angular and TypeScript, and built responsive user interfaces.",
        },
        {
          label: "System integration",
          description:
            "Integrated microservices and APIs and contributed to code quality through code reviews and pair programming in a Scrum team.",
        },
      ],
    },
  ],
  education: [
    {
      period: "09/2018 – 09/2025",
      title: "B.Sc. in Media Informatics",
      organization:
        "Flensburg University of Applied Sciences, final grade: 1.8",
      stack:
        "Kotlin Multiplatform · UI/UX design · Web development · Databases · Usability testing · Software development",
      details: [
        {
          label: "Programming",
          description:
            "Developed software with Kotlin Multiplatform, JavaScript/TypeScript, React and Node.js. Worked with SQL and REST APIs and used Git for version control. Familiar with clean code structure and software architecture fundamentals.",
        },
        {
          label: "Methods and techniques",
          description:
            "Structured working practices, academic research, requirements analysis and systematic problem-solving",
        },
      ],
    },
    {
      period: "07/2007 – 07/2016",
      organization: "Richard-Hallmann-Schule, Trappenkamp",
      title: "School-leaving qualification for higher education",
    },
  ],
  skills: [
    {
      category: "Programming languages",
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
      category: "Tools & workflow",
      technologies: "Figma, Git, Docker, Jira, Confluence",
    },
    {
      category: "Web & CMS",
      technologies: "WordPress, Framer AI",
    },
  ],
  languages: [
    {
      name: "German",
      proficiency: "Native language",
    },
    {
      name: "English",
      proficiency: "B1",
    },
    {
      name: "Russian",
      proficiency: "B1",
    },
  ],
  projects: [
    {
      title: "Rangeview – Solana Liquidity Analytics",
      description:
        "Built a web application for analyzing and monitoring liquidity pools on the Solana blockchain. Developed an interactive dashboard with historical transactions, yield calculations and price alerts. Integrated blockchain APIs using Next.js, React and TypeScript.",
      href: "https://janhindemit.de/blog/range-view",
      stack: "Next.js · React · TypeScript · Tailwind CSS ",
    },
    {
      title: "AI chatbot with RAG",
      description:
        "Built a modular AI chatbot with selectable models and retrieval-augmented generation over documents. Implemented with Next.js, React and TypeScript, integrating the Vercel AI SDK and OpenRouter.",
      href: "https://janhindemit.de/blog/nordi-ai",
      stack: "Next.js · React · TypeScript · Vercel AI SDK · RAG · shadcn/ui",
    },
    {
      title: "Vehicle cost analysis web app",
      description:
        "Built an interactive web app for calculating and comparing total vehicle costs, including insurance, maintenance, fuel and depreciation. Implemented with Next.js, React and TypeScript.",
      href: "https://janhindemit.de/blog/vergleiche-dein-auto",
      stack: "Next.js · React · TypeScript · Tailwind CSS · shadcn/ui",
    },
    {
      title: "Client projects – Web development",
      description:
        "Designed and built custom client websites using Next.js/React, Framer or WordPress. Selected the technology based on each project’s requirements, scope and implementation needs.",
      href: "https://janhindemit.de/#projects",
      stack: "Next.js · React · WordPress · Framer · UI/UX",
    },
    {
      title: "Portfolio website",
      description:
        "Built a personal portfolio with Next.js, React and TypeScript to showcase my work and projects.",
      href: "https://janhindemit.de/",
      stack: "Next.js · React · TypeScript · Tailwind CSS · UI/UX",
    },
  ],
};
