/*!
 * Beat sample adapted from Ship Notes / aqualang89 (MIT).
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
export function makeVoiceBeat(ctx: AudioContext) {
  const seconds = 8;
  const sr = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, Math.ceil(sr * seconds), sr);
  const out = buffer.getChannelData(0);
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
      0.14 * Math.sin(2 * Math.PI * note * t) * Math.min(1, local / 0.012) * Math.exp(-local * 3.8);
    const hatSound = 0.047 * noise(i) * Math.exp(-hat * 95) * (step % 2 ? 0.7 : 1);
    const snare = step % 2 ? 0.095 * noise(i + 271) * Math.exp(-local * 29) : 0;
    const fade = Math.min(1, t / 0.008, (seconds - t) / 0.08);
    out[i] = (kick + bass + hatSound + snare) * Math.max(0, fade);
  }
  return buffer;
}
