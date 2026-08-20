import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const execFileAsync = promisify(execFile);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = await mkdtemp(join(tmpdir(), "brilliant-ui-mcp-smoke-"));
const packDirectory = join(temporaryRoot, "package");
const consumerDirectory = join(temporaryRoot, "consumer");

try {
  await Promise.all([
    mkdir(packDirectory, { recursive: true }),
    mkdir(consumerDirectory, { recursive: true }),
  ]);

  await execFileAsync("npm", ["pack", "--pack-destination", packDirectory], {
    cwd: packageRoot,
  });

  const tarballName = (await readdir(packDirectory)).find((name) => name.endsWith(".tgz"));
  if (!tarballName) throw new Error("npm pack did not produce a package tarball.");

  const tarballPath = join(packDirectory, tarballName);
  const { stdout: packedManifestText } = await execFileAsync(
    "tar",
    ["-xOf", tarballPath, "package/package.json"],
    { encoding: "utf8" },
  );
  if (packedManifestText.includes('"catalog:')) {
    throw new Error("Packed package.json contains pnpm catalog dependency specifiers.");
  }

  await writeFile(
    join(consumerDirectory, "package.json"),
    `${JSON.stringify(
      {
        name: "brilliant-ui-mcp-smoke-consumer",
        private: true,
        version: "0.0.0",
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  await execFileAsync("npm", ["install", "--ignore-scripts", tarballPath], {
    cwd: consumerDirectory,
  });

  const transport = new StdioClientTransport({
    args: ["exec", "brilliant-ui-mcp"],
    command: "pnpm",
    cwd: consumerDirectory,
    stderr: "pipe",
  });
  const client = new Client({ name: "brilliant-ui-package-smoke", version: "1.0.0" });

  try {
    await client.connect(transport);

    const { tools } = await client.listTools();
    const toolNames = tools.map((tool) => tool.name);
    const expectedTools = [
      "search_components",
      "get_component",
      "suggest_components",
      "search_guides",
      "get_guide",
      "get_installation",
      "get_design_tokens",
    ];
    if (JSON.stringify(toolNames) !== JSON.stringify(expectedTools)) {
      throw new Error(`Unexpected packaged MCP tools: ${toolNames.join(", ")}`);
    }

    const component = await client.callTool({
      arguments: { name: "button" },
      name: "get_component",
    });
    const structuredComponent = component.structuredContent as
      | { apiDeclarations?: string; found?: boolean; usageExample?: string }
      | undefined;
    const usageExample = structuredComponent?.usageExample;
    if (
      !structuredComponent?.found ||
      !usageExample?.includes('variant="glow"') ||
      !usageExample.includes('loadingLabel="Saving"') ||
      !usageExample.includes('size="kiosk" variant="tactile"') ||
      !usageExample.includes('size="kiosk" variant="molded"') ||
      !usageExample.includes('size="kiosk" variant="gel"')
    ) {
      throw new Error("Packaged get_component did not return its structured usage example.");
    }
    if (
      !structuredComponent.apiDeclarations?.includes("loading?: boolean") ||
      !structuredComponent.apiDeclarations.includes("loadingLabel?: ReactNode")
    ) {
      throw new Error("Packaged Button declarations did not expose loading state.");
    }

    const applicationShell = await client.callTool({
      arguments: { name: "application-shell" },
      name: "get_component",
    });
    const structuredApplicationShell = applicationShell.structuredContent as
      | { apiDeclarations?: string; found?: boolean; usageExample?: string }
      | undefined;
    if (
      !structuredApplicationShell?.found ||
      !structuredApplicationShell.apiDeclarations?.includes('"integrated" | "portal" | "kiosk"') ||
      !structuredApplicationShell.usageExample?.includes("export function KioskExample()") ||
      !structuredApplicationShell.usageExample.includes('variant="kiosk"') ||
      !structuredApplicationShell.usageExample.includes("ApplicationShellFooter")
    ) {
      throw new Error("Packaged Application Shell did not expose the kiosk variation and footer.");
    }

    const recommendation = await client.callTool({
      arguments: {
        task: "Account settings with profile fields, notification preferences, save feedback, and destructive account deletion confirmation",
      },
      name: "suggest_components",
    });
    const recommended = recommendation.structuredContent as
      | { suggestions?: Array<{ name?: string; reason?: string }> }
      | undefined;
    const recommendedNames = recommended?.suggestions?.map((item) => item.name) ?? [];
    for (const expected of ["alert-dialog", "field", "form", "switch", "toast"]) {
      if (!recommendedNames.includes(expected)) {
        throw new Error(`Packaged suggestions did not include ${expected}.`);
      }
    }
    if (
      recommendedNames.includes("command") ||
      !recommended?.suggestions?.every((item) => item.reason?.startsWith("Matched "))
    ) {
      throw new Error("Packaged suggestions were noisy or missing match reasons.");
    }

    const resource = await client.readResource({ uri: "brilliant://components/button" });
    const resourceText = resource.contents[0];
    if (!resourceText || !("text" in resourceText) || !resourceText.text.includes('"button"')) {
      throw new Error("Packaged component resource could not be read.");
    }

    const guide = await client.callTool({
      arguments: { slug: "getting-started" },
      name: "get_guide",
    });
    const structuredGuide = guide.structuredContent as
      | { content?: string; found?: boolean }
      | undefined;
    if (
      !structuredGuide?.found ||
      !structuredGuide.content?.includes("pnpm add @brilliantmode/ui")
    ) {
      throw new Error("Packaged get_guide did not return its version-matched Markdown guide.");
    }

    const guideResource = await client.readResource({
      uri: "brilliant://guides/getting-started",
    });
    const guideResourceText = guideResource.contents[0];
    if (
      !guideResourceText ||
      !("text" in guideResourceText) ||
      !guideResourceText.text.includes("# Getting started")
    ) {
      throw new Error("Packaged guide resource could not be read.");
    }

    console.log(
      `Packaged MCP smoke test passed: ${tools.length} tools, explainable suggestions, structured usage, component resources, and guides.`,
    );
  } finally {
    await client.close();
  }
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
}
