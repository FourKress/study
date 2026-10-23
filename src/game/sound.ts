import { save } from './storage';

let context: AudioContext | null = null;

function getContext() {
  if (context) return context;
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  context = new Ctx();
  return context;
}

let speechHold = false;
let speechToken = 0;
let speechPrimed = false;
let zhVoice: SpeechSynthesisVoice | null = null;

function speechEngine() {
  return typeof window === 'undefined' ? null : window.speechSynthesis ?? null;
}

function loadZhVoice() {
  const synth = speechEngine();
  if (!synth) return;
  const voices = synth.getVoices();
  zhVoice =
    voices.find((voice) => voice.lang === 'zh-CN' || voice.lang === 'zh_CN') ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('zh')) ??
    null;
}

function primeSpeech() {
  const synth = speechEngine();
  if (!synth || speechPrimed) return;
  speechPrimed = true;
  loadZhVoice();
  synth.addEventListener('voiceschanged', loadZhVoice);
  const primer = new SpeechSynthesisUtterance('嗯');
  primer.lang = 'zh-CN';
  primer.volume = 0;
  synth.speak(primer);
}

function toSpoken(text: string) {
  return text
    .replace(/×/g, '乘')
    .replace(/＝|=/g, '等于')
    .replace(/＋/g, '加')
    .replace(/－/g, '减')
    .replace(/：/g, '，')
    .replace(/行/g, '航')
    .replace(/\s+/g, '');
}

export function stopSpeak() {
  speechToken += 1;
  speechEngine()?.cancel();
}

export function speak(text: string, onDone?: (didSpeak: boolean) => void) {
  const synth = speechEngine();
  const mine = ++speechToken;
  if (!save.sound || !text || !synth) {
    onDone?.(false);
    return;
  }
  loadZhVoice();
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(toSpoken(text));
  utter.lang = 'zh-CN';
  utter.rate = 0.9;
  utter.pitch = 1.05;
  if (zhVoice) utter.voice = zhVoice;
  const finish = (didSpeak: boolean) => {
    if (mine !== speechToken) return;
    onDone?.(didSpeak);
  };
  utter.onend = () => finish(true);
  utter.onerror = () => finish(false);
  window.setTimeout(() => {
    if (mine !== speechToken) return;
    try {
      synth.speak(utter);
    } catch {
      finish(false);
    }
  }, 40);
}

export function holdMusicForSpeech(hold: boolean) {
  speechHold = hold;
  if (hold) stopMusic();
  else if (save.sound) startMusic();
}

export function unlockAudio() {
  if (!save.sound) return;
  primeSpeech();
  try {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    context = null;
  }
}

function note(ctx: AudioContext, frequency: number, start: number, duration: number, peak = 0.08) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
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

export type MusicLayer = 'map' | 'play' | 'wind' | 'rain';

const melody = [262, 294, 330, 392, 330, 294, 262, 196];
let musicTimer = 0;
let musicStep = 0;
let musicLayer: MusicLayer = 'map';
let musicOn = false;

export function setMusicLayer(next: MusicLayer) {
  musicLayer = next;
}

export function stopMusic() {
  musicOn = false;
  window.clearTimeout(musicTimer);
}

export function startMusic() {
  if (!save.sound || musicOn || speechHold) return;
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();
  musicOn = true;

  const tick = () => {
    if (!musicOn || !save.sound) {
      stopMusic();
      return;
    }
    try {
      const current = getContext();
      if (!current) return;
      const now = current.currentTime;
      const pitch = melody[musicStep % melody.length];
      if (musicLayer !== 'wind' || musicStep % 2 === 0) {
        note(current, pitch, now, musicLayer === 'map' ? 0.42 : 0.3, musicLayer === 'map' ? 0.02 : 0.014);
      }
      if (musicLayer === 'rain') note(current, 1480, now, 0.04, 0.006);
      musicStep += 1;
    } catch {
      context = null;
      stopMusic();
      return;
    }
    musicTimer = window.setTimeout(tick, musicLayer === 'map' ? 640 : 720);
  };
  tick();
}
