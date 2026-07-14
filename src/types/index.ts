export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  isCurrent: boolean;
}

export type CertificateIcon = "html5" | "css3" | "js" | "react" | "node" | "python" | "atom" | "default";

export interface Certificate {
  id: string;
  name: string;
  platform: string;
  year: number;
  icon: CertificateIcon;
  url?: string;
  imageUrl?: string;
}

export type ContactType = "email" | "github" | "linkedin";

export interface ContactItem {
  type: ContactType;
  label: string;
  value: string;
  url: string;
}

export interface HardSkill {
  name: string;
  level: number;
}

export interface Stat {
  label: string;
  value: string;
}
