import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { registry } from "../../registry/src/index.ts";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(packageRoot, "src/generated");
const mcpRoot = resolve(packageRoot, "src/mcp");
const tokensRoot = resolve(packageRoot, "../tokens/src");
const animationsRoot = resolve(packageRoot, "../animations/src");
const packageKinds = new Set(["block", "component", "layout"]);
const execFileAsync = promisify(execFile);

function packageSource(source: string): string {
  return source
    .replaceAll(/@\/components\/ui\/([a-z0-9-]+)/g, "./$1.js")
    .replaceAll(/@\/components\/blocks\/([a-z0-9-]+)/g, "./$1.js")
    .replaceAll(/(from\s+["'])(\.\/[a-z0-9-]+)(["'])/g, "$1$2.js$3");
}

const packageItems = registry.filter((item) => packageKinds.has(item.kind));

function exportedSymbols(source: string): readonly string[] {
  return [
    ...new Set(
      [
        ...source.matchAll(
          /export\s+(?:async\s+)?(?:class|const|enum|function|interface|type)\s+([A-Za-z_$][\w$]*)/g,
        ),
      ]
        .map((match) => match[1])
        .filter((name): name is string => Boolean(name)),
    ),
  ];
}

function exportedValues(source: string): readonly string[] {
  return [
    ...new Set(
      [
        ...source.matchAll(
          /export\s+(?:async\s+)?(?:class|const|enum|function)\s+([A-Za-z_$][\w$]*)/g,
        ),
      ]
        .map((match) => match[1])
        .filter((name): name is string => Boolean(name)),
    ),
  ];
}

await rm(outputRoot, { force: true, recursive: true });
await mkdir(outputRoot, { recursive: true });

const exports: string[] = [];

for (const item of packageItems) {
  if (item.files.length !== 1) {
    throw new Error(`Package item "${item.name}" must contain exactly one source file.`);
  }

  const file = item.files[0];
  if (!file) throw new Error(`Package item "${item.name}" has no source file.`);

  const outputPath = resolve(outputRoot, `${item.name}.tsx`);
  await writeFile(outputPath, packageSource(file.content), "utf8");
  exports.push(`export * from "./${item.name}.js";`);
}

await writeFile(resolve(outputRoot, "index.ts"), `${exports.join("\n")}\n`, "utf8");

const packageJson = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8")) as {
  version: string;
};
const componentCatalog = packageItems.map((item) => ({
  dependencies: item.dependencies,
  description: item.description,
  exports: exportedSymbols(item.files[0]?.content ?? ""),
  importPath: `@brilliant/ui/${item.name}`,
  kind: item.kind,
  metadata: item.metadata,
  name: item.name,
  registryDependencies: item.registryDependencies,
  title: item.title,
  valueExports: exportedValues(item.files[0]?.content ?? ""),
}));

await mkdir(mcpRoot, { recursive: true });
await writeFile(
  resolve(mcpRoot, "catalog.ts"),
  `/* Generated from the Brilliant UI registry. Do not edit directly. */\nexport const packageVersion = ${JSON.stringify(packageJson.version)};\nexport const componentCatalog = ${JSON.stringify(componentCatalog, null, 2)} as const;\n`,
  "utf8",
);

const tokenSource = await readFile(resolve(tokensRoot, "index.ts"), "utf8");
const tokenStyles = await readFile(resolve(tokensRoot, "styles.css"), "utf8");
const animationSource = await readFile(resolve(animationsRoot, "index.ts"), "utf8");

await writeFile(resolve(packageRoot, "src/tokens.ts"), tokenSource, "utf8");
await writeFile(
  resolve(packageRoot, "src/animations.ts"),
  animationSource.replace('from "@brilliant-ui/tokens"', 'from "./tokens.js"'),
  "utf8",
);
await writeFile(
  resolve(packageRoot, "src/styles.css"),
  `${tokenStyles.trim()}\n\n/* Tailwind v4 scans the compiled package instead of requiring app-owned source files. */\n@source "../dist";\n`,
  "utf8",
);

const generatedSources = [
  outputRoot,
  resolve(packageRoot, "src/animations.ts"),
  resolve(mcpRoot, "catalog.ts"),
  resolve(packageRoot, "src/tokens.ts"),
];

await execFileAsync("pnpm", ["exec", "biome", "format", "--write", ...generatedSources], {
  cwd: packageRoot,
});
await execFileAsync(
  "pnpm",
  [
    "exec",
    "biome",
    "check",
    "--write",
    "--only=assist/source/organizeImports",
    ...generatedSources,
  ],
  { cwd: packageRoot },
);
