import { GENERATORS, type GeneratorId } from './generators';
import { mulberry32, randomSeed } from './rng';
import type { Exam, ExamMode, Question } from './types';

/** Uno slot della prova: quale generatore e quanti punti vale. */
interface Slot {
  gen: GeneratorId;
  points: number;
}

const repeat = (gen: GeneratorId, points: number, times: number): Slot[] =>
  Array.from({ length: times }, () => ({ gen, points }));

/**
 * Struttura delle prove.
 *
 * `full` replica il formato reale: 12 quesiti e punteggi che sommano
 * **esattamente 30** — 9 crocette da 2 (incluse CP2, porte e assembly),
 * la sintesi di Karnaugh da 5, l'assembly da scrivere da 4, la domanda
 * aperta da 3. La somma è verificata da un test.
 */
const BLUEPRINTS: Record<ExamMode, Slot[]> = {
  full: [
    ...repeat('mc', 2, 6),
    { gen: 'cp2', points: 2 },
    { gen: 'gate', points: 2 },
    { gen: 'asmSnippet', points: 2 },
    { gen: 'karnaugh', points: 5 },
    { gen: 'asmWrite', points: 4 },
    { gen: 'open', points: 3 },
  ],

  // Ripasso lampo: solo quesiti auto-correggibili.
  quick: [
    ...repeat('mc', 2, 3),
    { gen: 'cp2', points: 2 },
    { gen: 'hex', points: 2 },
    { gen: 'gate', points: 2 },
    { gen: 'arith', points: 2 },
    { gen: 'maxRange', points: 2 },
  ],

  // Drill sul binario con segno.
  binary: [...repeat('cp2', 2, 4), ...repeat('arith', 2, 3), ...repeat('maxRange', 2, 3)],

  // Drill sulle reti combinatorie.
  logic: [
    ...repeat('gate', 2, 5),
    { gen: 'mc', points: 2 },
    ...repeat('karnaugh', 5, 2),
  ],
};

export const EXAM_MODES = Object.keys(BLUEPRINTS) as ExamMode[];

export const MODE_LABELS: Record<ExamMode, string> = {
  full: 'Esame completo',
  quick: 'Quiz lampo',
  binary: 'Drill complemento a 2',
  logic: 'Drill reti combinatorie',
};

export const MODE_DESCRIPTIONS: Record<ExamMode, string> = {
  full: 'Formato integrale su 30. Crocette + Karnaugh + assembly + domanda aperta.',
  quick: 'Solo domande auto-correggibili. Voto rapido, per ripasso mirato.',
  binary: 'Esercizi generati sul binario con segno. La parte che «non deve avere dubbi».',
  logic: 'Riconoscimento porte + sintesi con Karnaugh dalla tabella di verità.',
};

/** Punti totali previsti da una modalità, senza generare la prova. */
export function totalPointsFor(mode: ExamMode): number {
  return BLUEPRINTS[mode].reduce((sum, slot) => sum + slot.points, 0);
}

export function questionCountFor(mode: ExamMode): number {
  return BLUEPRINTS[mode].length;
}

export function isExamMode(value: string): value is ExamMode {
  return value in BLUEPRINTS;
}

/**
 * Costruisce una prova. Con lo stesso `seed` produce la stessa prova, il che
 * rende i test riproducibili e permetterà di salvare e rigiocare un esame.
 */
export function buildExam(mode: ExamMode, seed: number = randomSeed()): Exam {
  const rng = mulberry32(seed);
  const used = new Set<string>();

  const questions: Question[] = BLUEPRINTS[mode].map((slot, index) =>
    GENERATORS[slot.gen]({ rng, points: slot.points, used, seq: index + 1 }),
  );

  return {
    id: `exam-${seed.toString(36)}`,
    mode,
    seed,
    createdAt: Date.now(),
    questions,
    totalPoints: questions.reduce((sum, question) => sum + question.points, 0),
  };
}
