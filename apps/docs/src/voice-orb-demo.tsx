import { VoiceOrb, type VoiceOrbState } from "@brilliantmode/ui/voice-orb";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrbCredit } from "./orb-credit";

const states = {
  idle: { title: "Idle", description: "Ready when you are." },
  listening: { title: "Listening", description: "Soft waves gather inward." },
  thinking: { title: "Thinking", description: "Folds turn and work through the surface." },
  speaking: { title: "Speaking", description: "Sound sends ripples outward." },
} as const;
const buttonClass =
  "min-h-9 cursor-pointer appearance-none rounded-sm border border-border px-3 text-xs hover:bg-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transform-none disabled:cursor-wait disabled:opacity-50";

type AudioSession = {
  context: AudioContext;
  stream?: MediaStream;
  timer?: ReturnType<typeof setTimeout>;
};
function disposeAudio(session: AudioSession | null) {
  if (!session) return;
  clearTimeout(session.timer);
  for (const track of session.stream?.getTracks() ?? []) track.stop();
  if (session.context.state !== "closed") void session.context.close().catch(() => {});
}

export function VoiceOrbPreview() {
  const [state, setState] = useState<VoiceOrbState>("idle");
  const [paused, setPaused] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [input, setInput] = useState<"none" | "starting" | "sample" | "microphone">("none");
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

  const start = async (mode: "sample" | "microphone") => {
    stop();
    const id = request.current;
    setError("");
    setInput("starting");
    try {
      if (typeof AudioContext === "undefined")
        throw new Error("Web Audio is unavailable in this browser.");
      const context = new AudioContext();
      const active: AudioSession = { context };
      session.current = active;
      await context.resume();
      if (request.current !== id) return;
      const tap = context.createAnalyser();
      tap.fftSize = 2048;
      tap.smoothingTimeConstant = 0.35;
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
        // Never monitor microphone input through speakers.
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
        // A quiet, local eight-second phrase made from three synthesized frequency bands.
        const output = context.createGain();
        output.gain.value = 0.16;
        tap.connect(output);
        output.connect(context.destination);
        const startAt = context.currentTime + 0.05;
        for (const [index, frequency] of [140, 720, 3200].entries()) {
          const tone = context.createOscillator();
          const envelope = context.createGain();
          tone.type = "sine";
          tone.frequency.value = frequency;
          envelope.gain.setValueAtTime(0, startAt);
          for (let beat = 0; beat < 12; beat++) {
            const at = startAt + beat * 0.62 + index * 0.035;
            const amplitude =
              (index === 0 ? 0.5 : index === 1 ? 0.3 : 0.12) * (0.55 + (beat % 3) * 0.2);
            envelope.gain.setTargetAtTime(amplitude, at, 0.025);
            envelope.gain.setTargetAtTime(0, at + 0.2 + (beat % 2) * 0.08, 0.05);
            tone.frequency.setTargetAtTime(frequency * (1 + (beat % 3) * 0.14), at, 0.04);
          }
          tone.connect(envelope);
          envelope.connect(tap);
          tone.start(startAt);
          tone.stop(startAt + 8);
        }
        active.timer = setTimeout(() => {
          if (request.current === id) stop();
        }, 8300);
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
    <div className="mx-auto grid w-full min-w-0 max-w-lg grid-cols-1 gap-5">
      <div className="grid min-w-0 grid-cols-1 justify-items-center rounded-md bg-muted/25 px-3 pb-7">
        <VoiceOrb
          analyser={analyser}
          label={`${states[state].title}. ${input === "microphone" ? "Microphone active." : states[state].description}`}
          paused={paused}
          size="lg"
          state={state}
        />
        <p className="text-lg font-medium tracking-tight">{states[state].title}</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {states[state].description}
        </p>
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
              : input === "sample"
                ? "Playing a synthesized sample. Audio stays in this browser."
                : "Try a local sample, or enable your microphone. State buttons only preview the animation.")}
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
          Idle breathes gently. Listening gathers waves inward. Thinking turns interlocking folds
          across the surface. Speaking sends ripples outward. Low frequencies expand the sphere,
          mids bend its surface, and highs add fine detail. State transitions blend smoothly,
          including when interrupted.
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
                ["color", "State palette", "CSS color or token. style.color takes precedence."],
                ["label", "Voice assistant + state", "Custom accessible status text."],
                [
                  "paused",
                  "false",
                  "Freezes motion and analyser sampling. Does not stop audio playback or capture.",
                ],
                ["particleCount", "9000", "300–12,000; adapts downward on slower devices."],
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
          useful balance of detail and speed. The orb reads bands at 50–250 Hz, 250–2400 Hz, and
          2400–12,000 Hz with a quick attack and gentle release. These values are for animation, not
          calibrated loudness measurements.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-6">
          <code>{`// Inside an explicit microphone-start action:
const context = new AudioContext();
await context.resume();
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const analyser = context.createAnalyser();
analyser.fftSize = 2048;
const source = context.createMediaStreamSource(stream);
source.connect(analyser); // Do not connect microphone input to speakers.

// Render: <VoiceOrb state="listening" analyser={analyser} />

// When your session ends or the view unmounts:
source.disconnect();
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
          The palette follows primary, chart-3, chart-4, and chart-5 for idle, listening, thinking,
          and speaking. Override <code>color</code> with a brand token and <code>style</code> for a
          custom width. Rendering stops offscreen and in hidden tabs; reduced motion shows a static
          state. Keep a visible status message and provide a pause control. Audio lifecycle stays
          separate from visual motion.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          To install editable source: <code>npx brilliant-ui add voice-orb</code>.
        </p>
      </div>
      <OrbCredit component="voice-orb" />
    </div>
  );
}
