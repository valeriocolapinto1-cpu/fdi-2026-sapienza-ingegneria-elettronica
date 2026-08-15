import type { Question } from '../types';
import type { GenCtx } from './context';
import { genAsmSnippet } from './assembly';
import { genGate, genKarnaugh } from './logic';
import { genArith, genCP2, genHex, genMaxRange } from './numbers';
import { genAsmWrite, genMC, genOpen } from './theory';

export { genAsmSnippet, genGate, genKarnaugh, genArith, genCP2, genHex, genMaxRange };
export { genAsmWrite, genMC, genOpen };
export { makeChoices, questionId, type GenCtx } from './context';

/**
 * Registro dei generatori: è il punto di estensione dell'app.
 *
 * Aggiungere un tipo di quesito (IEEE 754, decodifica di un float, …) vuol
 * dire scrivere una funzione `(ctx) => Question` e registrarla qui; da quel
 * momento può comparire in qualunque blueprint d'esame.
 */
export const GENERATORS = {
  mc: genMC,
  cp2: genCP2,
  arith: genArith,
  hex: genHex,
  maxRange: genMaxRange,
  gate: genGate,
  asmSnippet: genAsmSnippet,
  karnaugh: genKarnaugh,
  asmWrite: genAsmWrite,
  open: genOpen,
} as const satisfies Record<string, (ctx: GenCtx) => Question>;

export type GeneratorId = keyof typeof GENERATORS;
