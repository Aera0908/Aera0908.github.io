/**
 * HUD audio engine — everything is synthesized with WebAudio oscillators,
 * no audio files. Spec: kprverse-design-spec §6.
 *
 * `boot()` must be called from a user gesture (browser autoplay policy);
 * until then every fx method is a silent no-op.
 */

export const AUDIO_STORAGE_KEY = "hud-audio";

class HudAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;
  private muted = false;

  get booted(): boolean {
    return this.ctx !== null;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  /** Idempotent. Creates the context, restores mute state, starts the hum. */
  boot(): void {
    if (typeof window === "undefined" || this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.muted = localStorage.getItem(AUDIO_STORAGE_KEY) === "muted";
    this.master.gain.value = this.muted ? 0 : 1;
    this.master.connect(this.ctx.destination);
    this.startAmbient();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem(AUDIO_STORAGE_KEY, muted ? "muted" : "on");
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, t + 0.15);
  }

  /**
   * Ambient hum: two sines an octave apart, the upper one detuned +0.6Hz
   * so they beat slowly against each other, through a lowpass, with a
   * 0.08Hz LFO breathing on the gain. Base gain 0.05 (≈ −28 dB).
   */
  private startAmbient(): void {
    if (!this.ctx || !this.master || this.ambient) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 2.5); // slow fade-in, no pop

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;

    const oscA = ctx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.value = 55;

    const oscB = ctx.createOscillator();
    oscB.type = "sine";
    oscB.frequency.value = 110.6;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.018;
    lfo.connect(lfoDepth);
    lfoDepth.connect(gain.gain);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    oscA.start();
    oscB.start();
    lfo.start();

    this.ambient = {
      stop: () => {
        oscA.stop();
        oscB.stop();
        lfo.stop();
        gain.disconnect();
      },
    };
  }

  /** Hover blip: 1200Hz sine, ~30ms exponential decay. */
  blip(): void {
    this.tone({ from: 1200, to: 1200, type: "sine", peak: 0.06, decay: 0.03 });
  }

  /** Click: 440→880Hz triangle sweep over 80ms. */
  click(): void {
    this.tone({ from: 440, to: 880, type: "triangle", peak: 0.1, decay: 0.08 });
  }

  /** Confirmation chirp: two quick rising tones (uplink success). */
  confirm(): void {
    this.tone({ from: 660, to: 660, type: "sine", peak: 0.08, decay: 0.07 });
    this.tone({ from: 990, to: 990, type: "sine", peak: 0.08, decay: 0.12, delay: 0.09 });
  }

  /** Error buzz: short low sawtooth. */
  deny(): void {
    this.tone({ from: 160, to: 110, type: "sawtooth", peak: 0.07, decay: 0.12 });
  }

  /** Heavy impact: a low sine drop plus a lowpassed noise knock. */
  thump(peak = 0.22): void {
    this.tone({ from: 95, to: 38, type: "sine", peak, decay: 0.32 });
    this.noise({ duration: 0.06, peak: peak * 0.6, filter: "lowpass", freq: 900 });
  }

  /** Ratchet click: a short bright noise tick over a tiny square blip. */
  ratchet(): void {
    this.noise({ duration: 0.03, peak: 0.09, filter: "bandpass", freq: 2600 });
    this.tone({ from: 210, to: 180, type: "square", peak: 0.025, decay: 0.04 });
  }

  /** Pressure release: highpassed noise that swells, then bleeds off. */
  hiss(duration = 0.9): void {
    this.noise({ duration, peak: 0.07, filter: "highpass", freq: 1800, attack: 0.05 });
  }

  /**
   * Sliding door: a pneumatic rush (band-passed noise sweeping up), a quiet
   * servo whine riding on it, and a soft seat at the end of travel.
   */
  door(duration = 0.8): void {
    this.sweep({ kind: "noise", duration, from: 900, to: 2600, q: 0.9, peak: 0.05 });
    this.sweep({ kind: "triangle", duration, from: 420, to: 640, q: 0, peak: 0.012 });
    this.tone({ from: 160, to: 110, type: "sine", peak: 0.06, decay: 0.12, delay: duration - 0.04 });
  }

  /** Brakes: a magnetic whine falling in pitch over a friction hiss that eases off with it. */
  brake(duration = 2): void {
    this.sweep({ kind: "sine", duration, from: 880, to: 220, q: 0, peak: 0.028 });
    this.sweep({ kind: "noise", duration, from: 3600, to: 1400, q: 1.4, peak: 0.035 });
  }

  /**
   * A tone or band-passed noise whose pitch (or band centre) glides from
   * `from` to `to` over `duration`, with a short attack and a smooth release.
   */
  private sweep(opts: {
    kind: "noise" | OscillatorType;
    duration: number;
    from: number;
    to: number;
    q: number;
    peak: number;
  }): void {
    if (!this.ctx || !this.master || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const end = t + opts.duration;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(opts.peak, t + Math.min(0.08, opts.duration / 4));
    gain.gain.setValueAtTime(opts.peak, end - opts.duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    gain.connect(this.master);

    let src: AudioScheduledSourceNode;
    if (opts.kind === "noise") {
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      noise.loop = true;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = opts.q;
      band.frequency.setValueAtTime(opts.from, t);
      band.frequency.exponentialRampToValueAtTime(opts.to, end);
      noise.connect(band);
      band.connect(gain);
      src = noise;
    } else {
      const osc = ctx.createOscillator();
      osc.type = opts.kind;
      osc.frequency.setValueAtTime(opts.from, t);
      osc.frequency.exponentialRampToValueAtTime(opts.to, end);
      osc.connect(gain);
      src = osc;
    }
    src.start(t);
    src.stop(end + 0.05);
    src.onended = () => gain.disconnect();
  }

  /** Docking chime: a soft two-note bell. */
  chime(): void {
    this.tone({ from: 1046, to: 1046, type: "sine", peak: 0.07, decay: 0.6 });
    this.tone({ from: 784, to: 784, type: "sine", peak: 0.07, decay: 0.8, delay: 0.22 });
  }

  private noiseBuffer: AudioBuffer | null = null;

  /** one second of white noise, built once and looped by every noise source */
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      const len = ctx.sampleRate;
      this.noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    return this.noiseBuffer;
  }

  private noise(opts: {
    duration: number;
    peak: number;
    filter: BiquadFilterType;
    freq: number;
    attack?: number;
  }): void {
    if (!this.ctx || !this.master || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filter;
    filter.frequency.value = opts.freq;
    const gain = ctx.createGain();
    const attack = opts.attack ?? 0.002;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(opts.peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    src.start(t);
    src.stop(t + opts.duration + 0.05);
    src.onended = () => gain.disconnect();
  }

  private tone(opts: {
    from: number;
    to: number;
    type: OscillatorType;
    peak: number;
    decay: number;
    delay?: number;
  }): void {
    if (!this.ctx || !this.master || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + (opts.delay ?? 0);

    const osc = ctx.createOscillator();
    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.from, t);
    if (opts.to !== opts.from) {
      osc.frequency.exponentialRampToValueAtTime(opts.to, t + opts.decay);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(opts.peak, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.decay);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + opts.decay + 0.05);
    osc.onended = () => gain.disconnect();
  }
}

/** Module-level singleton — one AudioContext for the whole app. */
export const hudAudio = new HudAudio();
