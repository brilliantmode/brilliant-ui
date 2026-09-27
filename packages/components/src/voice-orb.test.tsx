// @vitest-environment jsdom

import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceOrb } from "./generated/voice-orb.js";

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

describe("Voice Orb", () => {
  it("server-renders meaningful status and a decorative fallback before WebGL initializes", () => {
    const markup = renderToStaticMarkup(
      <VoiceOrb color="rebeccapurple" label="Report ready" state="speaking" />,
    );
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Report ready");
    expect(markup).toContain('data-renderer="fallback"');
    expect(markup).toContain('data-state="speaking"');
    expect(markup).toContain("color:rebeccapurple");
    expect(markup).toContain('data-slot="fallback"');
    expect(markup).toContain('aria-hidden="true"');
    expect(gl.createProgram).not.toHaveBeenCalled();
  });

  it("keeps status and SVG available when WebGL is unavailable", () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    act(() => root.render(<VoiceOrb state="listening" />));
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Voice assistant listening");
    expect(host.querySelector('[data-renderer="fallback"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="fallback"]')?.classList.contains("block")).toBe(true);
    expect(frames.size).toBe(0);
  });

  it("cleans up failed shader initialization and retains the fallback", () => {
    gl.getShaderParameter.mockReturnValue(false);
    act(() => root.render(<VoiceOrb />));
    expect(host.querySelector('[data-renderer="fallback"]')).not.toBeNull();
    expect(gl.deleteProgram).toHaveBeenCalledOnce();
    expect(gl.deleteBuffer).toHaveBeenCalledOnce();
    expect(gl.deleteShader).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
  });

  it("clamps unsafe numerical inputs and updates paused states without rebuilding the renderer", () => {
    act(() =>
      root.render(
        <VoiceOrb bands={{ low: 9, mid: -1, high: Number.NaN }} particleCount={20000} paused />,
      ),
    );
    nextFrame();
    expect(gl.drawArrays).toHaveBeenLastCalledWith(gl.POINTS, 0, 12000);
    expect(gl.uniform3f).toHaveBeenCalledWith("uBands", 1, 0, 0);
    expect(frames.size).toBe(0);
    act(() =>
      root.render(<VoiceOrb bands={{ mid: 0.4 }} particleCount={20000} paused state="speaking" />),
    );
    nextFrame();
    expect(gl.uniform3f).toHaveBeenCalledWith("uBands", 0, 0.4, 0);
    expect(gl.uniform4fv.mock.results.at(-1)?.value).toEqual([0, 0, 0, 1]);
    expect(gl.createProgram).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    act(() => root.render(<VoiceOrb particleCount={-1} paused />));
    nextFrame();
    expect(gl.drawArrays).toHaveBeenLastCalledWith(gl.POINTS, 0, 300);
  });

  it("freezes the animation clock on pause and resumes from the same point", () => {
    const animationTime = () =>
      gl.uniform1f.mock.calls.filter(([uniform]) => uniform === "uTime").at(-1)?.[1];
    act(() => root.render(<VoiceOrb />));
    nextFrame();
    nextFrame();
    const beforePause = animationTime();
    act(() => root.render(<VoiceOrb paused />));
    nextFrame();
    expect(animationTime()).toBe(beforePause);
    expect(frames.size).toBe(0);
    const drawsWhilePaused = gl.drawArrays.mock.calls.length;
    nextFrame(5000);
    expect(gl.drawArrays).toHaveBeenCalledTimes(drawsWhilePaused);
    act(() => root.render(<VoiceOrb paused={false} />));
    nextFrame();
    expect(animationTime()).toBeCloseTo(Number(beforePause) + 0.016);
    expect(frames.size).toBe(1);
    expect(gl.createProgram).toHaveBeenCalledOnce();
  });

  it("honors reduced motion at mount and when the preference changes", () => {
    Object.assign(motion, { matches: true });
    act(() => root.render(<VoiceOrb />));
    nextFrame();
    expect(frames.size).toBe(0);
    act(() => root.render(<VoiceOrb state="thinking" />));
    nextFrame();
    expect(gl.uniform4fv.mock.results.at(-1)?.value).toEqual([0, 0, 1, 0]);
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
    act(() => root.render(<VoiceOrb />));
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

  it("reduces density on slow frames while preserving the surface animation", () => {
    act(() => root.render(<VoiceOrb />));
    for (let i = 0; i < 40; i++) nextFrame(40);
    expect(gl.drawArrays).toHaveBeenLastCalledWith(gl.POINTS, 0, 4500);
    expect(frames.size).toBe(1);
  });

  it("reads independent frequency bands without changing caller-owned audio", () => {
    let activeBand = "low";
    const node = {
      context: { sampleRate: 48000, resume: vi.fn(), close: vi.fn() },
      fftSize: 2048,
      frequencyBinCount: 1024,
      connect: vi.fn(),
      disconnect: vi.fn(),
      getByteFrequencyData: vi.fn((data: Uint8Array) => {
        expect(data.length).toBe(node.frequencyBinCount);
        data.fill(0);
        for (let i = 0; i < data.length; i++) {
          const hz = (i * node.context.sampleRate) / node.fftSize;
          if (
            (activeBand === "low" && hz >= 50 && hz < 250) ||
            (activeBand === "mid" && hz >= 250 && hz < 2400) ||
            (activeBand === "high" && hz >= 2400 && hz < 12000)
          )
            data[i] = 255;
        }
      }),
    };
    const currentBands = () =>
      gl.uniform3f.mock.calls
        .filter(([uniform]) => uniform === "uBands")
        .at(-1)
        ?.slice(1) as number[];
    act(() =>
      root.render(<VoiceOrb analyser={node as unknown as AnalyserNode} bands={{ high: 1 }} />),
    );
    for (let i = 0; i < 90; i++) nextFrame();
    expect(currentBands()[0]).toBeCloseTo(1);
    expect(currentBands()[1]).toBe(0);
    expect(currentBands()[2]).toBe(0); // analyser takes precedence over supplied high band.
    activeBand = "mid";
    node.fftSize = 4096;
    node.frequencyBinCount = 2048;
    for (let i = 0; i < 90; i++) nextFrame();
    expect(currentBands()[0]).toBeCloseTo(0);
    expect(currentBands()[1]).toBeCloseTo(1);
    expect(currentBands()[2]).toBe(0);
    activeBand = "high";
    for (let i = 0; i < 90; i++) nextFrame();
    expect(currentBands()[1]).toBeCloseTo(0);
    expect(currentBands()[2]).toBeCloseTo(1);
    act(() => root.render(<VoiceOrb analyser={node as unknown as AnalyserNode} paused />));
    const reads = node.getByteFrequencyData.mock.calls.length;
    nextFrame();
    expect(node.getByteFrequencyData).toHaveBeenCalledTimes(reads);
    expect(frames.size).toBe(0);
    act(() => root.render(null));
    expect(node.connect).not.toHaveBeenCalled();
    expect(node.disconnect).not.toHaveBeenCalled();
    expect(node.context.resume).not.toHaveBeenCalled();
    expect(node.context.close).not.toHaveBeenCalled();
  });

  it("smooths attack and release and recovers when an analyser cannot be read", () => {
    const currentLow = () =>
      gl.uniform3f.mock.calls.filter(([uniform]) => uniform === "uBands").at(-1)?.[1] as number;
    const node = {
      context: { sampleRate: 44100 },
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: vi.fn((data: Uint8Array) => data.fill(255)),
    };
    act(() => root.render(<VoiceOrb analyser={node as unknown as AnalyserNode} />));
    nextFrame();
    const attack = currentLow();
    expect(attack).toBeGreaterThan(0);
    expect(attack).toBeLessThan(1);
    for (let i = 0; i < 60; i++) nextFrame();
    const peak = currentLow();
    node.getByteFrequencyData.mockImplementation(() => {
      throw new Error("Unavailable");
    });
    nextFrame();
    expect(currentLow()).toBeLessThan(peak);
    expect(peak - currentLow()).toBeLessThan(attack);
    for (let i = 0; i < 100; i++) nextFrame();
    expect(currentLow()).toBeCloseTo(0);
    expect(frames.size).toBe(1);
  });

  it("recovers from context loss and releases resources under Strict Mode", () => {
    act(() =>
      root.render(
        <StrictMode>
          <VoiceOrb />
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
