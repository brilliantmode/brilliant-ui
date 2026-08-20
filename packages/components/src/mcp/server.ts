import { readFile } from "node:fs/promises";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { tokens } from "../tokens.js";
import { componentCatalog, packageVersion } from "./catalog.js";

const installation = {
  install: "pnpm add @brilliant/ui tailwindcss",
  stylesheet: '@import "tailwindcss";\n@import "@brilliant/ui/styles.css";',
  example: 'import { Button } from "@brilliant/ui/button";',
  mcp: {
    command: "pnpm",
    args: ["exec", "brilliant-ui-mcp"],
    note: "Run from a project that has @brilliant/ui installed.",
  },
} as const;

type CatalogItem = (typeof componentCatalog)[number];

const catalogByName = new Map<string, CatalogItem>(
  componentCatalog.map((item) => [item.name, item]),
);

const tokenGroups = {
  borderWidth: tokens.borderWidth,
  breakpoints: tokens.breakpoints,
  density: tokens.density,
  elevation: tokens.elevation,
  motion: tokens.motion,
  opacity: tokens.opacity,
  primitiveColors: tokens.primitiveColors,
  radii: tokens.radii,
  semanticColors: tokens.semanticColors,
  spacing: tokens.spacing,
  typography: tokens.typography,
  zIndex: tokens.zIndex,
} as const;

const tokenGroupNames = Object.keys(tokenGroups) as Array<keyof typeof tokenGroups>;

const readOnlyAnnotations = {
  idempotentHint: true,
  openWorldHint: false,
  readOnlyHint: true,
} as const;

function jsonResult(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

function searchableText(item: CatalogItem): string {
  return [
    item.name,
    item.title,
    item.description,
    item.metadata.purpose,
    ...item.metadata.slots,
    ...item.metadata.usage,
    ...item.metadata.avoid,
  ]
    .join(" ")
    .toLowerCase();
}

function scoreItem(item: CatalogItem, query: string): number {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((term) => term.length > 1);
  if (terms.length === 0) return 1;

  const haystack = searchableText(item);
  return terms.reduce((score, term) => {
    if (item.name === term || item.title.toLowerCase() === term) return score + 10;
    if (item.name.includes(term) || item.title.toLowerCase().includes(term)) return score + 5;
    return haystack.includes(term) ? score + 1 : score;
  }, 0);
}

async function declarationFor(item: CatalogItem): Promise<string> {
  const candidates = [
    new URL(`../generated/${item.name}.d.ts`, import.meta.url),
    new URL(`../../dist/generated/${item.name}.d.ts`, import.meta.url),
  ];

  for (const declarationUrl of candidates) {
    try {
      return await readFile(declarationUrl, "utf8");
    } catch (error: unknown) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
  }

  return `Exported symbols: ${item.exports.join(", ")}`;
}

function componentSummary(item: CatalogItem) {
  return {
    description: item.description,
    importPath: item.importPath,
    kind: item.kind,
    name: item.name,
    purpose: item.metadata.purpose,
    title: item.title,
  };
}

export function createBrilliantUiMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "brilliant-ui",
      version: packageVersion,
      websiteUrl: "https://brilliant-ui.dev",
    },
    {
      instructions:
        "Use search_components or suggest_components before choosing UI primitives. Call get_component for exact exports, declarations, accessibility guidance, and import paths. Brilliant UI is installed as one @brilliant/ui package and requires its global stylesheet.",
    },
  );

  server.registerTool(
    "search_components",
    {
      annotations: readOnlyAnnotations,
      description: "Search the version-matched Brilliant UI component catalog.",
      inputSchema: z.object({
        kind: z.enum(["block", "component", "layout"]).optional(),
        limit: z.number().int().min(1).max(100).default(20),
        query: z.string().default(""),
      }),
    },
    async ({ kind, limit, query }) => {
      const matches = componentCatalog
        .filter((item) => !kind || item.kind === kind)
        .map((item) => ({ item, score: scoreItem(item, query) }))
        .filter(({ score }) => score > 0)
        .sort(
          (left, right) =>
            right.score - left.score || left.item.name.localeCompare(right.item.name),
        )
        .slice(0, limit)
        .map(({ item }) => componentSummary(item));

      return jsonResult({ count: matches.length, packageVersion, results: matches });
    },
  );

  server.registerTool(
    "get_component",
    {
      annotations: readOnlyAnnotations,
      description:
        "Get exact exports, TypeScript declarations, dependencies, usage guidance, and accessibility notes for one Brilliant UI component.",
      inputSchema: z.object({ name: z.string().min(1) }),
    },
    async ({ name }) => {
      const item = catalogByName.get(name.toLowerCase());
      if (!item) {
        return {
          ...jsonResult({
            error: `Unknown Brilliant UI component: ${name}`,
            suggestions: componentCatalog
              .map((candidate) => ({ candidate, score: scoreItem(candidate, name) }))
              .filter(({ score }) => score > 0)
              .sort((left, right) => right.score - left.score)
              .slice(0, 5)
              .map(({ candidate }) => candidate.name),
          }),
          isError: true,
        };
      }

      return jsonResult({
        ...item,
        apiDeclarations: await declarationFor(item),
        importExample: `import { ${item.valueExports[0] ?? item.title.replaceAll(" ", "")} } from "${item.importPath}";`,
        packageVersion,
        stylesheet: '@import "@brilliant/ui/styles.css";',
      });
    },
  );

  server.registerTool(
    "suggest_components",
    {
      annotations: readOnlyAnnotations,
      description: "Suggest Brilliant UI components for a described interface or interaction.",
      inputSchema: z.object({ task: z.string().min(2) }),
    },
    async ({ task }) => {
      const suggestions = componentCatalog
        .map((item) => ({ item, score: scoreItem(item, task) }))
        .filter(({ score }) => score > 0)
        .sort(
          (left, right) =>
            right.score - left.score || left.item.name.localeCompare(right.item.name),
        )
        .slice(0, 8)
        .map(({ item, score }) => ({
          ...componentSummary(item),
          avoid: item.metadata.avoid,
          score,
          usage: item.metadata.usage,
        }));

      return jsonResult({ packageVersion, suggestions, task });
    },
  );

  server.registerTool(
    "get_installation",
    {
      annotations: readOnlyAnnotations,
      description: "Get the exact @brilliant/ui installation, stylesheet, import, and MCP setup.",
      inputSchema: z.object({}),
    },
    async () => jsonResult({ packageVersion, ...installation }),
  );

  server.registerTool(
    "get_design_tokens",
    {
      annotations: readOnlyAnnotations,
      description: "Get all Brilliant UI design tokens or one named token group.",
      inputSchema: z.object({
        group: z
          .enum(tokenGroupNames as [keyof typeof tokenGroups, ...(keyof typeof tokenGroups)[]])
          .optional(),
      }),
    },
    async ({ group }) =>
      jsonResult({
        groups: group ? { [group]: tokenGroups[group] } : tokenGroups,
        packageVersion,
      }),
  );

  server.registerResource(
    "installation",
    "brilliant://installation",
    {
      description: "Installation and MCP configuration for the installed @brilliant/ui version.",
      mimeType: "application/json",
      title: "Brilliant UI installation",
    },
    async (uri) => ({
      contents: [
        {
          mimeType: "application/json",
          text: JSON.stringify({ packageVersion, ...installation }, null, 2),
          uri: uri.href,
        },
      ],
    }),
  );

  server.registerResource(
    "design-tokens",
    "brilliant://tokens",
    {
      description: "Version-matched Brilliant UI token values.",
      mimeType: "application/json",
      title: "Brilliant UI design tokens",
    },
    async (uri) => ({
      contents: [
        {
          mimeType: "application/json",
          text: JSON.stringify({ packageVersion, tokens: tokenGroups }, null, 2),
          uri: uri.href,
        },
      ],
    }),
  );

  server.registerResource(
    "component",
    new ResourceTemplate("brilliant://components/{name}", {
      list: async () => ({
        resources: componentCatalog.map((item) => ({
          description: item.description,
          mimeType: "application/json",
          name: item.title,
          uri: `brilliant://components/${item.name}`,
        })),
      }),
    }),
    {
      description: "Version-matched metadata for one Brilliant UI component.",
      mimeType: "application/json",
      title: "Brilliant UI component",
    },
    async (uri, variables) => {
      const name = String(variables.name);
      const item = catalogByName.get(name);
      if (!item) throw new Error(`Unknown Brilliant UI component: ${name}`);
      return {
        contents: [
          {
            mimeType: "application/json",
            text: JSON.stringify({ ...item, packageVersion }, null, 2),
            uri: uri.href,
          },
        ],
      };
    },
  );

  return server;
}
