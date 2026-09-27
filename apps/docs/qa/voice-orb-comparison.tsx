import { VoiceOrb, type VoiceOrbState } from "@brilliantmode/ui/voice-orb";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import "../src/styles.css";

function requiredElement(id: string) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing comparison element: ${id}`);
  return element;
}
const states = ["idle", "listening", "thinking", "speaking"] as const;
const original = document.getElementById("original") as HTMLElement & {
  renderAt(time: number, frame: { weights: number[]; bands: number[] }): void;
};
function Comparison() {
  const [state, setState] = useState<VoiceOrbState>("idle");
  const [bands, setBands] = useState([0, 0, 0]);
  useLayoutEffect(() => {
    original.setAttribute("state", state);
    original.renderAt(0, { weights: states.map((s) => Number(s === state)), bands });
  }, [state, bands]);
  return (
    <>
      {createPortal(
        <>
          {states.map((s) => (
            <button key={s} aria-pressed={s === state} onClick={() => setState(s)} type="button">
              {s}
            </button>
          ))}
          <button onClick={() => setBands([0, 0, 0])} type="button">
            Quiet
          </button>
          <button onClick={() => setBands([0.65, 0.45, 0.22])} type="button">
            Voice energy
          </button>
        </>,
        requiredElement("controls"),
      )}
      <VoiceOrb
        state={state}
        bands={{ low: bands[0] ?? 0, mid: bands[1] ?? 0, high: bands[2] ?? 0 }}
        paused
        particleCount={12000}
        style={{ width: "100%" }}
      />
    </>
  );
}
createRoot(requiredElement("ours")).render(<Comparison />);
