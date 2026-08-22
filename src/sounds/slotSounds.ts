"use client";

import { sound } from "./SoundManager";

/**
 * Voices for the Project Hunter machine.
 *
 * Everything is synthesised from the existing SoundManager primitives
 * (`tone` / `noise`) so the page ships no audio assets and inherits the
 * global mute + volume state for free.
 */
export const slotSfx = {
  /** Metal arm travelling down its track while the user drags. */
  leverTravel(intensity: number) {
    sound.noise({
      duration: 0.03,
      gain: 0.012 + intensity * 0.02,
      filterType: "bandpass",
      frequency: 1200 + intensity * 900,
      q: 3,
    });
  },

  /** The commit: sprung arm bottoms out and the drum motor spins up. */
  leverPull() {
    sound.noise({ duration: 0.10, gain: 0.075, filterType: "lowpass", frequency: 900, q: 0.9 });
    sound.tone({ freq: 150, endFreq: 62, type: "square", attack: 0.002, decay: 0.16, gain: 0.05 });
    sound.tone({ freq: 74, endFreq: 44, type: "sine", delay: 0.02, attack: 0.004, decay: 0.30, gain: 0.06 });
    // Motor spinning up.
    sound.tone({ freq: 58, endFreq: 132, type: "sawtooth", delay: 0.05, attack: 0.09, decay: 0.55, gain: 0.016 });
  },

  /** Lever springs back to rest. */
  leverReturn() {
    sound.noise({ duration: 0.05, gain: 0.03, filterType: "highpass", frequency: 2600, q: 1 });
    sound.tone({ freq: 320, endFreq: 210, type: "triangle", attack: 0.002, decay: 0.09, gain: 0.022 });
  },

  /** One symbol crossing the payline. Pitch rises as the reel slows. */
  reelTick(velocityRatio: number) {
    const f = 900 + (1 - velocityRatio) * 1500;
    sound.noise({ duration: 0.014, gain: 0.026, filterType: "bandpass", frequency: f, q: 9 });
    sound.tone({ freq: 168, endFreq: 132, type: "square", attack: 0.001, decay: 0.022, gain: 0.012 });
  },

  /** Drum seats into its detent. */
  reelLock(index: number) {
    sound.noise({ duration: 0.055, gain: 0.062, filterType: "lowpass", frequency: 1500, q: 1 });
    sound.tone({ freq: 210 - index * 26, endFreq: 88, type: "square", attack: 0.001, decay: 0.10, gain: 0.05 });
    sound.tone({ freq: 1180 + index * 120, type: "sine", delay: 0.012, attack: 0.001, decay: 0.05, gain: 0.014 });
  },

  /** 3/3 — relay clatter into a rising arpeggio. */
  jackpot() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => {
      sound.tone({ freq: f, type: "square", delay: i * 0.062, attack: 0.002, decay: 0.16, gain: 0.030 });
      sound.tone({ freq: f * 2, type: "sine", delay: i * 0.062 + 0.004, attack: 0.002, decay: 0.10, gain: 0.012 });
    });
    sound.tone({ freq: 1046.5, type: "sine", delay: 0.38, attack: 0.01, decay: 0.72, gain: 0.026 });
    sound.noise({ delay: 0.30, duration: 0.22, gain: 0.020, filterType: "highpass", frequency: 5200, q: 1 });
  },

  /** 2/3 — resolved, but a semitone short of the full chord. */
  partial() {
    sound.tone({ freq: 440, type: "triangle", attack: 0.003, decay: 0.20, gain: 0.030 });
    sound.tone({ freq: 587.33, type: "triangle", delay: 0.085, attack: 0.003, decay: 0.26, gain: 0.026 });
    sound.tone({ freq: 293.66, type: "sine", delay: 0.09, attack: 0.02, decay: 0.42, gain: 0.018 });
  },

  /** 1/3 or empty — the machine shrugs. */
  weak() {
    sound.tone({ freq: 392, endFreq: 233, type: "triangle", attack: 0.004, decay: 0.30, gain: 0.026 });
    sound.noise({ delay: 0.02, duration: 0.09, gain: 0.014, filterType: "lowpass", frequency: 1400, q: 1 });
  },

  /** Terminal glyph printing. */
  keystroke() {
    sound.noise({ duration: 0.009, gain: 0.010, filterType: "bandpass", frequency: 3400, q: 7 });
  },

  /** Result card materialising. */
  cardIn(index: number) {
    sound.tone({
      freq: 620 + index * 55,
      type: "sine",
      attack: 0.002,
      decay: 0.10,
      gain: 0.016,
    });
    sound.noise({ duration: 0.02, gain: 0.008, filterType: "highpass", frequency: 4200, q: 1 });
  },
};
