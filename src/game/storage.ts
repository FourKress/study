import { reactive } from 'vue';

const KEY = 'suan-suan-island-v1';

export interface ClearRecord {
  stars: number;
}

export interface SaveData {
  clears: Record<string, ClearRecord>;
  sound: boolean;
  motion: boolean;
}

function emptySave(): SaveData {
  return { clears: {}, sound: true, motion: true };
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave();
    const data = JSON.parse(raw) as Partial<SaveData>;
    return {
      clears: data.clears && typeof data.clears === 'object' ? data.clears : {},
      sound: data.sound !== false,
      motion: data.motion !== false,
    };
  } catch {
    return emptySave();
  }
}

export const save = reactive<SaveData>(loadSave());

function persist() {
  localStorage.setItem(KEY, JSON.stringify({ clears: save.clears, sound: save.sound, motion: save.motion }));
}

export function markClear(id: string, stars: number) {
  const previous = save.clears[id]?.stars ?? 0;
  save.clears[id] = { stars: Math.max(previous, stars) };
  persist();
}

export function toggleSound() {
  save.sound = !save.sound;
  persist();
}

export function toggleMotion() {
  save.motion = !save.motion;
  persist();
}

export function resetSave() {
  save.clears = {};
  persist();
}

export function stickerCount() {
  return Object.keys(save.clears).length;
}

export function starCount() {
  return Object.values(save.clears).reduce((sum, item) => sum + item.stars, 0);
}
