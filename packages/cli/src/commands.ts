import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { type BrilliantConfig, defaultConfig } from "@brilliant-ui/core";
import { checksumContent, resolveRegistryDependencies } from "@brilliant-ui/registry";

const CONFIG_FILE = "brilliant-ui.json";
const MANIFEST_FILE = ".brilliant-ui/manifest.json";
const SHADCN_CONFIG_FILE = "components.json";

export interface CommandContext {
  readonly cwd: string;
  readonly dryRun?: boolean;
  readonly force: boolean;
  readonly log: (message: string) => void;
}

interface InstallManifest {
  readonly version: 1;
  readonly items: Readonly<Record<string, readonly string[]>>;
}

export interface ProjectDetection {
  readonly framework: "next" | "vite" | "unknown";
  readonly packageManager: "bun" | "npm" | "pnpm" | "yarn" | "unknown";
  readonly sourceDirectory: "src" | ".";
  readonly typescript: boolean;
  readonly tailwind: boolean;
  readonly shadcn: {
    readonly found: boolean;
    readonly componentsAlias: string | undefined;
    readonly utilsAlias: string | undefined;
    readonly css: string | undefined;
  };
}

interface PackageJson {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
}

interface ShadcnConfig {
  readonly aliases?: {
    readonly components?: string;
    readonly utils?: string;
  };
  readonly css?: string;
  readonly tailwind?: {
    readonly css?: string;
  };
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return false;
    throw error;
  }
}

async function readConfig(cwd: string): Promise<BrilliantConfig> {
  const path = join(cwd, CONFIG_FILE);
  if (!(await exists(path))) {
    throw new Error(`No ${CONFIG_FILE} found. Run "brilliant-ui init" first.`);
  }
  return JSON.parse(await readFile(path, "utf8")) as BrilliantConfig;
}

async function readManifest(cwd: string): Promise<InstallManifest> {
  const path = join(cwd, MANIFEST_FILE);
  if (!(await exists(path))) return { version: 1, items: {} };
  return JSON.parse(await readFile(path, "utf8")) as InstallManifest;
}

async function readJsonFile<T>(path: string): Promise<T | undefined> {
  if (!(await exists(path))) return undefined;
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeJsonForContext(
  path: string,
  value: unknown,
  context: CommandContext,
): Promise<void> {
  if (context.dryRun) {
    context.log(`Would write ${relative(context.cwd, path)}`);
    return;
  }
  await writeJson(path, value);
}

function aliasRoot(alias: string): string {
  if (!alias.startsWith("@/")) {
    throw new Error(
      `Unsupported component alias "${alias}". Phase 1 supports aliases starting with @/.`,
    );
  }
  return join("src", alias.slice(2));
}

async function detectPackageManager(cwd: string): Promise<ProjectDetection["packageManager"]> {
  if (await exists(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (await exists(join(cwd, "bun.lockb"))) return "bun";
  if (await exists(join(cwd, "yarn.lock"))) return "yarn";
  if (await exists(join(cwd, "package-lock.json"))) return "npm";
  return "unknown";
}

function dependenciesOf(packageJson: PackageJson | undefined): Readonly<Record<string, string>> {
  return { ...packageJson?.dependencies, ...packageJson?.devDependencies };
}

export async function detectProject(cwd: string): Promise<ProjectDetection> {
  const packageJson = await readJsonFile<PackageJson>(join(cwd, "package.json"));
  const dependencies = dependenciesOf(packageJson);
  const shadcn = await readJsonFile<ShadcnConfig>(join(cwd, SHADCN_CONFIG_FILE));

  return {
    framework: dependencies.next ? "next" : dependencies.vite ? "vite" : "unknown",
    packageManager: await detectPackageManager(cwd),
    sourceDirectory: (await exists(join(cwd, "src"))) ? "src" : ".",
    typescript: Boolean(dependencies.typescript || (await exists(join(cwd, "tsconfig.json")))),
    tailwind: Boolean(
      dependencies.tailwindcss ||
        (await exists(join(cwd, "tailwind.config.ts"))) ||
        (await exists(join(cwd, "tailwind.config.js"))),
    ),
    shadcn: {
      found: Boolean(shadcn),
      componentsAlias: shadcn?.aliases?.components,
      utilsAlias: shadcn?.aliases?.utils,
      css: shadcn?.tailwind?.css ?? shadcn?.css,
    },
  };
}

export async function initProject(context: CommandContext): Promise<void> {
  const configPath = join(context.cwd, CONFIG_FILE);
  if ((await exists(configPath)) && !context.force) {
    throw new Error(`${CONFIG_FILE} already exists. Pass --force to replace it.`);
  }

  const detected = await detectProject(context.cwd);
  const config = {
    ...defaultConfig,
    aliases: {
      components: detected.shadcn.componentsAlias ?? defaultConfig.aliases.components,
      utils: detected.shadcn.utilsAlias ?? defaultConfig.aliases.utils,
    },
    css: detected.shadcn.css ?? defaultConfig.css,
    typescript: detected.typescript || defaultConfig.typescript,
  } satisfies BrilliantConfig;

  await writeJsonForContext(configPath, config, context);
  context.log(`${context.dryRun ? "Would create" : "Created"} ${CONFIG_FILE}`);
  if (detected.shadcn.found) context.log(`Mapped ${SHADCN_CONFIG_FILE} aliases.`);
  context.log("Next: import @brilliant-ui/tokens/styles.css from your global stylesheet.");
}

export async function addItems(names: readonly string[], context: CommandContext): Promise<void> {
  if (names.length === 0) throw new Error("Provide at least one registry item to add.");
  const config = await readConfig(context.cwd);
  const manifest = await readManifest(context.cwd);
  const installed = { ...manifest.items } as Record<string, readonly string[]>;

  for (const item of resolveRegistryDependencies(names)) {
    for (const file of item.files) {
      if (file.checksum && file.checksum !== checksumContent(file.content)) {
        throw new Error(`Checksum mismatch for registry item "${item.name}" file "${file.path}".`);
      }
    }

    const written: string[] = [];
    for (const file of item.files) {
      const relativePath = join(aliasRoot(config.aliases.components), file.target ?? file.path);
      const outputPath = resolve(context.cwd, relativePath);
      const projectRelativePath = relative(resolve(context.cwd), outputPath);
      if (projectRelativePath.startsWith("..") || isAbsolute(projectRelativePath)) {
        throw new Error(`Registry item "${item.name}" attempted to write outside the project.`);
      }
      if ((await exists(outputPath)) && !context.force) {
        throw new Error(`${relativePath} already exists. Pass --force to replace it.`);
      }
      if (!context.dryRun) {
        await mkdir(dirname(outputPath), { recursive: true });
        await writeFile(outputPath, file.content, "utf8");
      }
      written.push(relativePath);
      context.log(`${context.dryRun ? "Would add" : "Added"} ${relativePath}`);
    }
    installed[item.name] = written;
    if (item.dependencies.length > 0) {
      context.log(`Dependencies: ${item.dependencies.join(", ")}`);
    }
  }

  await writeJsonForContext(
    join(context.cwd, MANIFEST_FILE),
    { version: 1, items: installed },
    context,
  );
}

export async function updateItems(
  names: readonly string[],
  context: CommandContext,
): Promise<void> {
  const manifest = await readManifest(context.cwd);
  const targets = names.length > 0 ? names : Object.keys(manifest.items);
  if (targets.length === 0) throw new Error("No installed registry items to update.");
  await addItems(targets, { ...context, force: true });
}
