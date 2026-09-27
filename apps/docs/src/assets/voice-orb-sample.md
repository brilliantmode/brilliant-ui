# Voice Orb spoken sample

AI-generated for this demo using [Kokoro-82M v1.0](https://huggingface.co/hexgrad/Kokoro-82M),
voice `af_heart`, English (US), speed `1.0`. The model weights are Apache-2.0 licensed;
no model weights or inference dependencies are shipped with the documentation.

Transcript:

> Hey there. I'm ready when you are. Tell me what you're working on, and we'll take it from there.

Generated locally with `kokoro-onnx` 0.6.1 using the model and voice bundle linked by the
[project's example](https://github.com/thewh1teagle/kokoro-onnx/blob/main/examples/save.py).
The 24 kHz mono output was normalized to -18 LUFS and encoded as 96 kbps MP3:

```sh
ffmpeg -i voice-sample.wav -af 'loudnorm=I=-18:TP=-1.5:LRA=7' \
  -ar 24000 -ac 1 -c:a libmp3lame -b:a 96k voice-orb-sample.mp3
```

The application fetches the bundled file only after **Play sample** is pressed. No speech
API, microphone permission, or network speech service is used for sample playback.
