export const voiceOrbSource = `"use client";

// Independently implemented; original visual concept: Ship Notes / aqualang89.
// https://github.com/aqualang89
// https://aqualang89.github.io/shipnotes-components/components/voice-orb/demo.html

import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

export type VoiceOrbState = "idle" | "listening" | "thinking" | "speaking";

export interface VoiceOrbBands {
  low: number;
  mid: number;
  high: number;
}

export interface VoiceOrbProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: VoiceOrbState;
  /** Read-only analysis tap. The caller owns the audio graph and its lifetime. */
  analyser?: AnalyserNode | null;
  /** Normalized frequency bands, clamped to 0–1. Used when no analyser is supplied. */
  bands?: Partial<VoiceOrbBands>;
  /** Accessible status text. Defaults to the current assistant state. */
  label?: string;
  size?: "sm" | "md" | "lg";
  /** Any CSS color, including a design token. Overrides the state palette. */
  color?: string;
  /** Maximum particle count, clamped to 300–12,000. */
  particleCount?: number;
  paused?: boolean;
}

const sizes = { sm: "w-32", md: "w-60", lg: "w-90" } as const;
const states = { idle: 0, listening: 1, thinking: 2, speaking: 3 } as const;
const labels = {
  idle: "Voice assistant ready",
  listening: "Voice assistant listening",
  thinking: "Voice assistant thinking",
  speaking: "Voice assistant speaking",
};
const colors = {
  idle: "var(--brilliant-primary, currentColor)",
  listening: "var(--brilliant-chart-3, currentColor)",
  thinking: "var(--brilliant-chart-4, currentColor)",
  speaking: "var(--brilliant-chart-5, currentColor)",
};

const vertexSource = \`
attribute vec3 aSeed;
uniform float uTime;
uniform vec3 uBands;
uniform float uSize;
uniform vec2 uAspect;
uniform vec4 uWeights;
varying float vAlpha;
varying float vEnergy;
const float TAU = 6.28318530718;
void main() {
  float t = uTime;
  float angle = aSeed.x * TAU;
  float y = aSeed.y * 2.0 - 1.0;
  float latitude = asin(y);
  float rim = sqrt(max(0.0, 1.0 - y * y));
  float low = uBands.x;
  float mid = uBands.y;
  float high = uBands.z;
  float listening = uWeights.y;
  float thinking = uWeights.z;
  float speaking = uWeights.w;

  // One continuous surface: bass breathes, mids fold, highs add fine texture.
  float turn = angle + t * 0.12 + thinking * sin(y * 3.0 + t * 0.8) * 0.35;
  float inward = sin(latitude * 11.0 + t * 2.5);
  float outward = sin(latitude * 9.0 - t * 3.0 + sin(angle * 3.0) * 0.65);
  float fold = sin(angle * 3.0 + t * 0.9 + latitude * 4.0);
  float radius = 0.64 + 0.009 * sin(t * 1.4 + y * 2.0);
  radius += low * (0.035 + speaking * 0.035) * (0.6 + 0.4 * sin(latitude * 4.0 - t * 2.0));
  radius += listening * (0.017 + mid * 0.052) * inward;
  radius += speaking * (0.025 + mid * 0.065) * outward;
  radius += thinking * (0.06 * fold * rim + 0.022 * sin(latitude * 8.0 - t * 1.4));
  radius += high * 0.013 * sin(angle * 19.0 + y * 25.0 - t * 3.0);
  vec3 position = vec3(cos(turn) * rim, y, sin(turn) * rim) * radius;
  position.yz = mat2(0.966, -0.259, 0.259, 0.966) * position.yz;
  float depth = smoothstep(-0.7, 0.7, position.z);
  float edge = pow(max(0.0, 1.0 - abs(position.z) / max(radius, 0.1)), 2.0);
  float flow = listening * inward + speaking * outward + thinking * fold;
  gl_Position = vec4(position.xy * uAspect, 0.0, 1.0);
  gl_PointSize = uSize * (0.65 + aSeed.z * 0.35 + depth * 0.3 + high * 0.12);
  vAlpha = (0.18 + depth * 0.62 + edge * 0.2) * (0.75 + aSeed.z * 0.25);
  vAlpha *= 0.88 + 0.12 * flow;
  vEnergy = 0.12 + edge * 0.26 + max(0.0, flow) * 0.13 + high * 0.12;
}
\`;

const fragmentSource = \`
precision mediump float;
uniform vec3 uColor;
varying float vAlpha;
varying float vEnergy;
void main() {
  float distance = length(gl_PointCoord - vec2(0.5));
  float alpha = (1.0 - smoothstep(0.1, 0.5, distance)) * vAlpha;
  gl_FragColor = vec4(mix(uColor, vec3(1.0), vEnergy * 0.32), alpha);
}
\`;

function bounded(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function createRenderer(canvas: HTMLCanvasElement, count: number) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false });
  if (!gl) return null;
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const shaders: WebGLShader[] = [];
  const dispose = () => {
    for (const shader of shaders) gl.deleteShader(shader);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
  if (!program || !buffer) { dispose(); return null; }
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
    const shader = gl.createShader(type);
    if (!shader) { dispose(); return null; }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { dispose(); return null; }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return null; }
  const seeds = new Float32Array(count * 3);
  // Low-discrepancy seeds keep every density level evenly distributed.
  for (let i = 0; i < count; i++) {
    seeds[i * 3] = (i * 0.61803398875) % 1;
    seeds[i * 3 + 1] = (i * 0.75487766625) % 1;
    seeds[i * 3 + 2] = (i * 0.56984029099) % 1;
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL useProgram is not a React hook.
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "aSeed");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  const uniforms = Object.fromEntries(
    ["uTime", "uBands", "uSize", "uAspect", "uWeights", "uColor"].map(name => [name, gl.getUniformLocation(program, name)]),
  );
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });
  let previousColor = "";
  return {
    dispose,
    draw(time: number, bands: VoiceOrbBands, weights: Float32Array, particleCount: number, cssColor: string) {
      if (gl.isContextLost()) return;
      if (context && cssColor !== previousColor) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = cssColor;
        context.fillRect(0, 0, 1, 1);
        const pixel = context.getImageData(0, 0, 1, 1).data;
        gl.uniform3f(uniforms.uColor ?? null, (pixel[0] ?? 0) / 255, (pixel[1] ?? 0) / 255, (pixel[2] ?? 0) / 255);
        previousColor = cssColor;
      } else if (!context) {
        gl.uniform3f(uniforms.uColor ?? null, 0.5, 0.5, 0.5);
      }
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(width * dpr));
      const h = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uniforms.uAspect ?? null, Math.min(1, h / w), Math.min(1, w / h));
      gl.uniform1f(uniforms.uTime ?? null, time);
      gl.uniform3f(uniforms.uBands ?? null, bands.low, bands.mid, bands.high);
      gl.uniform1f(uniforms.uSize ?? null, dpr * Math.max(1.3, Math.min(width, height) / 200));
      gl.uniform4fv(uniforms.uWeights ?? null, weights);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    },
  };
}

export function VoiceOrb({
  analyser = null, bands, className = "", color, label, particleCount = 9000,
  paused = false, size = "md", state = "idle", style, ...props
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const requestDraw = useRef<(() => void) | null>(null);
  const settings = useRef({ analyser, bands, paused, state });
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const count = Math.round(bounded(particleCount, 300, 12000, 9000));

  useEffect(() => {
    settings.current = { analyser, bands, paused, state };
    requestDraw.current?.();
  }, [analyser, bands, paused, state]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Context restoration must rebuild every GPU resource.
  useEffect(() => {
    const canvas = canvasRef.current;
    const element = rootRef.current;
    if (!canvas || !element) return;
    setReady(false);
    let renderer: ReturnType<typeof createRenderer> = null;
    try { renderer = createRenderer(canvas, count); } catch { return; }
    if (!renderer) return;
    const activeRenderer = renderer;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrast = window.matchMedia("(forced-colors: active)");
    const weights = new Float32Array(4);
    weights[states[settings.current.state]] = 1;
    let frame = 0;
    let lastTime = 0;
    let time = 0;
    let visible = true;
    let lost = false;
    let disposed = false;
    let density = count;
    let slowFrames = 0;
    let frequencyData = new Uint8Array(0);
    const envelope: VoiceOrbBands = { low: 0, mid: 0, high: 0 };
    const readBands = (node: AnalyserNode): VoiceOrbBands => {
      if (frequencyData.length !== node.frequencyBinCount) frequencyData = new Uint8Array(node.frequencyBinCount);
      node.getByteFrequencyData(frequencyData);
      const binWidth = node.context.sampleRate / node.fftSize;
      const average = (from: number, to: number) => {
        const first = Math.max(1, Math.ceil(from / binWidth));
        const last = Math.min(frequencyData.length, Math.ceil(to / binWidth));
        let sum = 0;
        for (let i = first; i < last; i++) sum += ((frequencyData[i] ?? 0) / 255) ** 2;
        return Math.min(1, Math.sqrt(sum / Math.max(1, last - first)) * 1.6);
      };
      return { low: average(50, 250), mid: average(250, 2400), high: average(2400, 12000) };
    };
    const canDraw = () => !disposed && !lost && visible && !document.hidden && !contrast.matches;
    const draw = (now: number) => {
      frame = 0;
      if (!canDraw()) { lastTime = 0; return; }
      const { analyser: currentAnalyser, bands: currentBands, paused: currentPaused, state: currentState } = settings.current;
      const still = currentPaused || motion.matches;
      const elapsed = lastTime ? now - lastTime : 16;
      const delta = Math.min(elapsed, 50) / 1000;
      lastTime = now;
      if (!still) time += delta;
      const target = states[currentState];
      for (let i = 0; i < 4; i++) {
        const next = i === target ? 1 : 0;
        weights[i] = still ? next : (weights[i] ?? 0) + (next - (weights[i] ?? 0)) * (1 - Math.exp(-delta * 7));
      }
      if (!still && elapsed > 32) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 30 && density > 1500) { density = Math.max(1500, Math.floor(density / 2)); slowFrames = 0; }
      let input = currentBands ?? {};
      // Reading an analyser never connects, disconnects, resumes, or closes caller-owned audio.
      if (currentAnalyser && !still) {
        try { input = readBands(currentAnalyser); } catch { input = {}; }
      }
      for (const key of ["low", "mid", "high"] as const) {
        const value = bounded(input[key] ?? 0, 0, 1, 0);
        if (!currentAnalyser || !still) {
          const speed = value > envelope[key] ? 18 : 5;
          envelope[key] = still ? value : envelope[key] + (value - envelope[key]) * (1 - Math.exp(-delta * speed));
        }
      }
      activeRenderer.draw(time, envelope, weights, density, getComputedStyle(element).color);
      if (!still) frame = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (canDraw()) frame = requestAnimationFrame(draw);
    };
    requestDraw.current = schedule;
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resize?.observe(element);
    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      schedule();
    });
    intersection?.observe(element);
    // Theme changes must also repaint paused and reduced-motion instances.
    const theme = new MutationObserver(schedule);
    for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
      theme.observe(ancestor, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setReady(false);
      schedule();
    };
    const onRestored = () => setRevision(value => value + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    contrast.addEventListener("change", schedule);
    setReady(true);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      requestDraw.current = null;
      resize?.disconnect();
      intersection?.disconnect();
      theme.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      contrast.removeEventListener("change", schedule);
      activeRenderer.dispose();
    };
  }, [count, revision]);

  return (
    <div
      {...props}
      className={["relative isolate inline-grid aspect-square min-w-0 max-w-full shrink-0 place-items-center", sizes[size], paused ? "" : "motion-safe:transition-colors motion-safe:duration-700", className].join(" ")}
      data-slot="root"
      data-state={state}
      data-paused={paused || undefined}
      data-renderer={ready ? "webgl" : "fallback"}
      ref={rootRef}
      style={{ color: color ?? colors[state], ...style }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-[18%] rounded-full opacity-10 blur-2xl forced-colors:hidden" data-slot="glow" style={{ background: "currentColor" }} />
      <canvas aria-hidden="true" className="absolute inset-0 size-full forced-colors:hidden" data-slot="canvas" ref={canvasRef} tabIndex={-1} style={{ visibility: ready ? "visible" : "hidden" }} />
      <svg aria-hidden="true" className={["absolute inset-0 size-full forced-colors:block", ready ? "hidden" : "block"].join(" ")} data-slot="fallback" fill="none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="32" stroke="currentColor" strokeOpacity="0.65" />
        {[0, 60, 120].map(angle => <ellipse cx="50" cy="50" key={angle} rx="32" ry={state === "thinking" ? "9" : "15"} stroke="currentColor" strokeOpacity="0.45" transform={\`rotate(\${angle} 50 50)\`} />)}
        <circle cx="50" cy="50" fill="currentColor" fillOpacity="0.05" r="32" />
      </svg>
      <span aria-atomic="true" className="sr-only" data-slot="label" role="status">{label ?? labels[state]}</span>
    </div>
  );
}
`;
