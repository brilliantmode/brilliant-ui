import { motion as tokenMotion } from "@brilliant-ui/tokens";

export const microDurations = {
  instant: tokenMotion.duration.instant,
  quick: tokenMotion.duration.fast,
  settle: tokenMotion.duration.normal,
  express: tokenMotion.duration.slow,
} as const;

export const microEasings = {
  standard: tokenMotion.easing.standard,
  enter: tokenMotion.easing.enter,
  exit: tokenMotion.easing.exit,
  spring: tokenMotion.easing.spring,
} as const;

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
  press: {
    scale: [1, 0.985, 1],
    y: [0, 1, 0],
    transition: {
      duration: 0.16,
      ease: tokenMotion.easing.standard,
    },
  },
  lift: {
    y: [0, -2],
    transition: {
      duration: 0.12,
      ease: tokenMotion.easing.enter,
    },
  },
  pulse: {
    opacity: [0.72, 1, 0.72],
    transition: {
      duration: 1.2,
      ease: tokenMotion.easing.standard,
      repeat: Number.POSITIVE_INFINITY,
    },
  },
} as const;

export type AnimationPreset = keyof typeof animationPresets;

export const microUxClasses = {
  base: "motion-safe:transition-[color,background-color,border-color,box-shadow,transform,opacity] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
  press: "active:translate-y-px active:scale-[0.985]",
  pressSoft: "active:scale-[0.99]",
  lift: "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
  liftSoft: "hover:-translate-y-px active:translate-y-0",
  reveal:
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  focus:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  loading:
    "data-[loading=true]:cursor-wait data-[loading=true]:opacity-70 data-[loading=true]:motion-safe:animate-pulse",
} as const;

export type MicroUxClass = keyof typeof microUxClasses;

export function microUx(...patterns: readonly MicroUxClass[]): string {
  return patterns.map((pattern) => microUxClasses[pattern]).join(" ");
}

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
