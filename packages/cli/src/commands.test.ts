import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { addItems, detectProject, initProject } from "./commands.js";

describe("CLI project workflow", () => {
  it("initializes a project and installs a registry item", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "brilliant-ui-test-"));
    const messages: string[] = [];
    const context = { cwd, force: false, log: (message: string) => messages.push(message) };

    await initProject(context);
    await addItems(["button"], context);

    const config = await readFile(join(cwd, "brilliant-ui.json"), "utf8");
    const button = await readFile(join(cwd, "src/components/ui/button.tsx"), "utf8");
    expect(config).toContain('"cssVariables": true');
    expect(button).toContain("export function Button");
    expect(messages).toContain("Added src/components/ui/button.tsx");
  });

  it("refuses to replace config without an explicit force flag", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "brilliant-ui-test-"));
    const context = { cwd, force: false, log: () => undefined };
    await initProject(context);
    await expect(initProject(context)).rejects.toThrow("already exists");
  });

  it("previews writes during dry runs", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "brilliant-ui-test-"));
    const messages: string[] = [];
    const context = {
      cwd,
      dryRun: true,
      force: false,
      log: (message: string) => messages.push(message),
    };

    await initProject(context);

    await expect(readFile(join(cwd, "brilliant-ui.json"), "utf8")).rejects.toThrow("ENOENT");
    expect(messages).toContain("Would create brilliant-ui.json");
  });

  it("detects existing Vite and shadcn projects", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "brilliant-ui-test-"));
    await mkdir(join(cwd, "src"));
    await writeFile(join(cwd, "pnpm-lock.yaml"), "", "utf8");
    await writeFile(
      join(cwd, "package.json"),
      JSON.stringify({
        dependencies: { "@vitejs/plugin-react": "latest", vite: "latest" },
        devDependencies: { tailwindcss: "latest", typescript: "latest" },
      }),
      "utf8",
    );
    await writeFile(
      join(cwd, "components.json"),
      JSON.stringify({
        aliases: { components: "@/components/custom", utils: "@/lib/custom-utils" },
        tailwind: { css: "src/styles.css" },
      }),
      "utf8",
    );

    const detected = await detectProject(cwd);

    expect(detected.framework).toBe("vite");
    expect(detected.packageManager).toBe("pnpm");
    expect(detected.shadcn.componentsAlias).toBe("@/components/custom");
  });

  it("maps existing shadcn aliases during initialization", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "brilliant-ui-test-"));
    const messages: string[] = [];
    await writeFile(
      join(cwd, "components.json"),
      JSON.stringify({
        aliases: { components: "@/components/custom", utils: "@/lib/custom-utils" },
        css: "src/styles.css",
      }),
      "utf8",
    );

    await initProject({ cwd, force: false, log: (message: string) => messages.push(message) });

    const config = await readFile(join(cwd, "brilliant-ui.json"), "utf8");
    expect(config).toContain('"components": "@/components/custom"');
    expect(config).toContain('"css": "src/styles.css"');
    expect(messages).toContain("Mapped components.json aliases.");
  });
});
