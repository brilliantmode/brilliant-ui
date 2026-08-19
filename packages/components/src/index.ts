import { Slot } from "@radix-ui/react-slot";
import { type ClassValue, clsx } from "clsx";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { twMerge } from "tailwind-merge";

export { type MicroUxClass, microUx, microUxClasses } from "@brilliant-ui/animations";
export { cva, type VariantProps } from "class-variance-authority";
export { Slot };

export function cn(...inputs: readonly ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const componentStates = [
  "default",
  "hover",
  "focus",
  "focus-visible",
  "disabled",
  "loading",
  "error",
  "empty",
] as const;

export type ComponentState = (typeof componentStates)[number];

export const stateClasses = {
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  disabled:
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  loading: "data-[loading=true]:cursor-wait data-[loading=true]:opacity-70",
  invalid: "aria-invalid:border-critical aria-invalid:ring-critical",
} as const;

export interface ComponentAnatomy<SlotName extends string = string> {
  readonly name: string;
  readonly slots: readonly SlotName[];
  readonly states: readonly ComponentState[];
  readonly dataAttributes: readonly string[];
}

export function defineComponentAnatomy<const SlotName extends string>(
  anatomy: ComponentAnatomy<SlotName>,
): ComponentAnatomy<SlotName> {
  return anatomy;
}

export type PolymorphicProps<Element extends ElementType, Props = Record<string, never>> = Props &
  Omit<ComponentPropsWithoutRef<Element>, keyof Props | "asChild"> & {
    readonly asChild?: boolean;
  };

export function dataStateAttributes(
  state: Partial<Record<"disabled" | "loading" | "invalid", boolean>>,
): Record<string, string | undefined> {
  return {
    "aria-disabled": state.disabled ? "true" : undefined,
    "aria-invalid": state.invalid ? "true" : undefined,
    "data-loading": state.loading ? "true" : undefined,
  };
}
