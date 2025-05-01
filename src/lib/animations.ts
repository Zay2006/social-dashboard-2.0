import { cn } from "@/lib/utils"

export const fadeIn = (delay: number = 0) =>
  cn(
    "animate-in fade-in duration-500 fill-mode-forwards",
    delay && `delay-${delay}`
  )

export const slideUp = (delay: number = 0) =>
  cn(
    "animate-in slide-in-from-bottom-4 duration-500 fill-mode-forwards",
    delay && `delay-${delay}`
  )

export const scaleIn = (delay: number = 0) =>
  cn(
    "animate-in zoom-in-50 duration-500 fill-mode-forwards",
    delay && `delay-${delay}`
  )
