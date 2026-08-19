import { describe, expect, it } from "vitest";
import {
  checksumContent,
  createRegistryArtifacts,
  findRegistryItem,
  type RegistryItem,
  registry,
  registryItemSchema,
  registryKinds,
  resolveRegistryDependencies,
  validateRegistry,
  validateRegistryItem,
} from "./index.js";

describe("registry", () => {
  it("contains unique item names and valid kinds", () => {
    const names = registry.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
    expect(registry.every((item) => registryKinds.includes(item.kind))).toBe(true);
  });

  it("resolves bundled items", () => {
    expect(findRegistryItem("button")?.metadata.accessibility.length).toBeGreaterThan(0);
    expect(findRegistryItem("missing")).toBeUndefined();
  });

  it("ships photo crop and treatment APIs", () => {
    const photoSource = findRegistryItem("photo")?.files[0]?.content;

    expect(photoSource).toContain("crop?: keyof typeof crops");
    expect(photoSource).toContain(
      'crop === "rectangle" ? (style?.aspectRatio ?? String(ratio)) : "1"',
    );
    expect(photoSource).toContain('circle: "rounded-full"');
    expect(photoSource).toContain("filter?: keyof typeof filters");
    expect(photoSource).toContain("export function PhotoTint");
  });

  it("keeps avatar images circular without clipping presence status", () => {
    const avatarSource = findRegistryItem("avatar")?.files[0]?.content;

    expect(avatarSource).toContain("size-full rounded-full object-cover");
    expect(avatarSource).not.toContain(
      "items-center justify-center overflow-hidden rounded-full bg-muted",
    );
  });

  it("defines a versioned JSON schema", () => {
    expect(registryItemSchema.properties.kind.enum).toBe(registryKinds);
    expect(registryItemSchema.required).toContain("registryDependencies");
  });

  it("validates bundled items and generates checksummed artifacts", () => {
    expect(validateRegistry()).toEqual([]);
    const artifacts = createRegistryArtifacts();
    expect(artifacts.index.version).toBe(1);
    expect(artifacts.items.button?.files[0]?.checksum).toBe(
      checksumContent(registry[0]?.files[0]?.content ?? ""),
    );
  });

  it("rejects unsafe paths", () => {
    const item = {
      ...registry[0],
      files: [{ path: "../button.tsx", content: "" }],
    } satisfies RegistryItem;
    expect(validateRegistryItem(item)).toContain('button: unsafe file path "../button.tsx".');
  });

  it("resolves transitive registry dependencies deterministically", () => {
    const dependency = {
      ...registry[0],
      name: "utility",
      registryDependencies: [],
    } satisfies RegistryItem;
    const item = {
      ...registry[0],
      name: "dependent",
      registryDependencies: ["utility"],
    } satisfies RegistryItem;

    expect(
      resolveRegistryDependencies(["dependent"], [item, dependency]).map((entry) => entry.name),
    ).toEqual(["utility", "dependent"]);
  });
});
