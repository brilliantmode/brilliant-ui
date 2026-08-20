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
      "get_installation",
      "get_design_tokens",
    ]);
    expect(tools.every((tool) => tool.annotations?.readOnlyHint)).toBe(true);
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
      importExample: string;
      importPath: string;
      name: string;
    };
    expect(component.name).toBe("button");
    expect(component.importPath).toBe("@brilliant/ui/button");
    expect(component.importExample).toContain("import { Button }");
    expect(component.apiDeclarations).toContain("export declare function Button");
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
    } finally {
      await client.close();
    }
  });
});
