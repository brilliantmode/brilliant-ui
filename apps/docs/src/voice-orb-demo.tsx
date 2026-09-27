import { VoiceOrb, type VoiceOrbState } from "@brilliantmode/ui/voice-orb";
import { useCallback, useEffect, useRef, useState } from "react";
import voiceSampleUrl from "./assets/voice-orb-sample.mp3";
import { OrbCredit } from "./orb-credit";
import { makeVoiceBeat } from "./voice-orb-samples";

const states = {
  idle: { title: "Idle", description: "Ready when you are." },
  listening: { title: "Listening", description: "Soft waves gather inward." },
  thinking: { title: "Thinking", description: "Three illuminated bands follow a turning surface." },
  speaking: { title: "Speaking", description: "Sound sends ripples outward." },
} as const;
const buttonClass =
  "min-h-9 cursor-pointer appearance-none rounded-sm border border-border px-3 text-xs hover:bg-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none disabled:cursor-wait disabled:opacity-50";

type AudioSession = {
  context: AudioContext;
  abort: AbortController;
  stream?: MediaStream;
};
function disposeAudio(session: AudioSession | null) {
  if (!session) return;
  session.abort.abort();
  for (const track of session.stream?.getTracks() ?? []) track.stop();
  if (session.context.state !== "closed") void session.context.close().catch(() => {});
}

export function VoiceOrbPreview() {
  const [state, setState] = useState<VoiceOrbState>("idle");
  const [paused, setPaused] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [input, setInput] = useState<"none" | "starting" | "sample" | "beat" | "microphone">(
    "none",
  );
  const [error, setError] = useState("");
  const session = useRef<AudioSession | null>(null);
  const request = useRef(0);

  const stop = useCallback(() => {
    request.current++;
    disposeAudio(session.current);
    session.current = null;
    setAnalyser(null);
    setInput("none");
    setState("idle");
  }, []);

  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      request.current++;
      disposeAudio(session.current);
      session.current = null;
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [stop]);

  const start = async (mode: "sample" | "beat" | "microphone") => {
    stop();
    const id = request.current;
    setError("");
    setInput("starting");
    try {
      if (typeof AudioContext === "undefined")
        throw new Error("Web Audio is unavailable in this browser.");
      const context = new AudioContext();
      const active: AudioSession = { context, abort: new AbortController() };
      session.current = active;
      await context.resume();
      if (request.current !== id) return;
      const tap = context.createAnalyser();
      tap.fftSize = 2048;
      tap.smoothingTimeConstant = 0;
      tap.minDecibels = -85;
      tap.maxDecibels = -10;
      if (mode === "microphone") {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("Microphone access needs a supported browser and a secure connection.");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (request.current !== id) {
          for (const track of stream.getTracks()) track.stop();
          return;
        }
        active.stream = stream;
        context.createMediaStreamSource(stream).connect(tap);
        // A silent sink keeps analysis active without monitoring the microphone.
        const mute = context.createGain();
        mute.gain.value = 0;
        tap.connect(mute);
        mute.connect(context.destination);
        for (const track of stream.getTracks())
          track.addEventListener(
            "ended",
            () => {
              if (request.current === id) stop();
            },
            { once: true },
          );
        setState("listening");
      } else {
        const output = context.createGain();
        output.gain.value = 0.7;
        const source = context.createBufferSource();
        if (mode === "sample") {
          const response = await fetch(voiceSampleUrl, { signal: active.abort.signal });
          if (!response.ok) throw new Error("The voice sample could not load. Please try again.");
          const bytes = await response.arrayBuffer();
          if (request.current !== id) return;
          source.buffer = await context.decodeAudioData(bytes);
          if (request.current !== id) return;
        } else {
          source.buffer = makeVoiceBeat(context);
        }
        source.connect(tap);
        tap.connect(output);
        output.connect(context.destination);
        source.onended = () => {
          if (request.current === id) stop();
        };
        source.start();
        setState("speaking");
      }
      setAnalyser(tap);
      setInput(mode);
    } catch (cause) {
      if (request.current !== id) return;
      stop();
      setError(
        cause instanceof Error && cause.name === "NotAllowedError"
          ? "Microphone access was declined. You can still use the sample."
          : cause instanceof Error
            ? cause.message
            : "Audio could not start. Try the sample instead.",
      );
    }
  };

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-2xl grid-cols-1 gap-5">
      <div className="grid min-w-0 grid-cols-1 justify-items-center rounded-md bg-[var(--brilliant-voice-surface,#050507)] px-3 pb-7 text-[var(--brilliant-voice-foreground,#eeeaf6)]">
        <VoiceOrb
          analyser={analyser}
          label={`${states[state].title}. ${input === "microphone" ? "Microphone active." : states[state].description}`}
          paused={paused}
          size="lg"
          state={state}
          style={{ width: "100%", maxWidth: 570 }}
        />
        <p className="text-lg font-medium tracking-tight">{states[state].title}</p>
        <p className="mt-1 text-center text-sm opacity-60">{states[state].description}</p>
      </div>
      <fieldset
        aria-label="Voice state"
        className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/50 p-1 sm:grid-cols-4"
      >
        {(Object.keys(states) as VoiceOrbState[]).map((value) => (
          <button
            aria-pressed={value === state}
            className="min-h-10 cursor-pointer appearance-none rounded-sm px-2 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98] aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-[background-color,color,transform] motion-reduce:transform-none"
            key={value}
            onClick={() => {
              stop();
              setState(value);
            }}
            type="button"
          >
            {states[value].title}
          </button>
        ))}
      </fieldset>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          className={buttonClass}
          disabled={input === "starting"}
          onClick={() => (input === "sample" ? stop() : void start("sample"))}
          type="button"
        >
          {input === "sample" ? "Stop sample" : "Play sample"}
        </button>
        <button
          className={buttonClass}
          disabled={input === "starting"}
          onClick={() => (input === "beat" ? stop() : void start("beat"))}
          type="button"
        >
          {input === "beat" ? "Stop beat" : "Play beat"}
        </button>
        <button
          className={buttonClass}
          disabled={input === "starting"}
          onClick={() => (input === "microphone" ? stop() : void start("microphone"))}
          type="button"
        >
          {input === "microphone" ? "Stop microphone" : "Use microphone"}
        </button>
        {input === "starting" ? (
          <button className={buttonClass} onClick={stop} type="button">
            Cancel audio
          </button>
        ) : null}
        <button
          className={`${buttonClass} min-w-32 data-[paused=true]:border-primary/30 data-[paused=true]:bg-primary/10 data-[paused=true]:text-primary`}
          data-paused={paused}
          onClick={() => setPaused((value) => !value)}
          type="button"
        >
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
      <p className="text-center text-xs leading-5 text-muted-foreground" role="status">
        {error ||
          (input === "starting"
            ? "Starting audio…"
            : input === "microphone"
              ? "Microphone active. Nothing is recorded or sent."
              : input === "beat"
                ? "112 BPM. Bass, kick, and hats, with a break and drop. Audio stays in this browser."
                : input === "sample"
                  ? "Playing an AI-generated voice sample. Audio stays in this browser."
                  : "Try the voice sample, play a beat, or enable your microphone. State buttons only preview the animation.")}
        {paused && input !== "none" ? " Motion is paused; use Stop to end audio." : ""}
      </p>
    </div>
  );
}

export function VoiceOrbDocumentation() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">States and sound</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          The renderer preserves the original Ship Notes visual design: a fine particle surface with
          layered color and luminous edges. Idle breathes gently. Listening draws ripples inward.
          Thinking rotates three illuminated bands over a twisting sphere. Speaking pushes waves
          outward, with bass impacts and brief high-frequency highlights. State transitions blend
          smoothly, including when interrupted.
        </p>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Prop</th>
                <th className="px-4 py-3 font-medium">Default</th>
                <th className="px-4 py-3 font-medium">Behavior</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "state",
                  "idle",
                  "idle · listening · thinking · speaking. Controlled by your application.",
                ],
                [
                  "analyser",
                  "null",
                  "Reads frequency data from your AnalyserNode. Takes precedence over bands.",
                ],
                [
                  "bands",
                  "All zero",
                  "Object with low, mid, and high values, each clamped to 0–1. Missing values are zero.",
                ],
                ["size", "md", "sm: 128px · md: 240px · lg: 360px. Shrinks to fit."],
                [
                  "color",
                  "Original palette",
                  "Optional brand color or token. style.color takes precedence; light and dark tints retain surface depth.",
                ],
                ["label", "Voice assistant + state", "Custom accessible status text."],
                [
                  "paused",
                  "false",
                  "Freezes motion and analyser sampling. Does not stop audio playback or capture.",
                ],
                [
                  "particleCount",
                  "12000",
                  "300–20,000; adapts downward on slower devices while preserving full sphere coverage.",
                ],
              ].map(([prop, value, description]) => (
                <tr className="border-t border-border" key={prop}>
                  <td className="px-4 py-3 font-mono text-xs">{prop}</td>
                  <td className="px-4 py-3 text-xs">{value}</td>
                  <td className="px-4 py-3 text-muted-foreground">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Connect your audio</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Create an AudioContext in response to a user action, connect your input to an
          AnalyserNode, then pass that node to <code>analyser</code>. Use an FFT size of 2048 for a
          useful balance of detail and speed. The orb reads bands at 45–250 Hz, 250–2400 Hz, and
          2400–12,000 Hz with per-band attack/release smoothing and bass transient detection. These
          values are for animation, not calibrated loudness measurements.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-6">
          <code>{`// Inside an explicit microphone-start action:
const context = new AudioContext();
await context.resume();
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const analyser = context.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0;
const source = context.createMediaStreamSource(stream);
source.connect(analyser);
const silent = context.createGain();
silent.gain.value = 0; // Analyse without monitoring the microphone.
analyser.connect(silent);
silent.connect(context.destination);

// Render: <VoiceOrb state="listening" analyser={analyser} />

// When your session ends or the view unmounts:
source.disconnect();
analyser.disconnect();
silent.disconnect();
stream.getTracks().forEach(track => track.stop());
await context.close();`}</code>
        </pre>
        <p className="text-sm leading-6 text-muted-foreground">
          Your application owns permissions, playback, audio connections, and cleanup, including
          failed or cancelled starts. The component never opens a microphone, changes your graph,
          closes your AudioContext, or sends audio over the network. For an existing playback graph,
          connect an analysis tap to its source. With an HTML media element, reuse its existing
          MediaElementAudioSourceNode; do not create a second one for the same element.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Already receiving audio levels from an SDK? Pass{" "}
          <code>{"bands={{ low: 0.6, mid: 0.3, high: 0.1 }}"}</code> instead. Without audio input,
          each state keeps its quiet baseline motion. Choosing listening only changes the visual
          state.
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Theme and motion</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          The default palette preserves the original lilac, turquoise, amber, and pink/violet
          shading. Use <code>color</code> for a single brand color, or customize both ends of each
          state with <code>--brilliant-voice-idle-low</code> and{" "}
          <code>--brilliant-voice-idle-high</code> (likewise listening, thinking, and speaking). The
          transparent luminous canvas is intended for a dark surface; this preview uses{" "}
          <code>--brilliant-voice-surface</code>, defaulting to near-black, in both themes. Use{" "}
          <code>style</code> for a custom width. Rendering stops offscreen and in hidden tabs;
          reduced motion shows a static state. Keep a visible status message and provide a pause
          control. Audio lifecycle stays separate from visual motion.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          To install editable source: <code>npx brilliant-ui add voice-orb</code>.
        </p>
      </div>
      <OrbCredit component="voice-orb" />
      <p className="text-xs leading-6 text-muted-foreground">
        The spoken demo clip is AI-generated with{" "}
        <a
          className="underline underline-offset-4 hover:text-foreground"
          href="https://huggingface.co/hexgrad/Kokoro-82M"
          target="_blank"
          rel="noreferrer"
        >
          Kokoro
        </a>{" "}
        (Heart voice). It is bundled with the documentation and plays locally.
      </p>
    </div>
  );
}
