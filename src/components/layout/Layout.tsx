import { Outlet } from 'react-router-dom'
import { Navbar }    from './Navbar'
import { BottomNav } from './BottomNav'
import { useSwipeNav } from '@hooks/useSwipeNav'
import s from './Layout.module.scss'

/**
 * Layout — shell persistente da SPA.
 *
 * Desktop: Navbar lateral esquerda (220px) + Outlet à direita.
 * Mobile:  Navbar lateral oculta + BottomNav fixa na base + swipe entre seções.
 */
export function Layout() {
  useSwipeNav()   // swipe horizontal para navegar entre seções no mobile

  return (
    <div className={s.shell}>
      <Navbar />
      <main className={s.main} id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
