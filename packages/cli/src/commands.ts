import { execFile } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { promisify } from "node:util";
import { type BrilliantConfig, defaultConfig } from "@brilliant-ui/core";
import { checksumContent, resolveRegistryDependencies } from "@brilliant-ui/registry";

const CONFIG_FILE = "brilliant-ui.json";
const MANIFEST_FILE = ".brilliant-ui/manifest.json";
const SHADCN_CONFIG_FILE = "components.json";
const TOKEN_STYLES_IMPORT = '@import "@brilliant-ui/tokens/styles.css";';
const execFileAsync = promisify(execFile);

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

async function ensureTokenStylesImport(cssPath: string, context: CommandContext): Promise<void> {
  const outputPath = resolve(context.cwd, cssPath);
  const projectRelativePath = relative(resolve(context.cwd), outputPath);
  if (projectRelativePath.startsWith("..") || isAbsolute(projectRelativePath)) {
    throw new Error(`Configured CSS path "${cssPath}" is outside the project.`);
  }

  const existing = (await exists(outputPath)) ? await readFile(outputPath, "utf8") : "";
  if (existing.includes(TOKEN_STYLES_IMPORT)) {
    context.log(`Found Brilliant token import in ${cssPath}`);
    return;
  }

  const nextContent = existing.trimStart().length
    ? `${TOKEN_STYLES_IMPORT}\n${existing}`
    : `${TOKEN_STYLES_IMPORT}\n`;

  if (context.dryRun) {
    context.log(`Would add Brilliant token import to ${cssPath}`);
    return;
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, nextContent, "utf8");
  context.log(`${existing ? "Updated" : "Created"} ${cssPath} with Brilliant token import`);
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

async function installDependencies(
  dependencies: readonly string[],
  context: CommandContext,
): Promise<void> {
  if (dependencies.length === 0) return;
  const packageJsonPath = join(context.cwd, "package.json");
  const packageJson = await readJsonFile<PackageJson>(packageJsonPath);
  if (!packageJson) {
    throw new Error("Cannot install package dependencies because package.json was not found.");
  }

  const existing = dependenciesOf(packageJson);
  const missing = [...new Set(dependencies)].filter((dependency) => !existing[dependency]);
  if (missing.length === 0) {
    context.log(`Found dependencies: ${dependencies.join(", ")}`);
    return;
  }

  const detected = await detectPackageManager(context.cwd);
  const packageManager = detected === "unknown" ? "npm" : detected;
  const args = packageManager === "npm" ? ["install", ...missing] : ["add", ...missing];
  if (context.dryRun) {
    context.log(`Would run ${packageManager} ${args.join(" ")}`);
    return;
  }

  await execFileAsync(packageManager, args, { cwd: context.cwd });
  context.log(`Installed dependencies with ${packageManager}: ${missing.join(", ")}`);
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
  await ensureTokenStylesImport(config.css, context);
  context.log(`${context.dryRun ? "Would create" : "Created"} ${CONFIG_FILE}`);
  if (detected.shadcn.found) context.log(`Mapped ${SHADCN_CONFIG_FILE} aliases.`);
  context.log("Typography: crisp system font rendering is enabled through Brilliant tokens.");
}

export async function addItems(names: readonly string[], context: CommandContext): Promise<void> {
  if (names.length === 0) throw new Error("Provide at least one registry item to add.");
  const config = await readConfig(context.cwd);
  const manifest = await readManifest(context.cwd);
  const installed = { ...manifest.items } as Record<string, readonly string[]>;
  const items = resolveRegistryDependencies(names);
  const dependencies = items.flatMap((item) => item.dependencies);

  for (const item of items) {
    for (const file of item.files) {
      if (file.checksum && file.checksum !== checksumContent(file.content)) {
        throw new Error(`Checksum mismatch for registry item "${item.name}" file "${file.path}".`);
      }
    }
  }

  await installDependencies(dependencies, context);

  for (const item of items) {
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
