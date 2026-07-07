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
