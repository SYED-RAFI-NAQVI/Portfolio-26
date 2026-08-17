"use client";

export class SoundManager {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  enabled: boolean = true;
  volume: number = 0.7;
  noiseBuffer: AudioBuffer | null = null;

  ensure() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  async unlock(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer();
    }

    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch (e) {
        return false;
      }
    }

    this.tone({
      freq: 880,
      endFreq: 1046,
      type: "sine",
      attack: 0.002,
      decay: 0.09,
      gain: 0.018,
    });

    return true;
  }

  setEnabled(v: boolean) {
    if (typeof window === "undefined") return;
    this.ensure();
    this.enabled = v;
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(v ? this.volume : 0, t, 0.015);
  }

  setVolume(v: number) {
    if (typeof window === "undefined") return;
    this.ensure();
    this.volume = v;
    if (this.enabled && this.ctx && this.master) {
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.015);
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return null;
    const length = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  tone({ freq = 440, endFreq = null, type = "sine", delay = 0, attack = 0.005, decay = 0.18, gain = 0.08 }: { freq?: number, endFreq?: number | null, type?: OscillatorType, delay?: number, attack?: number, decay?: number, gain?: number } = {}) {
    this.ensure();
    if (!this.enabled || !this.ctx || !this.master) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + decay);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.linearRampToValueAtTime(gain, now + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    osc.connect(amp);
    amp.connect(this.master);
    osc.start(now);
    osc.stop(now + decay + 0.04);
  }

  noise({ delay = 0, duration = 0.08, gain = 0.05, filterType = "bandpass", frequency = 2400, q = 1.2 }: { delay?: number, duration?: number, gain?: number, filterType?: BiquadFilterType, frequency?: number, q?: number } = {}) {
    this.ensure();
    if (!this.enabled || !this.ctx || !this.master || !this.noiseBuffer) return;
    const now = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();
    src.buffer = this.noiseBuffer;
    filter.type = filterType;
    filter.frequency.setValueAtTime(frequency, now);
    filter.Q.setValueAtTime(q, now);
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter);
    filter.connect(amp);
    amp.connect(this.master);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  chime = () => {
    this.tone({ freq: 1046.5, attack: 0.006, decay: 0.28, gain: 0.085 });
    this.tone({ freq: 2093, delay: 0.008, attack: 0.003, decay: 0.18, gain: 0.025 });
    this.tone({ freq: 3139.5, delay: 0.015, attack: 0.002, decay: 0.12, gain: 0.012 });
  };

  sparkle = () => {
    [1760, 2093, 2637, 3136, 3520].forEach((freq, i) => {
      this.tone({ freq, delay: i * 0.045, attack: 0.002, decay: 0.12, gain: 0.035 - i * 0.003 });
    });
  };

  droplet = () => {
    this.tone({ freq: 1200, endFreq: 550, attack: 0.002, decay: 0.32, gain: 0.075 });
    this.tone({ freq: 2400, endFreq: 900, delay: 0.008, attack: 0.001, decay: 0.17, gain: 0.018 });
  };

  bloom = () => {
    this.tone({ freq: 528, attack: 0.11, decay: 0.85, gain: 0.07 });
    this.tone({ freq: 792, delay: 0.035, attack: 0.14, decay: 0.72, gain: 0.026 });
  };

  tick = () => {
    this.noise({ duration: 0.045, gain: 0.055, frequency: 5400, q: 5 });
  };

  press = () => {
    this.noise({ duration: 0.055, gain: 0.045, frequency: 1500, q: 1.6 });
    this.tone({ freq: 125, endFreq: 95, attack: 0.001, decay: 0.075, gain: 0.025 });
  };

  release = () => {
    this.noise({ duration: 0.04, gain: 0.035, frequency: 2400, q: 2 });
    this.tone({ freq: 180, endFreq: 240, attack: 0.001, decay: 0.065, gain: 0.018 });
  };

  toggle = () => {
    this.noise({ duration: 0.045, gain: 0.038, frequency: 2200, q: 4 });
    this.noise({ delay: 0.075, duration: 0.045, gain: 0.032, frequency: 3800, q: 4 });
  };

  success = () => {
    [440, 554.37, 659.25].forEach((freq, i) => {
      this.tone({ freq, delay: i * 0.035, attack: 0.008, decay: 0.5, gain: 0.04 });
    });
    this.tone({ freq: 880, delay: 0.12, attack: 0.004, decay: 0.32, gain: 0.02 });
  };

  error = () => {
    this.noise({ duration: 0.22, gain: 0.045, frequency: 850, q: 1.7 });
    this.tone({ freq: 196, endFreq: 155, type: "sawtooth", attack: 0.002, decay: 0.25, gain: 0.018 });
    this.tone({ freq: 233, endFreq: 185, type: "square", delay: 0.012, attack: 0.002, decay: 0.20, gain: 0.010 });
  };

  page = () => {
    this.ensure();
    if (!this.enabled || !this.ctx || !this.master || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();
    src.buffer = this.noiseBuffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(4200, now + 0.24);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.linearRampToValueAtTime(0.035, now + 0.025);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.33);
    src.connect(filter);
    filter.connect(amp);
    amp.connect(this.master);
    src.start(now);
    src.stop(now + 0.36);
    this.tone({ freq: 2400, endFreq: 3100, delay: 0.06, attack: 0.004, decay: 0.24, gain: 0.025 });
  };

  hover = () => {
    this.tone({ freq: 880, endFreq: 1046.5, type: "sine", attack: 0.001, decay: 0.065, gain: 0.022 });
    this.tone({ freq: 1760, type: "sine", delay: 0.008, attack: 0.001, decay: 0.045, gain: 0.007 });
  };

  focus = () => {
    this.tone({ freq: 660, type: "sine", attack: 0.002, decay: 0.095, gain: 0.028 });
    this.tone({ freq: 990, type: "sine", delay: 0.055, attack: 0.002, decay: 0.11, gain: 0.022 });
  };

  pluck = () => {
    this.tone({ freq: 392, type: "triangle", attack: 0.001, decay: 0.24, gain: 0.045 });
    this.tone({ freq: 784, type: "sine", delay: 0.004, attack: 0.001, decay: 0.12, gain: 0.018 });
    this.tone({ freq: 1176, type: "sine", delay: 0.006, attack: 0.001, decay: 0.07, gain: 0.008 });
  };

  pop = () => {
    this.tone({ freq: 260, endFreq: 520, type: "sine", attack: 0.001, decay: 0.095, gain: 0.04 });
    this.noise({ delay: 0.002, duration: 0.025, gain: 0.012, filterType: "bandpass", frequency: 3200, q: 2.5 });
  };

  whoosh = () => {
    this.ensure();
    if (!this.enabled || !this.ctx || !this.master || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();
    src.buffer = this.noiseBuffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(5600, now + 0.28);
    filter.Q.setValueAtTime(0.7, now);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.linearRampToValueAtTime(0.028, now + 0.07);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.31);
    src.connect(filter);
    filter.connect(amp);
    amp.connect(this.master);
    src.start(now);
    src.stop(now + 0.34);
  };

  scan = () => {
    this.ensure();
    if (!this.enabled || !this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(3100, now + 0.34);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.linearRampToValueAtTime(0.028, now + 0.02);
    amp.gain.setValueAtTime(0.028, now + 0.18);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
    osc.connect(amp);
    amp.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.38);
  };

  pulse = () => {
    this.tone({ freq: 180, endFreq: 150, type: "sine", attack: 0.012, decay: 0.28, gain: 0.055 });
    this.tone({ freq: 360, endFreq: 300, type: "sine", delay: 0.01, attack: 0.009, decay: 0.21, gain: 0.015 });
  };

  back = () => {
    this.tone({ freq: 880, type: "sine", attack: 0.002, decay: 0.13, gain: 0.028 });
    this.tone({ freq: 587.33, type: "sine", delay: 0.07, attack: 0.002, decay: 0.16, gain: 0.032 });
  };

  confirm = () => {
    this.tone({ freq: 523.25, type: "sine", attack: 0.003, decay: 0.19, gain: 0.035 });
    this.tone({ freq: 783.99, type: "sine", delay: 0.065, attack: 0.003, decay: 0.23, gain: 0.033 });
    this.tone({ freq: 1046.5, type: "sine", delay: 0.13, attack: 0.002, decay: 0.20, gain: 0.018 });
  };

  ambient = () => {
    this.tone({ freq: 220, type: "sine", attack: 0.14, decay: 1.1, gain: 0.01 });
    this.tone({ freq: 329.63, type: "sine", delay: 0.05, attack: 0.18, decay: 1.0, gain: 0.0072 });
    this.tone({ freq: 659.25, type: "sine", delay: 0.14, attack: 0.20, decay: 0.84, gain: 0.0032 });
  };

  scroll = () => {
    this.noise({ duration: 0.028, gain: 0.036, filterType: "bandpass", frequency: 3100, q: 6 });
    this.noise({ delay: 0.004, duration: 0.018, gain: 0.018, filterType: "highpass", frequency: 5200, q: 1 });
    this.tone({ freq: 145, endFreq: 118, type: "sine", delay: 0.001, attack: 0.001, decay: 0.045, gain: 0.012 });
  };

  play = (name: string) => {
    if (typeof (this as any)[name] === "function") {
      (this as any)[name]();
    }
  };
}

export const sound = new SoundManager();
