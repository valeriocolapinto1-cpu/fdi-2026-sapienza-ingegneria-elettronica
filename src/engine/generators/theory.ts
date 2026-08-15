import { asmWrite, mcq, open } from '~/content';
import { pickUnused, shuffle } from '../rng';
import type { McQuestion, SelfQuestion } from '../types';
import { questionId, type GenCtx } from './context';

/** Crocetta pescata dalla banca, con le alternative rimescolate. */
export function genMC(ctx: GenCtx): McQuestion {
  const item = pickUnused(ctx.rng, mcq, ctx.used);

  // Si rimescolano gli indici, così l'indice della risposta esatta segue le
  // opzioni invece di essere ricalcolato per confronto di testo.
  const order = shuffle(
    ctx.rng,
    item.options.map((_, index) => index),
  );

  return {
    id: questionId(ctx),
    kind: 'mc',
    cat: 'Crocetta',
    points: ctx.points,
    q: item.q,
    topic: item.topic,
    ref: item.ref,
    bankId: item.id,
    options: order.map((index) => item.options[index] as string),
    correct: order.indexOf(item.correct),
  };
}

/** Domanda aperta di teoria, con risposta modello. */
export function genOpen(ctx: GenCtx): SelfQuestion {
  const item = pickUnused(ctx.rng, open, ctx.used);
  return {
    id: questionId(ctx),
    kind: 'self',
    cat: 'Domanda aperta',
    points: ctx.points,
    q: item.q,
    topic: item.topic,
    ref: item.ref,
    bankId: item.id,
    model: item.model,
  };
}

/** Esercizio «scrivi un programma», da svolgere su carta. */
export function genAsmWrite(ctx: GenCtx): SelfQuestion {
  const item = pickUnused(ctx.rng, asmWrite, ctx.used);
  return {
    id: questionId(ctx),
    kind: 'self',
    cat: 'Assembly · scrittura',
    points: ctx.points,
    q: item.q,
    topic: 'isa',
    ref: item.ref,
    bankId: item.id,
    model: item.model,
  };
}
