import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { usePageTransition } from '@hooks/usePageTransition'
import { Layout } from '@components/layout'
import SobreMim         from '@pages/SobreMim'
import SobreMimDetalhes from '@pages/SobreMimDetalhes'
import Projetos         from '@pages/Projetos'
import Experiencias     from '@pages/Experiencias'
import Certificados     from '@pages/Certificados'
import Contato          from '@pages/Contato'

function RouterContent() {
  const { pathname } = useLocation()
  usePageTransition(pathname)

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"             element={<SobreMim />} />
        <Route path="/sobre-mim"    element={<SobreMimDetalhes />} />
        <Route path="/projetos"     element={<Projetos />} />
        <Route path="/experiencias" element={<Experiencias />} />
        <Route path="/certificados" element={<Certificados />} />
        <Route path="/contato"      element={<Contato />} />
      </Route>
    </Routes>
  )
}

export function AppRouter() {
  return (
    <HashRouter>
      <RouterContent />
    </HashRouter>
  )
}