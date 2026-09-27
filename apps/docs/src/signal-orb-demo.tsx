import { SignalOrb, type SignalOrbState } from "@brilliantmode/ui/signal-orb";
import { useId, useState } from "react";
import { OrbCredit } from "./orb-credit";

const stateDetails = {
  listening: { title: "Listening", description: "Ready for your next thought." },
  thinking: { title: "Thinking", description: "Working through the details." },
  searching: { title: "Searching", description: "Looking for the right information." },
  done: { title: "Done", description: "Everything is in place." },
} as const;

export function SignalOrbPreview() {
  const [state, setState] = useState<SignalOrbState>("listening");
  const [level, setLevel] = useState(0.5);
  const [paused, setPaused] = useState(false);
  const levelId = useId();

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-lg grid-cols-1 gap-6">
      <div className="grid min-w-0 grid-cols-1 justify-items-center rounded-md bg-muted/25 px-3 pb-7">
        <SignalOrb
          label={`${stateDetails[state].title}. ${stateDetails[state].description}`}
          level={level}
          paused={paused}
          size="lg"
          state={state}
        />
        <p className="text-lg font-medium tracking-tight">{stateDetails[state].title}</p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {stateDetails[state].description}
        </p>
      </div>
      <fieldset
        aria-label="Assistant state"
        className="grid grid-cols-2 gap-1 rounded-md border border-border bg-muted/50 p-1 sm:grid-cols-4"
      >
        {(Object.keys(stateDetails) as SignalOrbState[]).map((value) => (
          <button
            aria-pressed={value === state}
            className="min-h-10 cursor-pointer appearance-none rounded-sm px-2 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98] aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-[background-color,color,transform] motion-reduce:transform-none"
            key={value}
            onClick={() => setState(value)}
            type="button"
          >
            {stateDetails[value].title}
          </button>
        ))}
      </fieldset>
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <label className="flex items-center gap-3" htmlFor={levelId}>
          Pulse level
          <input
            className="w-24 accent-primary focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
            disabled={state !== "listening"}
            id={levelId}
            max="1"
            min="0"
            onChange={(event) => setLevel(Number(event.target.value))}
            step="0.01"
            type="range"
            value={level}
          />
          <output className="w-7 font-mono tabular-nums" htmlFor={levelId}>
            {Math.round(level * 100)}%
          </output>
        </label>
        <button
          className="min-h-9 min-w-32 cursor-pointer rounded-sm border border-border px-3 hover:bg-muted active:scale-[0.98] data-[paused=true]:border-primary/30 data-[paused=true]:bg-primary/10 data-[paused=true]:text-primary focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transform-none"
          data-paused={paused}
          onClick={() => setPaused((value) => !value)}
          type="button"
        >
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
    </div>
  );
}

export function SignalOrbDocumentation() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">States and controls</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Listening gently pulses a particle sphere. Thinking gathers particles into shifting
          clusters, sends soft signals between them, then gently loosens and reconnects. Searching
          separates particles into orbital rings. Done resolves into an opaque ring and a bright
          checkmark; particles fade away completely, leaving a smooth, solid mark. State changes
          blend from the current shape, including rapid interruptions. Connect these states to your
          assistant’s actual activity.
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
                ["state", "listening", "listening · thinking · searching · done"],
                ["level", "0.5", "Listening pulse intensity, clamped to 0–1."],
                ["size", "md", "sm: 128px · md: 240px · lg: 360px. Shrinks to fit its container."],
                ["color", "State palette", "CSS color or token. style.color takes precedence."],
                ["label", "Assistant + state", "Text announced politely by the status region."],
                ["paused", "false", "Keeps a still frame; state changes remain immediate."],
                ["particleCount", "6000", "300–12,000. Density steps down when frames run slowly."],
              ].map(([prop, defaultValue, description]) => (
                <tr className="border-t border-border" key={prop}>
                  <td className="px-4 py-3 font-mono text-xs">{prop}</td>
                  <td className="px-4 py-3 text-xs">{defaultValue}</td>
                  <td className="px-4 py-3 text-muted-foreground">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Theme and integration</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          The palette follows Brilliant’s chart-4, primary, chart-2, and chart-3 tokens for
          listening, thinking, searching, and done. Set{" "}
          <code>color="var(--brilliant-primary)"</code> for one brand color across every state. Use{" "}
          <code>style</code> to set a custom width. The canvas has a transparent background for
          light and dark surfaces.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Rendering pauses outside the viewport and in hidden tabs. Reduced-motion preferences show
          static states. Keep a visible status message and offer a pause control for long sessions.
          The component does not capture audio or make AI requests; pass a normalized audio level
          from your application if needed.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          To install editable source: <code>npx brilliant-ui add signal-orb</code>.
        </p>
      </div>
      <OrbCredit component="signal-orb" />
    </div>
  );
}
