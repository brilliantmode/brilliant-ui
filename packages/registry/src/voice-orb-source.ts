export const voiceOrbSource = `"use client";

/*!
 * Rendering, sphere sampling, and audio response adapted from Voice Orb by Ship Notes / aqualang89.
 * https://github.com/aqualang89/shipnotes-components/tree/main/components/voice-orb
 * React lifecycle, controls, theming, and accessibility integration by Brilliant UI.
 * Upstream source SHA-256: d67debe170f0b41a1cfdd8bda43c47f8ef7427506d7611cb30c5ba6c5374fd65
 *
 * MIT License
 *
 * Copyright (c) 2026 Ship Notes
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { type HTMLAttributes, useEffect, useRef, useState } from "react";

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
  /** Maximum particle count, clamped to 300–20,000. */
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
  idle: "var(--brilliant-voice-idle, rgb(158 153 222))",
  listening: "var(--brilliant-voice-listening, rgb(41 232 181))",
  thinking: "var(--brilliant-voice-thinking, rgb(255 145 46))",
  speaking: "var(--brilliant-voice-speaking, rgb(245 69 158))",
};
const palette = [
  ["idle", "rgb(107.1 124.95 196.35)", "rgb(204 175.95 249.9)"],
  ["listening", "rgb(17.85 137.7 173.4)", "rgb(109.65 255 170.85)"],
  ["thinking", "rgb(181.05 63.75 15.3)", "rgb(255 201.45 96.9)"],
  ["speaking", "rgb(91.8 56.1 255)", "rgb(255 114.75 160.65)"],
] as const;

const vertexSource = \`
  precision highp float;
  attribute vec4 aSeed;
  uniform float uTime, uPixels, uDensity, uOnset;
  uniform vec2 uAspect;
  uniform vec3 uLow0, uHigh0, uLow1, uHigh1, uLow2, uHigh2, uLow3, uHigh3;
  uniform vec4 uWeights;
  uniform vec3 uBands;
  varying vec3 tint;
  varying float strength, spark;
  float hash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
  float noise(vec3 p) {
    vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    float a=mix(hash(i),hash(i+vec3(1,0,0)),f.x);
    float b=mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x);
    float c=mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x);
    float d=mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x);
    return mix(mix(a,b,f.y),mix(c,d,f.y),f.z)*2.0-1.0;
  }
  vec3 turn(vec3 p,float a) { float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,c*p.z-s*p.x); }
  void main() {
    float t=uTime;
    vec3 n=aSeed.xyz;
    float angle=acos(clamp(n.z,-1.0,1.0));
    float drift=noise(n*2.7+vec3(t*.19,-t*.11,t*.08));
    float bass=noise(n*1.8+vec3(t*.32,0,-t*.2));
    float grain=noise(n*17.0+vec3(-t*1.8,t*.7,t));
    float low=uBands.x, mid=uBands.y, high=uBands.z;
    float idleR=1.0+.018*drift+.008*sin(t*.85);
    float inward=sin(angle*13.0+t*5.4+drift*1.6);
    float outward=sin(angle*12.0-t*6.2+drift*1.6);
    float listenR=1.0-.045*low+.10*low*bass+(.018+.12*mid)*inward+.032*high*grain;
    float speakR=1.0+.065*low+.16*low*bass+(.018+.16*mid)*outward+.055*high*grain;
    // The transient is supplied separately from sustained bass. No frame history in this shader.
    speakR+=uOnset*(.08+.18*max(0.0,outward))*(.4+.6*aSeed.w);
    float twist=t*.55+n.y*1.45+drift*.12;
    vec3 thought=turn(n,twist)*(1.0+.035*drift);
    thought.y*=.92;
    vec3 pos=turn(n,t*.11)*idleR*uWeights.x;
    pos+=turn(n,t*.16)*listenR*uWeights.y;
    pos+=thought*uWeights.z;
    pos+=turn(n,t*.20)*speakR*uWeights.w;
    float active=uWeights.y+uWeights.w;
    float rim=pow(max(0.0,1.0-abs(n.z)),2.2);
    float pop=pow(max(0.0,sin(t*8.0+aSeed.w*149.0)),18.0)*step(.90,aSeed.w);
    pos*=1.0+active*high*pop*.17;
    // Three narrow belts stay on the sphere, with bright heads moving along them.
    vec3 q=turn(n,t*.33);
    float b1=exp(-pow((dot(q,normalize(vec3(.24,.83,.50)))-.13)*23.0,2.0));
    float b2=exp(-pow((dot(q,normalize(vec3(-.71,.48,.39)))+.16)*23.0,2.0));
    float b3=exp(-pow((dot(q,normalize(vec3(.69,.58,-.41)))-.06)*23.0,2.0));
    float belts=min(1.5,b1+b2+b3)*(.6+.4*sin(atan(n.y,n.x)*2.0-t*2.3));
    float flow=pow(.5+.5*sin(angle*13.0+(uWeights.y-uWeights.w)*t*5.8+drift*2.0),7.0);
    float depth=clamp((pos.z+1.35)/2.7,0.0,1.0);
    float perspective=3.8/(3.8-pos.z*.60);
    gl_Position=vec4(pos.xy*perspective*.61*uAspect,0,1);
    float point=(2.0+1.8*depth+.85*rim)*uDensity;
    point+=active*high*pop*1.8;
    gl_PointSize=max(1.8,point*uPixels/720.0);
    float cool=.5+.5*sin(n.y*2.1+n.x*1.6+drift*.65);
    vec3 ci=mix(uLow0,uHigh0,cool);
    vec3 cl=mix(uLow1,uHigh1,cool);
    vec3 ct=mix(uLow2,uHigh2,cool);
    vec3 cs=mix(uLow3,uHigh3,cool);
    tint=ci*uWeights.x+cl*uWeights.y+ct*uWeights.z+cs*uWeights.w;
    strength=(.22+.45*depth+.70*rim)*(.65+.35*aSeed.w);
    strength+=active*(mid*flow*.95+uOnset*rim*.9)+uWeights.z*belts*2.0;
    strength*=mix(1.0,.78,uWeights.z);
    spark=active*(high*pop*.8+uOnset*rim*.22)+uWeights.z*belts*.13;
  }\`;

const fragmentSource = \`
  precision mediump float;
  varying vec3 tint;
  varying float strength, spark;
  void main() {
    float r=length(gl_PointCoord-.5)*2.0;
    if(r>1.0)discard;
    float core=1.0-smoothstep(.18,.64,r);
    float halo=exp(-r*r*4.0)*.24*(1.0-smoothstep(.75,1.0,r));
    float a=(core+halo)*strength;
    vec3 color=tint*a+vec3(1.0,.92,.86)*spark*core;
    gl_FragColor=vec4(color,min(1.0,a+spark*core));
  }\`;

function bounded(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function createRenderer(canvas: HTMLCanvasElement, halo: HTMLCanvasElement, count: number) {
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
  const sphere = (amount: number) => {
    const seeds = new Float32Array(amount * 4);
    const jitter = 0.55 / Math.sqrt(amount);
    const seeded = (i: number) => { const n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
    for (let i = 0; i < amount; i++) {
      const y = bounded(1 - 2 * (i + 0.5) / amount + (seeded(i + 7) - 0.5) * jitter, -0.99999, 0.99999, 0);
      const angle = i * 2.399963229728653 + (seeded(i + 19) - 0.5) * jitter * 5;
      const radius = Math.sqrt(1 - y * y);
      seeds.set([radius * Math.cos(angle), y, radius * Math.sin(angle), seeded(i + 31)], i * 4);
    }
    return seeds;
  };
  let allocated = count;
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL useProgram is not a React hook.
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere(count), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "aSeed");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 4, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  // The shader emits premultiplied light; additive blending preserves the luminous filaments.
  gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
  gl.clearColor(0, 0, 0, 0);
  const uniforms = Object.fromEntries(
    ["uTime", "uBands", "uPixels", "uDensity", "uOnset", "uAspect", "uWeights", "uLow0", "uHigh0", "uLow1", "uHigh1", "uLow2", "uHigh2", "uLow3", "uHigh3"].map(name => [name, gl.getUniformLocation(program, name)]),
  );
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });
  const previousColors = new Map<string, string>();
  const glowColors = [[158, 153, 222], [41, 232, 181], [255, 145, 46], [245, 69, 158]];
  const haloContext = halo.getContext("2d");
  return {
    dispose,
    draw(time: number, bands: VoiceOrbBands, onset: number, weights: Float32Array, particleCount: number, paletteElements: HTMLElement[]) {
      if (gl.isContextLost()) return;
      for (const [i, element] of paletteElements.entries()) {
        const computed = getComputedStyle(element);
        if (context && previousColors.get(\`glow\${i}\`) !== computed.borderTopColor) {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = computed.borderTopColor;
          context.fillRect(0, 0, 1, 1);
          glowColors[i] = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
          previousColors.set(\`glow\${i}\`, computed.borderTopColor);
        }
        for (const [name, cssColor] of [[\`uLow\${i}\`, computed.color], [\`uHigh\${i}\`, computed.backgroundColor]]) {
          if (!name || !cssColor || previousColors.get(name) === cssColor) continue;
          if (context) {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = cssColor;
            context.fillRect(0, 0, 1, 1);
            const pixel = context.getImageData(0, 0, 1, 1).data;
            gl.uniform3f(uniforms[name] ?? null, (pixel[0] ?? 0) / 255, (pixel[1] ?? 0) / 255, (pixel[2] ?? 0) / 255);
          } else {
            gl.uniform3f(uniforms[name] ?? null, 0.62, 0.60, 0.87);
          }
          previousColors.set(name, cssColor);
        }
      }
      if (particleCount !== allocated) {
        // Rebuild the whole sphere: a prefix of a Fibonacci sphere only covers one hemisphere.
        gl.bufferData(gl.ARRAY_BUFFER, sphere(particleCount), gl.STATIC_DRAW);
        allocated = particleCount;
      }
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(width * dpr));
      const h = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      if (halo.width !== w || halo.height !== h) { halo.width = w; halo.height = h; }
      if (haloContext) {
        const centerX = w / 2, centerY = h / 2, extent = Math.min(w, h);
        const rgb = [0, 1, 2].map(channel => Math.round(glowColors.reduce((sum, rgb, i) => sum + (rgb[channel] ?? 0) * (weights[i] ?? 0), 0)));
        const energy = ((weights[1] ?? 0) + (weights[3] ?? 0)) * (bands.low * 0.025 + onset * 0.035);
        haloContext.clearRect(0, 0, w, h);
        const glow = haloContext.createRadialGradient(centerX, centerY, extent * 0.10, centerX, centerY, extent * 0.48);
        glow.addColorStop(0, \`rgba(\${rgb},0.012)\`);
        glow.addColorStop(0.58, \`rgba(\${rgb},\${0.028 + energy})\`);
        glow.addColorStop(1, \`rgba(\${rgb},0)\`);
        haloContext.fillStyle = glow;
        haloContext.fillRect(0, 0, w, h);
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uniforms.uAspect ?? null, Math.min(1, h / w), Math.min(1, w / h));
      gl.uniform1f(uniforms.uTime ?? null, time);
      gl.uniform3f(uniforms.uBands ?? null, bands.low, bands.mid, bands.high);
      gl.uniform1f(uniforms.uPixels ?? null, Math.min(w, h));
      gl.uniform1f(uniforms.uDensity ?? null, Math.pow(12000 / particleCount, 0.32));
      gl.uniform1f(uniforms.uOnset ?? null, onset);
      gl.uniform4fv(uniforms.uWeights ?? null, weights);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    },
  };
}

export function VoiceOrb({
  analyser = null, bands, className = "", color, label, particleCount = 12000,
  paused = false, size = "md", state = "idle", style, ...props
}: VoiceOrbProps) {
  const override = style?.color ?? color;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const haloRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const requestDraw = useRef<(() => void) | null>(null);
  const settings = useRef({ analyser, bands, paused, state });
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const count = Math.round(bounded(particleCount, 300, 20000, 12000));

  useEffect(() => {
    settings.current = { analyser, bands, paused, state };
    requestDraw.current?.();
  }, [analyser, bands, paused, state]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Context restoration must rebuild every GPU resource.
  useEffect(() => {
    const canvas = canvasRef.current;
    const halo = haloRef.current;
    const element = rootRef.current;
    if (!canvas || !halo || !element) return;
    setReady(false);
    let renderer: ReturnType<typeof createRenderer> = null;
    try { renderer = createRenderer(canvas, halo, count); } catch { return; }
    if (!renderer) return;
    const activeRenderer = renderer;
    const paletteElements = Array.from(element.querySelectorAll<HTMLElement>("[data-voice-palette]"));
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
    let frequencyData = new Float32Array(0);
    let onset = 0;
    let bassHistory = 0;
    const envelope: VoiceOrbBands = { low: 0, mid: 0, high: 0 };
    const readBands = (node: AnalyserNode): VoiceOrbBands => {
      if (frequencyData.length !== node.frequencyBinCount) frequencyData = new Float32Array(node.frequencyBinCount);
      node.getFloatFrequencyData(frequencyData);
      const step = node.context.sampleRate / node.fftSize;
      const powerBand = (from: number, to: number, gain: number) => {
        const first = Math.max(1, Math.ceil(from / step));
        const last = Math.min(frequencyData.length - 1, Math.floor(to / step));
        let power = 0;
        for (let i = first; i <= last; i++) {
          const db = frequencyData[i] ?? -Infinity;
          if (Number.isFinite(db)) power += 10 ** (db / 10);
        }
        // Sum linear power before compression so narrow notes retain their impact.
        return bounded((Math.sqrt(Math.sqrt(power)) * gain - 0.025) / 0.975, 0, 1, 0);
      };
      return { low: powerBand(45, 250, 2), mid: powerBand(250, 2400, 2.15), high: powerBand(2400, 12000, 2.5) };
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
        weights[i] = still ? next : (weights[i] ?? 0) + (next - (weights[i] ?? 0)) * (1 - Math.exp(-delta / 0.24));
      }
      if (!still && elapsed > 32) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 30 && density > 1500) { density = Math.max(1500, Math.floor(density / 2)); slowFrames = 0; }
      let input = currentBands ?? {};
      // Reading an analyser never connects, disconnects, resumes, or closes caller-owned audio.
      if (currentAnalyser && !still) {
        try { input = readBands(currentAnalyser); } catch { input = {}; }
      }
      if (!currentAnalyser || !still) {
        const low = bounded(input.low ?? 0, 0, 1, 0);
        const flux = Math.max(0, low - bassHistory - 0.04) * 6;
        bassHistory += (low - bassHistory) * (1 - Math.exp(-delta / 0.06));
        onset = still ? 0 : Math.max(Math.min(1, flux), onset * Math.exp(-delta / 0.18));
        const attack = { low: 0.012, mid: 0.028, high: 0.006 };
        const release = { low: 0.20, mid: 0.15, high: 0.085 };
        for (const key of ["low", "mid", "high"] as const) {
          const value = bounded(input[key] ?? 0, 0, 1, 0);
          const duration = value > envelope[key] ? attack[key] : release[key];
          envelope[key] = still ? value : envelope[key] + (value - envelope[key]) * (1 - Math.exp(-delta / duration));
        }
      }
      activeRenderer.draw(time, envelope, onset, weights, density, paletteElements);
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
      className={["relative isolate inline-grid aspect-square min-w-0 max-w-full shrink-0 place-items-center", sizes[size], className].join(" ")}
      data-slot="root"
      data-state={state}
      data-paused={paused || undefined}
      data-renderer={ready ? "webgl" : "fallback"}
      ref={rootRef}
      style={{ color: color ?? colors[state], ...style }}
    >
      {palette.map(([name, low, high]) => <span
        aria-hidden="true" className="pointer-events-none invisible absolute size-0" data-voice-palette={name} key={name}
        style={{ color: override ? \`color-mix(in srgb, \${override} 82%, black)\` : \`var(--brilliant-voice-\${name}-low, \${low})\`,
          borderTopColor: override ?? colors[name],
          backgroundColor: override ? \`color-mix(in srgb, \${override} 62%, white)\` : \`var(--brilliant-voice-\${name}-high, \${high})\` }}
      />)}
      <canvas aria-hidden="true" className="pointer-events-none absolute inset-0 size-full forced-colors:hidden" data-slot="glow" ref={haloRef} tabIndex={-1} style={{ visibility: ready ? "visible" : "hidden" }} />
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
