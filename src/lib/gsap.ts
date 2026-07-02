import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE_OUT_EXPO  = 'power4.out'
export const EASE_IN_EXPO   = 'power4.in'
export const EASE_PERSONA   = 'power2.inOut'

export const DUR_FAST   = 0.15
export const DUR_BASE   = 0.4
export const DUR_SLOW   = 0.65
export const DUR_REVEAL = 0.55

gsap.config({
  nullTargetWarn: false,
})

ScrollTrigger.config({
  ignoreMobileResize: true,
})

export { gsap, ScrollTrigger }