# Voice Orb visual comparison

Run the documentation dev server and open `/qa/voice-orb.html`.

The page renders the original Ship Notes component beside the Brilliant React adaptation,
with identical 570px square stages, 12,000 particles, a near-black backdrop, time fixed at
zero, matching states, and matching frequency-band values. Check every state at rest and
with **Voice energy**. This isolates rendering from the surrounding documentation layout.
The normal component demo covers live audio, transitions, pause/resume, and mobile sizing.

The original is a pinned, unmodified fixture (except the prepended MIT notice) from:
https://github.com/aqualang89/shipnotes-components/blob/main/components/voice-orb/voice-orb.js

Original SHA-256 before the notice: `d67debe170f0b41a1cfdd8bda43c47f8ef7427506d7611cb30c5ba6c5374fd65`.

This development-only HTML entry is not part of the production documentation build.
Keep it available when changing shaders, palette, blending, sizing, or particle density.
