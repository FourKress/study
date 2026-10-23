import { save } from './storage';

let context: AudioContext | null = null;

function getContext() {
  if (context) return context;
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  context = new Ctx();
  return context;
}

export function unlockAudio() {
  if (!save.sound) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    context = null;
  }
}

function note(ctx: AudioContext, frequency: number, start: number, duration: number) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playTone(kind: 'ok' | 'bad' | 'win') {
  if (!save.sound) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    if (kind === 'bad') {
      note(ctx, 180, now, 0.12);
      return;
    }
    if (kind === 'ok') {
      note(ctx, 523, now, 0.12);
      note(ctx, 784, now + 0.1, 0.16);
      return;
    }
    note(ctx, 523, now, 0.12);
    note(ctx, 659, now + 0.12, 0.12);
    note(ctx, 880, now + 0.24, 0.22);
  } catch {
    context = null;
  }
}
