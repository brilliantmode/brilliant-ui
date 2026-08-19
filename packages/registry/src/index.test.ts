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

  it("ships responsive header and structured footer layouts", () => {
    const header = findRegistryItem("header");
    const headerSource = header?.files[0]?.content;
    const footer = findRegistryItem("footer");
    const footerSource = footer?.files[0]?.content;

    expect(header?.kind).toBe("layout");
    expect(headerSource).toContain('sticky: "sticky top-0"');
    expect(headerSource).toContain('static: "relative"');
    expect(headerSource).toContain('fixed: "fixed inset-x-0 top-0"');
    expect(headerSource).toContain("data-[scrolled=true]:bg-background/95");
    expect(headerSource).toContain('behavior === "reveal"');
    expect(headerSource).toContain("data-scroll-direction={scrollState.direction}");
    expect(headerSource).toContain("onScrollStateChange?.(nextState)");
    expect(headerSource).toContain("export function HeaderMobileTrigger");
    expect(headerSource).toContain('event.key === "Escape"');
    expect(headerSource).toContain("max-md:border-b max-md:border-border");
    expect(headerSource).toContain("max-md:p-3 max-md:shadow-md");
    expect(headerSource).not.toContain("gap-1 border-b border-border bg-background p-3 shadow-md");
    expect(headerSource).not.toContain("bg-background p-3 shadow-md");
    expect(headerSource).not.toContain("border-b border-transparent");
    expect(headerSource).not.toContain("data-[scrolled=true]:border-border");
    expect(headerSource).toContain("border?: boolean");
    expect(headerSource).toContain('border && "border-b border-border"');
    expect(headerSource).toContain('data-border={border ? "visible" : "none"}');

    expect(footer?.kind).toBe("layout");
    expect(footerSource).toContain("export function FooterNav");
    expect(footerSource).toContain("export function FooterGroup");
    expect(footerSource).toContain("export function FooterBottom");
  });

  it("ships an application shell with pinned profile and structured header actions", () => {
    const item = findRegistryItem("application-shell");
    const source = item?.files[0]?.content;

    expect(item?.kind).toBe("layout");
    expect(source).toContain("export function ApplicationShellSidebarContent");
    expect(source).toContain("flex-col overflow-hidden border-r border-border");
    expect(source).toContain("border-b border-border px-4 pb-4");
    expect(source).toContain("[scrollbar-width:none] [&::-webkit-scrollbar]:hidden");
    expect(source).toContain("export function ApplicationShellSidebarFooter");
    expect(source).toContain("mt-auto shrink-0 border-t");
    expect(source).toContain("export function ApplicationShellProfileMenu");
    expect(source).toContain("group-open/profile:block");
    expect(source).toContain("export function ApplicationShellProfileTrigger");
    expect(source).toContain("export function ApplicationShellHeaderActions");
    expect(source).toContain("export function ApplicationShellHeaderAction");
    expect(source).toContain("export function ApplicationShellHeaderBrand");
    expect(source).toContain("export function ApplicationShellSidebarToggle");
    expect(source).toContain("export function ApplicationShellSidebarHeader");
    expect(source).toContain("collapsed?: boolean");
    expect(source).toContain("defaultCollapsed?: boolean");
    expect(source).toContain("onCollapsedChange?: (collapsed: boolean) => void");
    expect(source).toContain("data-collapsed={collapsed}");
    expect(source).toContain('aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}');
    expect(source).toContain("transition-[grid-template-columns]");
    expect(source).toContain("transition-[max-width,opacity]");
    expect(source).not.toContain("group-data-[collapsed=true]/sidebar:hidden");
  });

  it("ships a functional native file upload", () => {
    const item = findRegistryItem("file-upload");
    const source = item?.files[0]?.content;

    expect(item?.kind).toBe("component");
    expect(source).toContain('type="file"');
    expect(source).toContain("event.dataTransfer.files");
    expect(source).toContain("maxSize?: number");
    expect(source).toContain('capture?: "environment" | "user"');
    expect(source).toContain("export function FileUploadList");
    expect(source).toContain('role="progressbar"');
    expect(source).toContain('role="alert"');
  });

  it("ships photo upload with a live object URL preview", () => {
    const item = findRegistryItem("photo-upload");
    const source = item?.files[0]?.content;

    expect(item?.registryDependencies).toEqual(["file-upload", "photo"]);
    expect(source).toContain("URL.createObjectURL(file)");
    expect(source).toContain("URL.revokeObjectURL(nextUrl)");
    expect(source).toContain("export function PhotoUpload");
    expect(source).toContain("<PhotoImage alt={alt} src={displaySrc} />");
    expect(source).toContain("<FileUploadTrigger");
    expect(source).toContain('role="progressbar"');
  });

  it("ships the accessible dashboard system and installable dashboard blocks", () => {
    const chart = findRegistryItem("chart");
    const chartSource = chart?.files[0]?.content;
    const analytics = findRegistryItem("analytics-overview-dashboard");
    const health = findRegistryItem("system-health-dashboard");
    const capacity = findRegistryItem("capacity-dashboard");

    expect(chart?.dependencies).toEqual(["recharts", "react-is"]);
    expect(chartSource).toContain("Partial<TooltipContentProps");
    expect(chartSource).toContain("accessibilityLayer");
    expect(chartSource).toContain('color = "var(--brilliant-chart-1)"');
    expect(chartSource).toContain('state === "loading"');
    expect(analytics?.kind).toBe("block");
    expect(analytics?.registryDependencies).toEqual(["chart", "dashboard-layout", "stat"]);
    expect(health?.registryDependencies).toEqual(["dashboard-layout", "meter", "stat", "status"]);
    expect(capacity?.registryDependencies).toEqual(["chart", "dashboard-layout", "meter"]);
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
