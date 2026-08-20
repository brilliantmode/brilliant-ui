import { readFile } from "node:fs/promises";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { tokens } from "../tokens.js";
import { componentCatalog, packageVersion } from "./catalog.js";
import { documentationGuides } from "./guides.js";

const installation = {
  install: "pnpm add @brilliantmode/ui tailwindcss",
  stylesheet: '@import "tailwindcss";\n@import "@brilliantmode/ui/styles.css";',
  example: 'import { Button } from "@brilliantmode/ui/button";',
  mcp: {
    command: "pnpm",
    args: ["exec", "brilliant-ui-mcp"],
    note: "Run from a project that has @brilliantmode/ui installed.",
  },
} as const;

type CatalogItem = (typeof componentCatalog)[number];

const catalogByName = new Map<string, CatalogItem>(
  componentCatalog.map((item) => [item.name, item]),
);
const guidesBySlug = new Map<string, (typeof documentationGuides)[number]>(
  documentationGuides.map((guide) => [guide.slug, guide]),
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

const toolIcons = [
  {
    mimeType: "image/svg+xml",
    src: "https://brilliant-ui.dev/favicon.svg",
  },
];

const componentSummarySchema = z.object({
  description: z.string(),
  importPath: z.string(),
  kind: z.enum(["block", "component", "layout"]),
  name: z.string(),
  purpose: z.string(),
  title: z.string(),
});

const componentMetadataSchema = z.object({
  accessibility: z.array(z.string()),
  avoid: z.array(z.string()),
  purpose: z.string(),
  slots: z.array(z.string()),
  usage: z.array(z.string()),
});

const searchComponentsOutputSchema = z.object({
  count: z.number().int().nonnegative(),
  packageVersion: z.string(),
  results: z.array(componentSummarySchema),
});

const getComponentOutputSchema = z
  .object({
    apiDeclarations: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    description: z.string().optional(),
    error: z.string().optional(),
    exports: z.array(z.string()).optional(),
    found: z.boolean(),
    importExample: z.string().optional(),
    importPath: z.string().optional(),
    kind: z.enum(["block", "component", "layout"]).optional(),
    metadata: componentMetadataSchema.optional(),
    name: z.string().optional(),
    packageVersion: z.string(),
    registryDependencies: z.array(z.string()).optional(),
    stylesheet: z.string().optional(),
    suggestions: z.array(z.string()).optional(),
    title: z.string().optional(),
    usageExample: z.string().optional(),
    valueExports: z.array(z.string()).optional(),
  })
  .strict();

const suggestComponentsOutputSchema = z.object({
  packageVersion: z.string(),
  suggestions: z.array(
    componentSummarySchema.extend({
      avoid: z.array(z.string()),
      matchedTerms: z.array(z.string()),
      reason: z.string(),
      score: z.number(),
      usage: z.array(z.string()),
      usageExample: z.string(),
    }),
  ),
  task: z.string(),
});

const installationOutputSchema = z.object({
  example: z.string(),
  install: z.string(),
  mcp: z.object({
    args: z.array(z.string()),
    command: z.string(),
    note: z.string(),
  }),
  packageVersion: z.string(),
  stylesheet: z.string(),
});

const designTokensOutputSchema = z.object({
  groups: z.record(z.string(), z.unknown()),
  packageVersion: z.string(),
});

const guideSummarySchema = z.object({
  slug: z.string(),
  summary: z.string(),
  title: z.string(),
  topics: z.array(z.string()),
});

const searchGuidesOutputSchema = z.object({
  count: z.number().int().nonnegative(),
  guides: z.array(guideSummarySchema),
  packageVersion: z.string(),
});

const getGuideOutputSchema = z
  .object({
    content: z.string().optional(),
    error: z.string().optional(),
    found: z.boolean(),
    packageVersion: z.string(),
    slug: z.string().optional(),
    suggestions: z.array(z.string()).optional(),
    summary: z.string().optional(),
    title: z.string().optional(),
    topics: z.array(z.string()).optional(),
  })
  .strict();

function jsonResult(value: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
    structuredContent: JSON.parse(JSON.stringify(value)),
  };
}

const searchStopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "build",
  "by",
  "create",
  "for",
  "from",
  "have",
  "in",
  "include",
  "including",
  "into",
  "is",
  "it",
  "make",
  "need",
  "of",
  "on",
  "or",
  "page",
  "screen",
  "that",
  "the",
  "their",
  "this",
  "to",
  "use",
  "user",
  "users",
  "using",
  "want",
  "where",
  "which",
  "with",
  "your",
]);

const searchAliases: Readonly<Record<string, readonly string[]>> = {
  confirmation: ["confirm"],
  delete: ["destructive", "remove"],
  feedback: ["message", "transient"],
  preference: ["option", "setting", "toggle"],
  save: ["submit", "submission"],
};

function normalizeSearchTerm(term: string): string {
  if (term.length > 4 && term.endsWith("ies")) return `${term.slice(0, -3)}y`;
  if (term.length > 3 && term.endsWith("s") && !term.endsWith("ss") && !term.endsWith("us")) {
    return term.slice(0, -1);
  }
  return term;
}

function tokenizeSearchText(value: string): Set<string> {
  return new Set(
    (value.toLowerCase().match(/[a-z0-9]+/g) ?? [])
      .map(normalizeSearchTerm)
      .filter((term) => term.length > 1 && !searchStopWords.has(term)),
  );
}

interface SearchConcept {
  readonly term: string;
  readonly variants: ReadonlySet<string>;
}

function searchConcepts(query: string): SearchConcept[] {
  return [...tokenizeSearchText(query)].map((term) => ({
    term,
    variants: new Set([
      term,
      ...(searchAliases[term] ?? []).map((alias) => normalizeSearchTerm(alias)),
    ]),
  }));
}

function conceptMatches(concept: SearchConcept, tokens: ReadonlySet<string>): boolean {
  return [...concept.variants].some((variant) => tokens.has(variant));
}

interface ComponentMatch {
  readonly avoidedTerms: readonly string[];
  readonly matchedFields: readonly string[];
  readonly matchedTerms: readonly string[];
  readonly score: number;
}

function matchItem(item: CatalogItem, query: string): ComponentMatch {
  const concepts = searchConcepts(query);
  if (concepts.length === 0) {
    return { avoidedTerms: [], matchedFields: [], matchedTerms: [], score: 1 };
  }

  const positiveFields = [
    {
      label: "name or title",
      tokens: tokenizeSearchText(`${item.name} ${item.title}`),
      weight: 12,
    },
    { label: "purpose", tokens: tokenizeSearchText(item.metadata.purpose), weight: 6 },
    { label: "description", tokens: tokenizeSearchText(item.description), weight: 4 },
    {
      label: "recommended usage",
      tokens: tokenizeSearchText(item.metadata.usage.join(" ")),
      weight: 3,
    },
    { label: "slots", tokens: tokenizeSearchText(item.metadata.slots.join(" ")), weight: 2 },
    {
      label: "accessibility guidance",
      tokens: tokenizeSearchText(item.metadata.accessibility.join(" ")),
      weight: 1,
    },
  ] as const;
  const matchedTerms = new Set<string>();
  const matchedFields = new Set<string>();
  let score = 0;

  for (const field of positiveFields) {
    for (const concept of concepts) {
      if (!conceptMatches(concept, field.tokens)) continue;
      score += field.weight;
      matchedTerms.add(concept.term);
      matchedFields.add(field.label);
    }
  }

  const nameTerms = tokenizeSearchText(`${item.name} ${item.title}`);
  if (
    nameTerms.size > 0 &&
    [...nameTerms].every((nameTerm) => concepts.some((concept) => concept.variants.has(nameTerm)))
  ) {
    score += 12;
  }

  const avoidedTerms = [
    ...new Set(
      item.metadata.avoid.flatMap((guidance) => {
        const avoidTokens = tokenizeSearchText(guidance);
        const matches = concepts
          .filter((concept) => conceptMatches(concept, avoidTokens))
          .map((concept) => concept.term);
        return new Set(matches).size >= 2 ? matches : [];
      }),
    ),
  ];
  score -= avoidedTerms.length * 6;

  return {
    avoidedTerms,
    matchedFields: [...matchedFields],
    matchedTerms: [...matchedTerms],
    score,
  };
}

function matchReason(match: ComponentMatch): string {
  const positive = `Matched ${match.matchedTerms.join(", ")} in ${match.matchedFields.join(", ")}.`;
  if (match.avoidedTerms.length === 0) return positive;
  return `${positive} Avoid guidance reduced the score for ${match.avoidedTerms.join(", ")}.`;
}

function editDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        (current[rightIndex - 1] ?? 0) + 1,
        (previous[rightIndex] ?? 0) + 1,
        (previous[rightIndex - 1] ?? 0) + substitutionCost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length] ?? right.length;
}

function componentNameSuggestions(query: string): string[] {
  const normalizedQuery = query.trim().toLowerCase().replaceAll(/\s+/g, "-");
  const maximumDistance = Math.max(2, Math.floor(normalizedQuery.length * 0.35));

  return componentCatalog
    .map((item) => ({
      distance: Math.min(
        editDistance(normalizedQuery, item.name),
        editDistance(normalizedQuery, item.title.toLowerCase().replaceAll(/\s+/g, "-")),
      ),
      name: item.name,
    }))
    .filter(({ distance }) => distance <= maximumDistance)
    .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
    .slice(0, 5)
    .map(({ name }) => name);
}

function guideSummary(guide: (typeof documentationGuides)[number]) {
  return {
    slug: guide.slug,
    summary: guide.summary,
    title: guide.title,
    topics: [...guide.topics],
  };
}

function scoreGuide(guide: (typeof documentationGuides)[number], query: string): number {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((term) => term.length > 1);
  if (terms.length === 0) return 1;

  const title = guide.title.toLowerCase();
  const haystack = [guide.slug, title, guide.summary, ...guide.topics, guide.content]
    .join(" ")
    .toLowerCase();
  return terms.reduce((score, term) => {
    if (guide.slug === term || title === term) return score + 10;
    if (guide.slug.includes(term) || title.includes(term)) return score + 5;
    return haystack.includes(term) ? score + 1 : score;
  }, 0);
}

function guideSlugSuggestions(query: string): string[] {
  const normalizedQuery = query.trim().toLowerCase().replaceAll(/\s+/g, "-");
  const maximumDistance = Math.max(3, Math.floor(normalizedQuery.length * 0.4));

  return documentationGuides
    .map((guide) => ({
      distance: Math.min(
        editDistance(normalizedQuery, guide.slug),
        editDistance(normalizedQuery, guide.title.toLowerCase().replaceAll(/\s+/g, "-")),
      ),
      slug: guide.slug,
    }))
    .filter(({ distance }) => distance <= maximumDistance)
    .sort((left, right) => left.distance - right.distance || left.slug.localeCompare(right.slug))
    .slice(0, 5)
    .map(({ slug }) => slug);
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
        "Brilliant UI is a version-matched React and Tailwind component framework. Start with get_installation when setup is unknown. Use search_guides and get_guide for application-level setup, theming, composition, accessibility, and troubleshooting guidance. Use search_components or suggest_components before choosing primitives, then call get_component for exact imports, declarations, accessibility guidance, and copy-ready usage. Import the global stylesheet once. All tools are read-only and never modify the user's project.",
    },
  );

  server.registerTool(
    "search_components",
    {
      annotations: readOnlyAnnotations,
      description: "Search the version-matched Brilliant UI component catalog.",
      icons: toolIcons,
      inputSchema: z.object({
        kind: z.enum(["block", "component", "layout"]).optional(),
        limit: z.number().int().min(1).max(100).default(20),
        query: z.string().default(""),
      }),
      outputSchema: searchComponentsOutputSchema,
      title: "Search Brilliant UI components",
    },
    async ({ kind, limit, query }) => {
      const matches = componentCatalog
        .filter((item) => !kind || item.kind === kind)
        .map((item) => ({ item, match: matchItem(item, query) }))
        .filter(({ match }) => match.score > 0)
        .sort(
          (left, right) =>
            right.match.score - left.match.score || left.item.name.localeCompare(right.item.name),
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
        "Get exact exports, TypeScript declarations, dependencies, copy-ready usage, and accessibility guidance for one Brilliant UI component.",
      icons: toolIcons,
      inputSchema: z.object({ name: z.string().min(1) }),
      outputSchema: getComponentOutputSchema,
      title: "Get a Brilliant UI component",
    },
    async ({ name }) => {
      const item = catalogByName.get(name.toLowerCase());
      if (!item) {
        return {
          ...jsonResult({
            error: `Unknown Brilliant UI component: ${name}`,
            found: false,
            packageVersion,
            suggestions: componentNameSuggestions(name),
          }),
          isError: true,
        };
      }

      return jsonResult({
        ...item,
        apiDeclarations: await declarationFor(item),
        found: true,
        importExample: `import { ${item.valueExports[0] ?? item.title.replaceAll(" ", "")} } from "${item.importPath}";`,
        packageVersion,
        stylesheet: '@import "@brilliantmode/ui/styles.css";',
      });
    },
  );

  server.registerTool(
    "suggest_components",
    {
      annotations: readOnlyAnnotations,
      description: "Suggest Brilliant UI components for a described interface or interaction.",
      icons: toolIcons,
      inputSchema: z.object({ task: z.string().min(2) }),
      outputSchema: suggestComponentsOutputSchema,
      title: "Suggest Brilliant UI components",
    },
    async ({ task }) => {
      const suggestions = componentCatalog
        .map((item) => ({ item, match: matchItem(item, task) }))
        .filter(({ match }) => match.score > 0 && match.matchedTerms.length > 0)
        .sort(
          (left, right) =>
            right.match.score - left.match.score || left.item.name.localeCompare(right.item.name),
        )
        .slice(0, 8)
        .map(({ item, match }) => ({
          ...componentSummary(item),
          avoid: item.metadata.avoid,
          matchedTerms: match.matchedTerms,
          reason: matchReason(match),
          score: match.score,
          usage: item.metadata.usage,
          usageExample: item.usageExample,
        }));

      return jsonResult({ packageVersion, suggestions, task });
    },
  );

  server.registerTool(
    "search_guides",
    {
      annotations: readOnlyAnnotations,
      description:
        "Search version-matched Brilliant UI guides for setup, theming, composition, accessibility, workflows, and troubleshooting.",
      icons: toolIcons,
      inputSchema: z.object({
        limit: z.number().int().min(1).max(50).default(20),
        query: z.string().default(""),
      }),
      outputSchema: searchGuidesOutputSchema,
      title: "Search Brilliant UI guides",
    },
    async ({ limit, query }) => {
      const guides = documentationGuides
        .map((guide) => ({ guide, score: scoreGuide(guide, query) }))
        .filter(({ score }) => score > 0)
        .sort(
          (left, right) =>
            right.score - left.score || left.guide.slug.localeCompare(right.guide.slug),
        )
        .slice(0, limit)
        .map(({ guide }) => guideSummary(guide));

      return jsonResult({ count: guides.length, guides, packageVersion });
    },
  );

  server.registerTool(
    "get_guide",
    {
      annotations: readOnlyAnnotations,
      description:
        "Get one complete, version-matched Brilliant UI implementation guide as Markdown.",
      icons: toolIcons,
      inputSchema: z.object({ slug: z.string().min(1) }),
      outputSchema: getGuideOutputSchema,
      title: "Get a Brilliant UI guide",
    },
    async ({ slug }) => {
      const normalizedSlug = slug.toLowerCase().trim().replaceAll(/\s+/g, "-");
      const guide = guidesBySlug.get(normalizedSlug);
      if (!guide) {
        return {
          ...jsonResult({
            error: `Unknown Brilliant UI guide: ${slug}`,
            found: false,
            packageVersion,
            suggestions: guideSlugSuggestions(slug),
          }),
          isError: true,
        };
      }

      return jsonResult({
        ...guideSummary(guide),
        content: guide.content,
        found: true,
        packageVersion,
      });
    },
  );

  server.registerTool(
    "get_installation",
    {
      annotations: readOnlyAnnotations,
      description:
        "Get the exact @brilliantmode/ui installation, stylesheet, import, and MCP setup.",
      icons: toolIcons,
      inputSchema: z.object({}),
      outputSchema: installationOutputSchema,
      title: "Get Brilliant UI installation",
    },
    async () => jsonResult({ packageVersion, ...installation }),
  );

  server.registerTool(
    "get_design_tokens",
    {
      annotations: readOnlyAnnotations,
      description: "Get all Brilliant UI design tokens or one named token group.",
      icons: toolIcons,
      inputSchema: z.object({
        group: z
          .enum(tokenGroupNames as [keyof typeof tokenGroups, ...(keyof typeof tokenGroups)[]])
          .optional(),
      }),
      outputSchema: designTokensOutputSchema,
      title: "Get Brilliant UI design tokens",
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
      description:
        "Installation and MCP configuration for the installed @brilliantmode/ui version.",
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
    "guide",
    new ResourceTemplate("brilliant://guides/{slug}", {
      list: async () => ({
        resources: documentationGuides.map((guide) => ({
          description: guide.summary,
          mimeType: "text/markdown",
          name: guide.title,
          uri: `brilliant://guides/${guide.slug}`,
        })),
      }),
    }),
    {
      description: "Version-matched application guidance for Brilliant UI.",
      mimeType: "text/markdown",
      title: "Brilliant UI guide",
    },
    async (uri, variables) => {
      const slug = String(variables.slug);
      const guide = guidesBySlug.get(slug);
      if (!guide) throw new Error(`Unknown Brilliant UI guide: ${slug}`);
      return {
        contents: [
          {
            mimeType: "text/markdown",
            text: `${guide.content}\n\n---\n\nDocumentation for @brilliantmode/ui ${packageVersion}.`,
            uri: uri.href,
          },
        ],
      };
    },
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
