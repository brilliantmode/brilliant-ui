// @vitest-environment jsdom

import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignalOrb } from "./generated/signal-orb.js";

let host: HTMLDivElement;
let root: Root;
let now: number;
let frames: Map<number, FrameRequestCallback>;
let motion: MediaQueryList;
let intersectionCallback: IntersectionObserverCallback | undefined;
let gl: ReturnType<typeof fakeWebGL>;

function fakeWebGL() {
  return {
    ARRAY_BUFFER: 34962,
    BLEND: 3042,
    COLOR_BUFFER_BIT: 16384,
    COMPILE_STATUS: 35713,
    FLOAT: 5126,
    FRAGMENT_SHADER: 35632,
    LINK_STATUS: 35714,
    ONE: 1,
    ONE_MINUS_SRC_ALPHA: 771,
    POINTS: 0,
    SRC_ALPHA: 770,
    STATIC_DRAW: 35044,
    VERTEX_SHADER: 35633,
    attachShader: vi.fn(),
    bindBuffer: vi.fn(),
    blendFuncSeparate: vi.fn(),
    bufferData: vi.fn(),
    clear: vi.fn(),
    clearColor: vi.fn(),
    compileShader: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    createProgram: vi.fn(() => ({})),
    createShader: vi.fn(() => ({})),
    deleteBuffer: vi.fn(),
    deleteProgram: vi.fn(),
    deleteShader: vi.fn(),
    drawArrays: vi.fn(),
    enable: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getProgramParameter: vi.fn(() => true),
    getShaderParameter: vi.fn(() => true),
    getUniformLocation: vi.fn((_program: unknown, name: string) => name),
    isContextLost: vi.fn(() => false),
    linkProgram: vi.fn(),
    shaderSource: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform3f: vi.fn(),
    uniform4fv: vi.fn((_location: unknown, values: Float32Array) => Array.from(values)),
    useProgram: vi.fn(),
    vertexAttribPointer: vi.fn(),
    viewport: vi.fn(),
  };
}

function nextFrame(elapsed = 16) {
  now += elapsed;
  const pending = [...frames.values()];
  frames.clear();
  act(() => {
    for (const callback of pending) callback(now);
  });
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  now = 100;
  frames = new Map();
  let frameId = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  motion = Object.assign(new EventTarget(), { matches: false }) as MediaQueryList;
  const contrast = Object.assign(new EventTarget(), { matches: false }) as MediaQueryList;
  vi.stubGlobal("matchMedia", (query: string) =>
    query.includes("reduced-motion") ? motion : contrast,
  );
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  gl = fakeWebGL();
  const context = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: "",
    getImageData: () => ({ data: [127, 64, 255, 255] }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(((type: string) =>
    type === "webgl" ? gl : context) as unknown as HTMLCanvasElement["getContext"]);
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Signal Orb", () => {
  it("server-renders meaningful status and a decorative fallback before WebGL initializes", () => {
    const markup = renderToStaticMarkup(
      <SignalOrb color="rebeccapurple" label="Report ready" state="done" />,
    );
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Report ready");
    expect(markup).toContain('data-renderer="fallback"');
    expect(markup).toContain('data-state="done"');
    expect(markup).toContain("color:rebeccapurple");
    expect(markup).toContain('data-slot="fallback"');
    expect(markup).toContain('aria-hidden="true"');
    expect(gl.createProgram).not.toHaveBeenCalled();
  });

  it("keeps status and SVG available when WebGL is unavailable", () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    act(() => root.render(<SignalOrb state="searching" />));
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Assistant searching");
    expect(host.querySelector('[data-renderer="fallback"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="fallback"]')?.classList.contains("block")).toBe(true);
    expect(frames.size).toBe(0);
  });

  it("cleans up failed shader initialization and retains the fallback", () => {
    gl.getShaderParameter.mockReturnValue(false);
    act(() => root.render(<SignalOrb />));
    expect(host.querySelector('[data-renderer="fallback"]')).not.toBeNull();
    expect(gl.deleteProgram).toHaveBeenCalledOnce();
    expect(gl.deleteBuffer).toHaveBeenCalledOnce();
    expect(gl.deleteShader).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
  });

  it("clamps unsafe numerical inputs and updates paused states without rebuilding the renderer", () => {
    act(() => root.render(<SignalOrb level={9} particleCount={20000} paused />));
    nextFrame();
    expect(gl.drawArrays).toHaveBeenLastCalledWith(gl.POINTS, 0, 12000);
    expect(gl.uniform1f).toHaveBeenCalledWith("uLevel", 1);
    expect(frames.size).toBe(0);
    act(() =>
      root.render(<SignalOrb level={Number.NaN} particleCount={20000} paused state="done" />),
    );
    nextFrame();
    expect(gl.uniform1f).toHaveBeenCalledWith("uLevel", 0.5);
    expect(gl.uniform4fv.mock.results.at(-1)?.value).toEqual([0, 0, 0, 1]);
    expect(gl.createProgram).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    act(() => root.render(<SignalOrb particleCount={-1} paused />));
    nextFrame();
    expect(gl.drawArrays).toHaveBeenLastCalledWith(gl.POINTS, 0, 300);
  });

  it("freezes the animation clock on pause and resumes from the same point", () => {
    const animationTime = () =>
      gl.uniform1f.mock.calls.filter(([uniform]) => uniform === "uTime").at(-1)?.[1];
    act(() => root.render(<SignalOrb />));
    nextFrame();
    nextFrame();
    const beforePause = animationTime();
    act(() => root.render(<SignalOrb paused />));
    nextFrame();
    expect(animationTime()).toBe(beforePause);
    expect(frames.size).toBe(0);
    const drawsWhilePaused = gl.drawArrays.mock.calls.length;
    nextFrame(5000);
    expect(gl.drawArrays).toHaveBeenCalledTimes(drawsWhilePaused);
    act(() => root.render(<SignalOrb paused={false} />));
    nextFrame();
    expect(animationTime()).toBeCloseTo(Number(beforePause) + 0.016);
    expect(frames.size).toBe(1);
    expect(gl.createProgram).toHaveBeenCalledOnce();
  });

  it("honors reduced motion at mount and when the preference changes", () => {
    Object.assign(motion, { matches: true });
    act(() => root.render(<SignalOrb />));
    nextFrame();
    expect(frames.size).toBe(0);
    act(() => root.render(<SignalOrb state="thinking" />));
    nextFrame();
    expect(gl.uniform4fv.mock.results.at(-1)?.value).toEqual([0, 1, 0, 0]);
    expect(frames.size).toBe(0);
    Object.assign(motion, { matches: false });
    act(() => motion.dispatchEvent(new Event("change")));
    nextFrame();
    expect(frames.size).toBe(1);
    Object.assign(motion, { matches: true });
    act(() => motion.dispatchEvent(new Event("change")));
    nextFrame();
    expect(frames.size).toBe(0);
  });

  it("stops rendering in hidden tabs and outside the viewport, then resumes", () => {
    act(() => root.render(<SignalOrb />));
    nextFrame();
    expect(frames.size).toBe(1);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(frames.size).toBe(0);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    nextFrame();
    expect(frames.size).toBe(1);
    act(() =>
      intersectionCallback?.(
        [{ isIntersecting: false }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    expect(frames.size).toBe(0);
    act(() =>
      intersectionCallback?.(
        [{ isIntersecting: true }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    nextFrame();
    expect(frames.size).toBe(1);
  });

  it("reduces density on slow frames and stops after settling into completion", () => {
    act(() => root.render(<SignalOrb />));
    for (let i = 0; i < 40; i++) nextFrame(40);
    expect(gl.drawArrays).toHaveBeenLastCalledWith(gl.POINTS, 0, 3000);
    act(() => root.render(<SignalOrb state="done" />));
    for (let i = 0; i < 90; i++) nextFrame();
    expect(frames.size).toBe(0);
    expect(gl.uniform4fv.mock.results.at(-1)?.value[3]).toBeGreaterThan(0.999);
  });

  it("recovers from context loss and releases resources under Strict Mode", () => {
    act(() =>
      root.render(
        <StrictMode>
          <SignalOrb />
        </StrictMode>,
      ),
    );
    nextFrame();
    expect(gl.createProgram).toHaveBeenCalledTimes(2);
    expect(gl.deleteProgram).toHaveBeenCalledOnce();
    const canvas = host.querySelector("canvas");
    if (!canvas) throw new Error("Missing canvas");
    const lost = new Event("webglcontextlost", { cancelable: true });
    act(() => canvas.dispatchEvent(lost));
    expect(lost.defaultPrevented).toBe(true);
    expect(host.querySelector('[data-renderer="fallback"]')).not.toBeNull();
    expect(frames.size).toBe(0);
    act(() => canvas.dispatchEvent(new Event("webglcontextrestored")));
    nextFrame();
    expect(host.querySelector('[data-renderer="webgl"]')).not.toBeNull();
    expect(gl.createProgram).toHaveBeenCalledTimes(3);
    act(() => root.render(null));
    expect(gl.deleteProgram).toHaveBeenCalledTimes(3);
    expect(gl.deleteBuffer).toHaveBeenCalledTimes(3);
    expect(gl.deleteShader).toHaveBeenCalledTimes(6);
    expect(frames.size).toBe(0);
  });
});
