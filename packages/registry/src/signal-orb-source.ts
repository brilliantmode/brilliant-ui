export const signalOrbSource = `"use client";

// Independently implemented; original visual concept: Ship Notes / aqualang89.
// https://github.com/aqualang89
// https://aqualang89.github.io/shipnotes-components/components/signal-orb/demo.html

import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

export type SignalOrbState = "listening" | "thinking" | "searching" | "done";

export interface SignalOrbProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  state?: SignalOrbState;
  /** Normalized input intensity, clamped to 0–1. No microphone access is requested. */
  level?: number;
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
const states = { listening: 0, thinking: 1, searching: 2, done: 3 } as const;
const labels = {
  listening: "Assistant listening",
  thinking: "Assistant thinking",
  searching: "Assistant searching",
  done: "Assistant finished",
};
const colors = {
  listening: "var(--brilliant-chart-4, currentColor)",
  thinking: "var(--brilliant-primary, currentColor)",
  searching: "var(--brilliant-chart-2, currentColor)",
  done: "var(--brilliant-chart-3, currentColor)",
};

const vertexSource = \`
attribute vec3 aSeed;
uniform float uTime;
uniform float uLevel;
uniform float uSize;
uniform vec2 uAspect;
uniform vec4 uWeights;
varying float vAlpha;
varying float vEnergy;
const float TAU = 6.28318530718;

vec3 thoughtNode(float id, float time) {
  // A central thought and six independently moving clusters.
  if (id < 0.5) return vec3(sin(time * 0.7), cos(time * 0.9), sin(time * 0.6)) * 0.075;
  float phase = (id - 1.0) * TAU / 6.0 + time * 0.11;
  float reach = 0.43 + 0.065 * sin(time * 0.8 + id * 1.7);
  return vec3(cos(phase) * reach, sin(phase) * reach,
    sin(phase * 2.0 + time * 0.3) * 0.24)
    + vec3(sin(time * 1.1 + id), cos(time * 0.7 + id * 2.0), 0.0) * 0.045;
}

void main() {
  float t = uTime;
  float angle = aSeed.x * TAU;
  float y = aSeed.y * 2.0 - 1.0;
  float radius = sqrt(max(0.0, 1.0 - y * y));
  float turn = angle + t * 0.16;
  vec3 sphere = vec3(cos(turn) * radius, y, sin(turn) * radius);
  float ripple = sin(y * 9.0 + angle * 3.0 + t * 1.7);
  sphere *= 0.63 + 0.025 * ripple + sin(t * 2.4) * (0.012 + uLevel * 0.045);

  // Soft signals travel through a connected network with a quiet particle halo.
  // Clusters breathe gently instead of erupting into bright bursts.
  float drift = angle + t * (0.22 + aSeed.z * 0.3);
  vec3 cloud = vec3(cos(drift) * radius, y, sin(drift) * radius);
  cloud *= 0.53 + 0.025 * sin(angle * 4.0 + t * 1.3 + y * 5.0);
  vec3 thinking = cloud;
  float thoughtAlpha = 0.1;
  float energy = 0.0;
  float thoughtSize = 0.9;
  float scatter = pow(0.5 + 0.5 * sin(t * 0.65), 8.0);

  if (aSeed.z < 0.48) {
    float id = floor(aSeed.x * 7.0);
    float firing = pow(0.5 + 0.5 * sin(t * 1.8 - id * 1.9), 3.0);
    float localAngle = fract(aSeed.x * 7.0) * TAU + t * (0.6 + id * 0.12);
    float localY = aSeed.y * 2.0 - 1.0;
    float localRadius = sqrt(max(0.0, 1.0 - localY * localY));
    vec3 knot = vec3(cos(localAngle) * localRadius, localY, sin(localAngle) * localRadius);
    float spread = (0.06 + 0.065 * (1.0 - firing)) * (0.45 + aSeed.z);
    thinking = thoughtNode(id, t) + knot * spread;
    thinking = mix(thinking, cloud, scatter * 0.2);
    energy = firing * 0.42 * (1.0 - scatter * 0.5);
    thoughtAlpha = 0.42 + energy * 0.3;
    thoughtSize = 0.9 + energy * 0.25;
  } else if (aSeed.z < 0.82) {
    float edge = floor(aSeed.x * 18.0);
    float start = mod(edge, 7.0);
    float end = mod(start + 1.0 + floor(edge / 7.0), 7.0);
    vec3 from = thoughtNode(start, t);
    vec3 to = thoughtNode(end, t);
    float travel = fract(aSeed.y + t * (0.14 + fract(edge * 0.31) * 0.07));
    float bend = sin(travel * 3.14159265);
    vec3 arc = vec3(sin(edge * 2.1 + t * 0.5), cos(edge * 1.3 + t * 0.4), sin(edge)) * 0.1;
    vec3 filament = vec3(cos(angle * 13.0 + t), sin(angle * 17.0 - t), 0.0) * 0.009;
    thinking = mix(from, to, travel) + arc * bend + filament;
    thinking = mix(thinking, cloud, scatter * 0.12);
    float head = fract(t * 0.34 - edge * 0.137);
    float trail = fract(head - travel + 1.0);
    energy = exp(-trail * 12.0) * 0.4 * (1.0 - scatter * 0.6);
    thoughtAlpha = 0.3 + energy * 0.5;
    thoughtSize = 0.9 + energy * 0.5;
  }
  thinking.xz = mat2(cos(t * 0.13), -sin(t * 0.13), sin(t * 0.13), cos(t * 0.13)) * thinking.xz;
  thinking.yz = mat2(0.94, -0.342, 0.342, 0.94) * thinking.yz;

  float orbit = angle + t * (0.5 + floor(aSeed.z * 3.0) * 0.12);
  float ring = floor(aSeed.z * 3.0) * 1.0472 + 0.3;
  float width = (aSeed.y - 0.5) * 0.075;
  vec3 searching = vec3(cos(orbit) * (0.66 + width), sin(orbit) * (0.66 + width), width);
  searching.yz = mat2(cos(ring), -sin(ring), sin(ring), cos(ring)) * searching.yz;
  searching.xy = mat2(0.94, -0.342, 0.342, 0.94) * searching.xy;

  // Decorrelated samples fill the strokes instead of forming diagonal dotted bands.
  float doneAlong = fract(sin(dot(aSeed.xy, vec2(127.1, 311.7))) * 43758.5453);
  float doneAcross = fract(sin(dot(aSeed.yz, vec2(269.5, 183.3))) * 43758.5453);
  float strokeCore = 1.0 - abs(doneAcross * 2.0 - 1.0);
  vec3 done;
  float doneEnergy;
  float doneAlpha;
  if (aSeed.z < 0.64) {
    float ringAngle = doneAlong * TAU;
    done = vec3(cos(ringAngle), sin(ringAngle), 0.0) * (0.58 + (doneAcross - 0.5) * 0.076);
    doneEnergy = 0.08 + strokeCore * 0.22;
    doneAlpha = 0.62 + strokeCore * 0.25;
  } else {
    float p = doneAlong;
    vec2 check = p < 0.36
      ? mix(vec2(-0.28, 0.0), vec2(-0.08, -0.20), p / 0.36)
      : mix(vec2(-0.08, -0.20), vec2(0.30, 0.23), (p - 0.36) / 0.64);
    vec2 direction = p < 0.36 ? normalize(vec2(0.20, -0.20)) : normalize(vec2(0.38, 0.43));
    vec2 normal = vec2(-direction.y, direction.x);
    done = vec3(check + normal * (doneAcross - 0.5) * 0.068, 0.1);
    doneEnergy = 0.55 + strokeCore * 0.4;
    doneAlpha = 0.88 + strokeCore * 0.12;
  }

  vec3 position = sphere * uWeights.x + thinking * uWeights.y
    + searching * uWeights.z + done * uWeights.w;
  float depth = (position.z + 1.0) * 0.5;
  gl_Position = vec4(position.xy * uAspect, 0.0, 1.0);
  gl_PointSize = uSize * (0.65 + aSeed.z * 0.55 + depth * 0.3)
    * mix(1.0, thoughtSize, uWeights.y) * mix(1.0, 1.35, uWeights.w);
  float baseAlpha = (0.22 + depth * 0.48) * (0.65 + aSeed.z * 0.35);
  vAlpha = mix(baseAlpha, thoughtAlpha * (0.65 + depth * 0.35), uWeights.y);
  vAlpha = mix(vAlpha, doneAlpha, uWeights.w);
  // Resolve the particles into the continuous completion mark; no grain remains at rest.
  vAlpha *= 1.0 - smoothstep(0.65, 0.995, uWeights.w);
  vEnergy = energy * uWeights.y + doneEnergy * uWeights.w;
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
  gl_FragColor = vec4(mix(uColor, vec3(1.0), vEnergy * 0.5), alpha);
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
    ["uTime", "uLevel", "uSize", "uAspect", "uWeights", "uColor"].map(name => [name, gl.getUniformLocation(program, name)]),
  );
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });
  let previousColor = "";
  return {
    dispose,
    draw(time: number, level: number, weights: Float32Array, particleCount: number, cssColor: string) {
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
      gl.uniform1f(uniforms.uLevel ?? null, level);
      gl.uniform1f(uniforms.uSize ?? null, dpr * Math.max(1.3, Math.min(width, height) / 200));
      gl.uniform4fv(uniforms.uWeights ?? null, weights);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    },
  };
}

export function SignalOrb({
  className = "", color, label, level = 0.5, particleCount = 6000,
  paused = false, size = "md", state = "listening", style, ...props
}: SignalOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const requestDraw = useRef<(() => void) | null>(null);
  const settings = useRef({ level, paused, state });
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const count = Math.round(bounded(particleCount, 300, 12000, 6000));

  useEffect(() => {
    settings.current = { level: bounded(level, 0, 1, 0.5), paused, state };
    requestDraw.current?.();
  }, [level, paused, state]);

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
    const canDraw = () => !disposed && !lost && visible && !document.hidden && !contrast.matches;
    const draw = (now: number) => {
      frame = 0;
      if (!canDraw()) { lastTime = 0; return; }
      const { level: currentLevel, paused: currentPaused, state: currentState } = settings.current;
      const still = currentPaused || motion.matches;
      const elapsed = lastTime ? now - lastTime : 16;
      const delta = Math.min(elapsed, 50) / 1000;
      lastTime = now;
      if (!still) time += delta;
      const target = states[currentState];
      let settling = false;
      for (let i = 0; i < 4; i++) {
        const next = i === target ? 1 : 0;
        weights[i] = still ? next : (weights[i] ?? 0) + (next - (weights[i] ?? 0)) * (1 - Math.exp(-delta * 7));
        settling ||= Math.abs((weights[i] ?? 0) - next) > 0.001;
      }
      if (!still && elapsed > 32) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 30 && density > 1500) { density = Math.max(1500, Math.floor(density / 2)); slowFrames = 0; }
      activeRenderer.draw(time, currentLevel, weights, density, getComputedStyle(element).color);
      if (!still && (currentState !== "done" || settling)) frame = requestAnimationFrame(draw);
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
    theme.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "style", "data-theme"] });
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
      className={["relative isolate inline-grid aspect-square min-w-0 max-w-full shrink-0 place-items-center", sizes[size], className].join(" ")}
      data-slot="root"
      data-state={state}
      data-paused={paused || undefined}
      data-renderer={ready ? "webgl" : "fallback"}
      ref={rootRef}
      style={{ color: color ?? colors[state], ...style }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-[18%] rounded-full opacity-10 blur-2xl forced-colors:hidden" data-slot="glow" style={{ background: "currentColor" }} />
      <svg
        aria-hidden="true"
        className={["pointer-events-none absolute inset-0 size-full forced-colors:hidden", ready && state === "done" ? "opacity-100" : "opacity-0", paused ? "" : "motion-safe:transition-opacity motion-safe:duration-700", state === "done" && !paused ? "motion-safe:delay-150" : ""].join(" ")}
        data-slot="completion"
        fill="none"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="29" stroke="currentColor" strokeWidth="3.8" />
        <path d="M36 50 46 60 65 38.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" style={{ stroke: "color-mix(in oklch, currentColor 76%, white)" }} />
      </svg>
      <canvas aria-hidden="true" className="absolute inset-0 size-full forced-colors:hidden" data-slot="canvas" ref={canvasRef} tabIndex={-1} style={{ visibility: ready ? "visible" : "hidden" }} />
      <svg aria-hidden="true" className={["absolute inset-0 size-full forced-colors:block", ready ? "hidden" : "block"].join(" ")} data-slot="fallback" fill="none" viewBox="0 0 100 100">
        {state === "done" ? <><circle cx="50" cy="50" r="29" stroke="currentColor" strokeWidth="3.8" /><path d="M36 50 46 60 65 38.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" /></> : state === "thinking" ? <>
          <circle cx="50" cy="50" r="31" stroke="currentColor" strokeDasharray="1 3" strokeOpacity="0.35" />
          <path d="M50 50 29 37 52 26 73 40 68 64 42 73 29 37M50 50 52 26M50 50 73 40M50 50 68 64M50 50 42 73" stroke="currentColor" strokeOpacity="0.4" />
          {[[50, 50], [29, 37], [52, 26], [73, 40], [68, 64], [42, 73]].map(([x, y]) => <circle cx={x} cy={y} fill="currentColor" key={x} r={x === 50 ? "3" : "2"} />)}
        </> : <>
          <circle cx="50" cy="50" r="31" stroke="currentColor" strokeOpacity="0.5" />
          {[0, 60, 120].map(angle => <ellipse cx="50" cy="50" key={angle} rx="31" ry="12" stroke="currentColor" strokeOpacity="0.65" transform={\`rotate(\${angle} 50 50)\`} />)}
          <circle cx="50" cy="50" fill="currentColor" fillOpacity="0.05" r="31" />
        </>}
      </svg>
      <span aria-atomic="true" className="sr-only" data-slot="label" role="status">{label ?? labels[state]}</span>
    </div>
  );
}
`;
