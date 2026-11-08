import type { CSSProperties } from "react";

export interface ResumeContact {
  name: string;
  location?: string;
  email?: string;
  phone?: string;
  links?: { label: string; href: string }[];
  photo?: { src: string; alt: string };
}

export interface HistoryEntry {
  title: string;
  period: string;
  organization: string;
  stack?: string;
  details?: { label: string; description: string }[];
}

export interface ResumeLabels {
  profile: string;
  work: string;
  education: string;
  skills: string;
  languages: string;
  projects: string;
}

/** Plain React contract. Validation and website configuration live outside this folder. */
export interface ResumeData {
  language: string;
  contact: ResumeContact;
  role: string;
  labels: ResumeLabels;
  profile?: string;
  work?: HistoryEntry[];
  education?: HistoryEntry[];
  skills?: { category: string; technologies: string }[];
  languages?: { name: string; proficiency: string }[];
  projects?: {
    title: string;
    description: string;
    href?: string;
    stack?: string;
  }[];
}

export interface ResumeDocumentProps {
  data: ResumeData;
  className?: string;
  style?: CSSProperties;
}
