import { describe, expect, it } from "vitest";
import { findRegistryItem, registry, registryKinds } from "./index.js";

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
});
