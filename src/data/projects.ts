import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "p1",
    order: 1,
    title: "Códice Estelar",
    description: "Aplicação web para catalogação de constelações com visualização interativa e busca astronômica em tempo real.",
    tags: ["React", "TypeScript", "GSAP"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/codice-estelar",
  },
  {
    id: "p2",
    order: 2,
    title: "Herbário Digital",
    description: "Plataforma de identificação de espécies botânicas com IA embarcada e diário de campo para naturalistas modernos.",
    tags: ["Node.js", "PostgreSQL", "IA"],
    repoUrl: "https://github.com/example/herbario",
  },
  {
    id: "p3",
    order: 3,
    title: "Efeméride",
    description: "Sistema de agendamento cerimonial com temas históricos, notificações elegantes e integração com calendários.",
    tags: ["React", "SCSS", "API REST"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/efemeride",
  },
];
