import type { Op, Question, QuizConfig } from './types';

const SYMBOL: Record<Exclude<Op, 'carryAdd' | 'borrow'>, string> = {
  add: '＋',
  sub: '－',
  mul: '×',
  div: '÷',
};

function rand(min: number, max: number) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + Math.floor(Math.random() * (high - low + 1));
}

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = rand(0, index);
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy;
}

function makeAdd(max: number) {
  const sum = rand(1, Math.max(1, max));
  const a = rand(0, sum);
  return { a, b: sum - a, answer: sum };
}

function makeSub(max: number) {
  const a = rand(1, Math.max(1, max));
  const b = a === 1 ? rand(0, 1) : rand(1, a);
  return { a, b, answer: a - b };
}

function makeMul(config: QuizConfig) {
  let a = rand(config.factorMin, config.factorMax);
  let b = rand(config.otherMin, config.otherMax);
  if (Math.random() < 0.5) {
    const swap = a;
    a = b;
    b = swap;
  }
  return { a, b, answer: a * b };
}

function makeDiv(config: QuizConfig) {
  const quotient = rand(config.factorMin, config.factorMax);
  const divisor = rand(Math.max(1, config.otherMin), Math.max(1, config.otherMax));
  return { a: quotient * divisor, b: divisor, answer: quotient };
}

function makeCarryAdd(max: number) {
  if (max <= 20) {
    const sum = rand(10, Math.min(max, 18));
    const a = rand(Math.max(1, sum - 9), Math.min(9, sum - 1));
    return { a, b: sum - a, answer: sum, op: 'add' as const };
  }

  const onesA = rand(1, 9);
  const onesB = rand(10 - onesA, 9);
  const onesResult = onesA + onesB - 10;
  const highSum = rand(0, Math.floor((max - onesResult) / 10) - 1);
  const highA = rand(0, highSum);
  const highB = highSum - highA;
  const a = highA * 10 + onesA;
  const b = highB * 10 + onesB;
  return { a, b, answer: a + b, op: 'add' as const };
}

function makeBorrowSub(max: number) {
  if (max <= 20) {
    const choices: number[] = [];
    for (let value = 10; value <= max; value += 1) {
      if (value % 10 <= 8) choices.push(value);
    }
    const a = choices[rand(0, choices.length - 1)];
    const b = rand((a % 10) + 1, 9);
    return { a, b, answer: a - b, op: 'sub' as const };
  }

  const onesB = rand(1, 9);
  const onesA = rand(0, onesB - 1);
  const highA = rand(1, Math.floor((max - onesA) / 10));
  const highB = rand(0, highA - 1);
  const a = highA * 10 + onesA;
  const b = highB * 10 + onesB;
  return { a, b, answer: a - b, op: 'sub' as const };
}

export function makeOptions(answer: number) {
  const picked = new Set<number>([answer]);
  const nearby = shuffle([1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 10, -10]);
  nearby.forEach((delta) => {
    const value = answer + delta;
    if (value >= 0 && value !== answer) picked.add(value);
  });
  const options = [...picked].slice(0, 4);
  let step = 1;
  while (options.length < 4 && step < 40) {
    const value = answer + step;
    if (value >= 0 && !options.includes(value)) options.push(value);
    step += 1;
  }
  return shuffle(options);
}

export function makeQuestion(config: QuizConfig): Question {
  const ops = config.ops.length ? config.ops : (['add'] as Op[]);
  const op = ops[rand(0, ops.length - 1)];
  if (op === 'carryAdd' || op === 'borrow') {
    const built = op === 'carryAdd' ? makeCarryAdd(config.max) : makeBorrowSub(config.max);
    return {
      a: built.a,
      b: built.b,
      answer: built.answer,
      op: built.op,
      prompt: `${built.a} ${SYMBOL[built.op]} ${built.b}`,
      options: makeOptions(built.answer),
    };
  }

  const built =
    op === 'add' ? makeAdd(config.max) : op === 'sub' ? makeSub(config.max) : op === 'mul' ? makeMul(config) : makeDiv(config);

  return {
    ...built,
    op,
    prompt: `${built.a} ${SYMBOL[op]} ${built.b}`,
    options: makeOptions(built.answer),
  };
}

export function starsFor(firstTry: number, total: number) {
  if (total <= 0) return 0;
  const misses = total - firstTry;
  if (misses <= total / 6) return 3;
  if (misses <= total / 3) return 2;
  if (misses <= total / 2) return 1;
  return 0;
}
