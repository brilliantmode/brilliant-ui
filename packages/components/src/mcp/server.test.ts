import { resolve } from "node:path";
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createBrilliantUiMcpServer } from "./server.js";

describe("Brilliant UI MCP server", () => {
  let client: Client;
  let server: ReturnType<typeof createBrilliantUiMcpServer>;

  beforeEach(async () => {
    client = new Client({ name: "brilliant-ui-test", version: "1.0.0" });
    server = createBrilliantUiMcpServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  });

  afterEach(async () => {
    await client.close();
    await server.close();
  });

  it("advertises the read-only Brilliant UI tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name)).toEqual([
      "search_components",
      "get_component",
      "suggest_components",
      "search_guides",
      "get_guide",
      "get_installation",
      "get_design_tokens",
    ]);
    expect(tools.every((tool) => tool.annotations?.readOnlyHint)).toBe(true);
    expect(tools.every((tool) => tool.title && tool.outputSchema)).toBe(true);
    expect(tools.every((tool) => tool.icons?.[0]?.src.includes("brilliant-ui.dev"))).toBe(true);
  });

  it("returns exact component metadata and declarations", async () => {
    const result = await client.callTool({
      arguments: { name: "button" },
      name: "get_component",
    });
    const text = result.content.find((block) => block.type === "text");
    expect(text?.type).toBe("text");
    if (text?.type !== "text") throw new Error("Expected a text result.");

    const component = JSON.parse(text.text) as {
      apiDeclarations: string;
      found: boolean;
      importExample: string;
      importPath: string;
      name: string;
      usageExample: string;
    };
    expect(component.found).toBe(true);
    expect(component.name).toBe("button");
    expect(component.importPath).toBe("@brilliantmode/ui/button");
    expect(component.importExample).toContain("import { Button }");
    expect(component.apiDeclarations).toContain("export declare function Button");
    expect(component.usageExample).toContain("Save changes");
    expect(result.structuredContent).toEqual(component);
  });

  it("returns actionable structured errors for unknown components", async () => {
    const result = await client.callTool({
      arguments: { name: "buton" },
      name: "get_component",
    });

    expect(result.isError).toBe(true);
    expect(result.structuredContent).toMatchObject({
      found: false,
      suggestions: ["button"],
    });
  });

  it("suggests relevant components without promoting incidental or avoid-only matches", async () => {
    const result = await client.callTool({
      arguments: {
        task: "Build an account settings page with editable profile fields, notification preferences, save feedback, and a destructive delete-account confirmation",
      },
      name: "suggest_components",
    });
    const structured = result.structuredContent as
      | {
          suggestions?: Array<{
            matchedTerms?: string[];
            name?: string;
            reason?: string;
            score?: number;
          }>;
        }
      | undefined;
    const suggestions = structured?.suggestions ?? [];
    const names = suggestions.map((suggestion) => suggestion.name);

    expect(names).toEqual(
      expect.arrayContaining(["alert-dialog", "field", "form", "switch", "toast"]),
    );
    for (const unrelated of [
      "analytics-overview-dashboard",
      "command",
      "onboarding-wizard",
      "system-health-dashboard",
    ]) {
      expect(names).not.toContain(unrelated);
    }
    expect(suggestions.every((suggestion) => suggestion.matchedTerms?.length)).toBe(true);
    expect(suggestions.every((suggestion) => suggestion.reason?.startsWith("Matched "))).toBe(true);
    expect(suggestions.map((suggestion) => suggestion.score)).toEqual(
      [...suggestions]
        .map((suggestion) => suggestion.score)
        .sort((left, right) => (right ?? 0) - (left ?? 0)),
    );

    const avoidOnly = await client.callTool({
      arguments: { task: "Use this for a one-screen settings form" },
      name: "suggest_components",
    });
    const avoidOnlyNames = (
      avoidOnly.structuredContent as { suggestions?: Array<{ name?: string }> } | undefined
    )?.suggestions?.map((suggestion) => suggestion.name);
    expect(avoidOnlyNames).not.toContain("onboarding-wizard");
  });

  it("lists and reads version-matched component resources", async () => {
    const { resources } = await client.listResources();
    expect(resources.some((resource) => resource.uri === "brilliant://components/button")).toBe(
      true,
    );

    const result = await client.readResource({ uri: "brilliant://components/button" });
    const content = result.contents[0];
    expect(content && "text" in content ? content.text : "").toContain('"name": "button"');
  });

  it("searches and reads version-matched application guides", async () => {
    const search = await client.callTool({
      arguments: { query: "form validation" },
      name: "search_guides",
    });
    expect(search.structuredContent).toMatchObject({ packageVersion: "0.1.0" });
    const searchResult = search.structuredContent as
      | { guides?: Array<{ slug?: string }> }
      | undefined;
    expect(searchResult?.guides?.some((item) => item.slug === "forms-and-validation")).toBe(true);

    const guide = await client.callTool({
      arguments: { slug: "accessibility-and-motion" },
      name: "get_guide",
    });
    expect(guide.structuredContent).toMatchObject({
      found: true,
      slug: "accessibility-and-motion",
    });

    const resource = await client.readResource({
      uri: "brilliant://guides/accessibility-and-motion",
    });
    const content = resource.contents[0];
    expect(content && "text" in content ? content.text : "").toContain(
      "# Accessibility and motion",
    );
  });
});

describe("Brilliant UI MCP stdio executable", () => {
  it("serves the compiled package binary over stdio", async () => {
    const client = new Client({ name: "brilliant-ui-stdio-test", version: "1.0.0" });
    const transport = new StdioClientTransport({
      args: [resolve("dist/mcp/bin.js")],
      command: process.execPath,
      cwd: process.cwd(),
      stderr: "pipe",
    });

    try {
      await client.connect(transport);
      const { tools } = await client.listTools();
      expect(tools.some((tool) => tool.name === "get_component")).toBe(true);

      const result = await client.callTool({
        arguments: { query: "upload photo" },
        name: "search_components",
      });
      const text = result.content.find((block) => block.type === "text");
      expect(text?.type === "text" ? text.text : "").toContain("photo-upload");
      expect(result.structuredContent).toMatchObject({ packageVersion: "0.1.0" });
    } finally {
      await client.close();
    }
  });
});
