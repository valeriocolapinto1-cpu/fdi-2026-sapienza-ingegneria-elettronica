import { useEffect, useState } from 'preact/hooks';
import type { ExamResult } from '~/engine/types';
import type { TopicId } from '~/content/types';
import { storage, type KeyValueStore } from './storage';

const KEY = 'aefin.v1';

/** Esito salvato di una prova. Volutamente essenziale: non serve altro. */
export interface ExamRecord {
  mode: ExamResult['mode'];
  /** Presente solo per la prova completa. */
  score30?: number;
  percent: number;
  lode: boolean;
  earned: number;
  total: number;
  at: number;
}

/**
 * Esito per singola voce di banca. Serve alle statistiche per argomento e
 * sarà la base della ripetizione dilazionata (§14).
 */
export type BankOutcomes = Record<string, { right: number; wrong: number }>;

export interface ProgressData {
  version: 1;
  exams: ExamRecord[];
  /** Moduli di studio aperti almeno una volta. */
  studied: TopicId[];
  bank: BankOutcomes;
}

const EMPTY: ProgressData = { version: 1, exams: [], studied: [], bank: {} };

/** Non lasciamo crescere lo storico all'infinito. */
const MAX_EXAMS = 200;

function read(store: KeyValueStore): ProgressData {
  const data = store.get<ProgressData>(KEY, EMPTY);
  // Difesa contro dati vecchi o manomessi: si riparte pulito.
  if (typeof data !== 'object' || data === null || data.version !== 1) return EMPTY;
  return {
    version: 1,
    exams: Array.isArray(data.exams) ? data.exams : [],
    studied: Array.isArray(data.studied) ? data.studied : [],
    bank: typeof data.bank === 'object' && data.bank !== null ? data.bank : {},
  };
}

// ─────────── notifica ai componenti che i dati sono cambiati ───────────

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function write(next: ProgressData): void {
  storage.set(KEY, next);
  emit();
}

export function getProgress(): ProgressData {
  return read(storage);
}

/** Registra l'esito di una prova e gli esiti per voce di banca. */
export function recordExam(result: ExamResult): void {
  const data = getProgress();

  const record: ExamRecord = {
    mode: result.mode,
    ...(result.score30 !== undefined ? { score30: result.score30 } : {}),
    percent: result.percent,
    lode: result.lode,
    earned: result.earned,
    total: result.total,
    at: result.finishedAt,
  };

  const bank: BankOutcomes = { ...data.bank };
  for (const entry of result.results) {
    if (entry.bankId === undefined || entry.outcome === 'blank') continue;
    const current = bank[entry.bankId] ?? { right: 0, wrong: 0 };
    bank[entry.bankId] =
      entry.outcome === 'correct'
        ? { ...current, right: current.right + 1 }
        : { ...current, wrong: current.wrong + 1 };
  }

  write({ ...data, exams: [...data.exams, record].slice(-MAX_EXAMS), bank });
}

export function markStudied(topicId: TopicId): void {
  const data = getProgress();
  if (data.studied.includes(topicId)) return;
  write({ ...data, studied: [...data.studied, topicId] });
}

export function resetProgress(): void {
  storage.remove(KEY);
  emit();
}

export interface Stats {
  examsTaken: number;
  /** Miglior voto in trentesimi, se esiste almeno una prova completa. */
  best: number | null;
  /** Media dei voti in trentesimi, arrotondata. */
  average: number | null;
  studiedCount: number;
  lodi: number;
}

export function computeStats(data: ProgressData = getProgress()): Stats {
  const graded = data.exams.filter(
    (exam): exam is ExamRecord & { score30: number } => exam.score30 !== undefined,
  );

  return {
    examsTaken: data.exams.length,
    best: graded.length ? Math.max(...graded.map((exam) => exam.score30)) : null,
    average: graded.length
      ? Math.round(graded.reduce((sum, exam) => sum + exam.score30, 0) / graded.length)
      : null,
    studiedCount: data.studied.length,
    lodi: graded.filter((exam) => exam.lode).length,
  };
}

/** Si ri-renderizza quando i progressi cambiano. */
export function useProgress(): ProgressData {
  const [data, setData] = useState<ProgressData>(getProgress);

  useEffect(() => {
    const listener = (): void => setData(getProgress());
    listeners.add(listener);
    // Un'altra scheda potrebbe aver aggiornato i progressi.
    window.addEventListener('storage', listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', listener);
    };
  }, []);

  return data;
}
