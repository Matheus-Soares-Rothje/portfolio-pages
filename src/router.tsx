import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import SobreMim from "@/pages/SobreMim";
import Projetos from "@/pages/Projetos";
import Experiencias from "@/pages/Experiencias";
import Certificados from "@/pages/Certificados";
import Contato from "@/pages/Contato";
import { contacts } from "@/data/contact";
import { useGithubProjects } from "@/hooks/useGithubProjects";
import { useGithubExperiences } from "@/hooks/useGithubExperiences";
import { useGithubCerts } from "@/hooks/useGithubCerts";
import { useAboutData } from "@/hooks/useAboutData";

function AppRoutes() {
  const { projects }     = useGithubProjects();
  const { experiences }  = useGithubExperiences();
  const { certificates } = useGithubCerts();
  const { data: about }  = useAboutData();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/sobre-mim"
          element={
            <SobreMim
              paragraphs={about.paragraphs}
              hardSkills={about.hardSkills}
              stats={about.stats}
              experiences={experiences}
            />
          }
        />
        <Route path="/projetos"     element={<Projetos projects={projects} />} />
        <Route path="/experiencias" element={<Experiencias experiences={experiences} />} />
        <Route path="/certificados" element={<Certificados certificates={certificates} />} />
        <Route path="/contato"      element={<Contato contacts={contacts} />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function AppRouter() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
