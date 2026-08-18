export type ThemePreference = "light" | "dark" | "system";

export interface BrilliantConfig {
  readonly $schema?: string;
  readonly aliases: {
    readonly components: string;
    readonly utils: string;
  };
  readonly css: string;
  readonly registry: string;
  readonly tailwind: {
    readonly cssVariables: true;
  };
  readonly typescript: boolean;
}

export const defaultConfig = {
  $schema: "https://brilliant-ui.dev/schema.json",
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  css: "src/app/globals.css",
  registry: "https://brilliant-ui.dev/r",
  tailwind: { cssVariables: true },
  typescript: true,
} as const satisfies BrilliantConfig;

type ClassDictionary = Readonly<Record<string, boolean | null | undefined>>;
export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassDictionary
  | ClassValue[];

/** A dependency-free class composer for framework internals and generated source. */
export function cx(...values: readonly ClassValue[]): string {
  const classes: string[] = [];

  const visit = (value: ClassValue): void => {
    if (!value) return;
    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      for (const nested of value) visit(nested);
      return;
    }
    for (const [name, enabled] of Object.entries(value)) {
      if (enabled) classes.push(name);
    }
  };

  for (const value of values) visit(value);
  return classes.join(" ");
}
