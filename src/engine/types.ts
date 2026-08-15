import type { HamacherRef, TopicId } from '~/content/types';

export type { HamacherRef, TopicId };

/**
 * Tipi del motore d'esame.
 *
 * Ogni quesito è **serializzabile**: niente funzioni sugli oggetti, così una
 * prova può essere salvata, ricaricata o esportata in JSON (§14). È il motivo
 * per cui `normalize` è un'etichetta e non una funzione di normalizzazione.
 */

/** `mc` e `fill` sono auto-corretti; `self` si risolve su carta. */
export type QuestionKind = 'mc' | 'fill' | 'self';

/** Riga di uno snippet assembly: la UI colora l'etichetta, non il testo. */
export interface AsmLine {
  /** Etichetta di salto, es. "CICLO:". */
  label?: string;
  text: string;
  /** Commento in coda, reso con il colore dei commenti. */
  comment?: string;
}

/**
 * Dati strutturati per il rendering. Servono a tenere la logica di dominio
 * fuori dai componenti: la UI riceve una tabella o una mappa già calcolata e
 * si limita a disegnarla.
 */
export type QuestionPayload =
  | {
      type: 'truthTable';
      vars: string[];
      rows: { in: number[]; out: 0 | 1 }[];
    }
  | {
      type: 'kmap';
      vars: string[];
      /** Righe già pronte da disegnare, indifferenze incluse. */
      rows: { in: number[]; out: 0 | 1 | 'x' }[];
      /** Combinazioni con uscita 1. */
      minterms: number[];
      /** Combinazioni indifferenti (x). */
      dontCares: number[];
    }
  | { type: 'asm'; lines: AsmLine[] };

interface QuestionBase {
  id: string;
  kind: QuestionKind;
  /** Etichetta della categoria mostrata sopra al quesito. */
  cat: string;
  points: number;
  /** Testo del quesito; può contenere markup inline. */
  q: string;
  topic: TopicId;
  ref: HamacherRef;
  payload?: QuestionPayload;
  /**
   * Id della voce di banca da cui nasce il quesito, quando ne esiste una.
   * Aggancio per la ripetizione dilazionata (§14): permette di tracciare gli
   * esiti per domanda, non solo per esame.
   */
  bankId?: string;
}

export interface McQuestion extends QuestionBase {
  kind: 'mc';
  options: string[];
  /** Indice della risposta esatta in `options`. */
  correct: number;
  /** Spiegazione mostrata in fase di correzione. */
  hint?: string;
}

export interface FillQuestion extends QuestionBase {
  kind: 'fill';
  answer: string;
  /** Come normalizzare la risposta prima del confronto. */
  normalize: 'bin' | 'hex' | 'dec';
  placeholder?: string;
  hint?: string;
}

export interface SelfQuestion extends QuestionBase {
  kind: 'self';
  /** Soluzione modello rivelata dopo il tentativo. */
  model: string;
}

export type Question = McQuestion | FillQuestion | SelfQuestion;

export type ExamMode = 'full' | 'quick' | 'binary' | 'logic';

export interface Exam {
  id: string;
  mode: ExamMode;
  /** Seme del generatore: rigenerare con lo stesso seme dà la stessa prova. */
  seed: number;
  createdAt: number;
  questions: Question[];
  /** Somma dei punti. Per `full` vale esattamente 30. */
  totalPoints: number;
}

/** Autovalutazione di un quesito `self`: pieno, parziale, niente. */
export type SelfGrade = 1 | 0.5 | 0;

export type Answer =
  | { kind: 'mc'; choice: number | null }
  | { kind: 'fill'; text: string }
  | { kind: 'self'; grade: SelfGrade | null };

export type Outcome = 'correct' | 'partial' | 'wrong' | 'blank';

export interface QuestionResult {
  id: string;
  bankId?: string;
  outcome: Outcome;
  earned: number;
  max: number;
}

export interface ExamResult {
  examId: string;
  mode: ExamMode;
  finishedAt: number;
  results: QuestionResult[];
  earned: number;
  total: number;
  /** Voto in trentesimi. Presente solo per la modalità `full`. */
  score30?: number;
  /** Lode: solo a punteggio pieno. */
  lode: boolean;
  percent: number;
}
