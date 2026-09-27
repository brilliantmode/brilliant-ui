export function OrbCredit({ component }: { component: "signal-orb" | "voice-orb" }) {
  return (
    <div className="space-y-2 border-t border-border pt-4">
      <h3 className="text-sm font-semibold">Credits</h3>
      <p className="text-sm leading-6 text-muted-foreground">
        Original visual concept by{" "}
        <a
          className="underline underline-offset-4 hover:text-foreground"
          href="https://github.com/aqualang89"
          rel="noreferrer"
          target="_blank"
        >
          Ship Notes / aqualang89
        </a>
        .{" "}
        {component === "voice-orb" ? (
          <>
            The renderer, particle sampling, audio response, and demo samples are adapted from the
            creator’s MIT-licensed code. Brilliant UI adds React integration, theme overrides,
            motion controls, and accessible status. The original copyright and license are retained.
          </>
        ) : (
          <>Brilliant UI’s React and WebGL implementation is independently written.</>
        )}{" "}
        Explore the{" "}
        <a
          className="underline underline-offset-4 hover:text-foreground"
          href={`https://aqualang89.github.io/shipnotes-components/components/${component}/demo.html`}
          rel="noreferrer"
          target="_blank"
        >
          original {component === "signal-orb" ? "Signal Orb" : "Voice Orb"} demo
        </a>{" "}
        and the creator’s{" "}
        <a
          className="underline underline-offset-4 hover:text-foreground"
          href={`https://github.com/aqualang89/shipnotes-components/tree/main/components/${component}`}
          rel="noreferrer"
          target="_blank"
        >
          source project
        </a>
        .
      </p>
    </div>
  );
}
