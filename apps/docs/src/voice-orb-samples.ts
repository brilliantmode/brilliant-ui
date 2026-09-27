/*!
 * Audio samples adapted from Ship Notes / aqualang89 (MIT).
 * https://github.com/aqualang89/shipnotes-components/blob/main/components/voice-orb/demo.html
 * MIT License

Copyright (c) 2026 Ship Notes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function noise(i: number) {
  let n = (i + 1) * 374761393;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 2147483648 - 1;
}
export function makeVoiceSample(ctx: AudioContext, kind: "sample" | "beat") {
  const seconds = kind === "beat" ? 8 : 6,
    sr = ctx.sampleRate,
    buffer = ctx.createBuffer(1, Math.ceil(sr * seconds), sr),
    out = buffer.getChannelData(0);
  if (kind === "beat") {
    const beat = 60 / 112;
    for (let i = 0; i < out.length; i++) {
      const t = i / sr,
        bar = t / (beat * 4),
        gap = t > 3.55 && t < 4.28;
      if (gap) continue;
      const local = t % beat,
        hat = t % (beat * 0.5),
        step = Math.floor(t / beat),
        note = [55, 55, 65.406, 49][Math.floor(bar) % 4] ?? 55;
      const kick =
        0.59 *
        Math.exp(-local * 20) *
        Math.sin(2 * Math.PI * (48 * local + (95 * (1 - Math.exp(-local * 38))) / 38));
      const bass =
        0.14 *
        Math.sin(2 * Math.PI * note * t) *
        Math.min(1, local / 0.012) *
        Math.exp(-local * 3.8);
      const hatSound = 0.047 * noise(i) * Math.exp(-hat * 95) * (step % 2 ? 0.7 : 1);
      const snare = step % 2 ? 0.095 * noise(i + 271) * Math.exp(-local * 29) : 0;
      const fade = Math.min(1, t / 0.008, (seconds - t) / 0.08);
      out[i] = (kick + bass + hatSound + snare) * Math.max(0, fade);
    }
  } else {
    const starts = [0.25, 0.78, 1.21, 1.86, 2.3, 2.85, 3.62, 4.16, 4.67, 5.17],
      vowels = [
        [650, 1100, 2500],
        [350, 2100, 2900],
        [400, 850, 2300],
        [750, 1250, 2600],
      ];
    for (let j = 0; j < starts.length; j++) {
      const start = starts[j] ?? 0,
        duration = j % 3 === 0 ? 0.43 : 0.3,
        f0 = 126 + (j % 4) * 13,
        formants = vowels[j % vowels.length] ?? [];
      const amps: number[] = [];
      for (let k = 1; k <= 26; k++)
        amps[k] =
          0.14 / k +
          formants.reduce((a, f) => a + Math.exp(-0.5 * ((k * f0 - f) / 125) ** 2), 0) * 0.17;
      for (let i = Math.floor(start * sr); i < Math.min(out.length, (start + duration) * sr); i++) {
        const t = i / sr - start,
          u = t / duration,
          env = Math.sin(Math.PI * u) ** 1.4;
        let value = 0;
        for (let k = 1; k <= 26; k++)
          value += (amps[k] ?? 0) * Math.sin(2 * Math.PI * k * f0 * t + 0.1 * k * Math.sin(t * 14));
        out[i] = (out[i] ?? 0) + (value * 0.24 + noise(i + j * 79) * 0.007) * env;
      }
    }
  }
  return buffer;
}
