import { execFile } from "node:child_process";
import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { componentUsageExamples, documentationGuides, registry } from "../../registry/src/index.ts";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(packageRoot, "src/generated");
const mcpRoot = resolve(packageRoot, "src/mcp");
const tokensRoot = resolve(packageRoot, "../tokens/src");
const animationsRoot = resolve(packageRoot, "../animations/src");
const packageKinds = new Set(["block", "component", "layout"]);
const execFileAsync = promisify(execFile);

async function writeGeneratedFile(path: string, content: string): Promise<void> {
  const temporaryPath = `${path}.tmp-${process.pid}`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, path);
}

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

function componentExportName(name: string): string {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function componentUsageExample(name: string): string {
  const explicit = componentUsageExamples[name as keyof typeof componentUsageExamples];
  if (explicit) return explicit;

  const exportName = componentExportName(name);
  return `import { ${exportName} } from "@brilliant/ui/${name}";

export function Example() {
  return <${exportName}>Example</${exportName}>;
}`;
}

await mkdir(outputRoot, { recursive: true });

const expectedGeneratedFiles = new Set([
  "index.ts",
  ...packageItems.map((item) => `${item.name}.tsx`),
]);
const staleGeneratedFiles = (await readdir(outputRoot, { withFileTypes: true }))
  .filter(
    (entry) =>
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      !expectedGeneratedFiles.has(entry.name),
  )
  .map((entry) => rm(resolve(outputRoot, entry.name), { force: true }));
await Promise.all(staleGeneratedFiles);

const exports: string[] = [];

for (const item of packageItems) {
  if (item.files.length !== 1) {
    throw new Error(`Package item "${item.name}" must contain exactly one source file.`);
  }

  const file = item.files[0];
  if (!file) throw new Error(`Package item "${item.name}" has no source file.`);

  const outputPath = resolve(outputRoot, `${item.name}.tsx`);
  await writeGeneratedFile(outputPath, packageSource(file.content));
  exports.push(`export * from "./${item.name}.js";`);
}

await writeGeneratedFile(resolve(outputRoot, "index.ts"), `${exports.join("\n")}\n`);

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
  usageExample: componentUsageExample(item.name),
  valueExports: exportedValues(item.files[0]?.content ?? ""),
}));

await mkdir(mcpRoot, { recursive: true });
await writeGeneratedFile(
  resolve(mcpRoot, "catalog.ts"),
  `/* Generated from the Brilliant UI registry. Do not edit directly. */\nexport const packageVersion = ${JSON.stringify(packageJson.version)};\nexport const componentCatalog = ${JSON.stringify(componentCatalog, null, 2)} as const;\n`,
);
await writeGeneratedFile(
  resolve(mcpRoot, "guides.ts"),
  `/* Generated from the Brilliant UI documentation registry. Do not edit directly. */\nexport const documentationGuides = ${JSON.stringify(documentationGuides, null, 2)} as const;\n`,
);

const tokenSource = await readFile(resolve(tokensRoot, "index.ts"), "utf8");
const tokenStyles = await readFile(resolve(tokensRoot, "styles.css"), "utf8");
const animationSource = await readFile(resolve(animationsRoot, "index.ts"), "utf8");

await writeGeneratedFile(resolve(packageRoot, "src/tokens.ts"), tokenSource);
await writeGeneratedFile(
  resolve(packageRoot, "src/animations.ts"),
  animationSource.replace('from "@brilliant-ui/tokens"', 'from "./tokens.js"'),
);
await writeGeneratedFile(
  resolve(packageRoot, "src/styles.css"),
  `${tokenStyles.trim()}\n\n/* Tailwind v4 scans the compiled package instead of requiring app-owned source files. */\n@source "../dist";\n`,
);

const generatedSources = [
  outputRoot,
  resolve(packageRoot, "src/animations.ts"),
  resolve(mcpRoot, "catalog.ts"),
  resolve(mcpRoot, "guides.ts"),
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
