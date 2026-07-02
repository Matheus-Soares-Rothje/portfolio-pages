import { createRoot } from 'react-dom/client'
import '@styles/global.scss'
import '@lib/gsap'   // registra ScrollTrigger + config global
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
