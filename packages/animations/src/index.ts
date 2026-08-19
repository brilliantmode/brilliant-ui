import { motion as tokenMotion } from "@brilliant-ui/tokens";

export const animationPresets = {
  enter: {
    opacity: [0, 1],
    y: [4, 0],
    scale: [0.99, 1],
    transition: {
      duration: 0.2,
      ease: tokenMotion.easing.enter,
    },
  },
  exit: {
    opacity: [1, 0],
    y: [0, 2],
    scale: [1, 0.99],
    transition: {
      duration: 0.12,
      ease: tokenMotion.easing.exit,
    },
  },
  disclosure: {
    opacity: [0, 1],
    height: ["0px", "auto"],
    transition: {
      duration: 0.2,
      ease: tokenMotion.easing.standard,
    },
  },
  feedback: {
    scale: [1, 0.98, 1],
    transition: {
      duration: 0.12,
      ease: tokenMotion.easing.standard,
    },
  },
} as const;

export type AnimationPreset = keyof typeof animationPresets;

export function reducedMotionPreset(preset: AnimationPreset): {
  readonly opacity?: readonly number[];
  readonly transition: { readonly duration: 0 };
} {
  const value = animationPresets[preset];
  if ("opacity" in value) {
    return { opacity: value.opacity, transition: { duration: 0 } };
  }
  return { transition: { duration: 0 } };
}

export function prefersReducedMotion(query = "(prefers-reduced-motion: reduce)"): boolean {
  if (typeof globalThis.matchMedia !== "function") return false;
  return globalThis.matchMedia(query).matches;
}
