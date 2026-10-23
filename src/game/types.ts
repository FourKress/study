export type Op = 'add' | 'sub' | 'mul' | 'div';

export type Mood = 'idle' | 'think' | 'worry' | 'cheer' | 'oops' | 'sulk' | 'win';

export interface QuizConfig {
  ops: Op[];
  max: number;
  factorMin: number;
  factorMax: number;
  otherMin: number;
  otherMax: number;
  count: number;
  seconds: number;
  endless?: boolean;
}

export interface Question {
  a: number;
  b: number;
  op: Op;
  answer: number;
  prompt: string;
  options: number[];
}

export interface RoundResult {
  total: number;
  firstTry: number;
  stars: number;
}

export interface Level {
  id: string;
  name: string;
  blurb: string;
  badge: string;
  tint: string;
  sticker: string;
  ops: Op[];
  max: number;
  factorMin: number;
  factorMax: number;
  otherMin: number;
  otherMax: number;
  count: number;
  seconds: number;
}
