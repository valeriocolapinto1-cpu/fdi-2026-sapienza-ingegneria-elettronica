import { mcq } from './mcq';
import { open } from './open';
import { asmWrite } from './asmWrite';
import { topics } from './topics';
import { figures } from './figures';
import { traps } from './traps';
import { links } from './links';
import type { Topic, TopicId, Trap } from './types';

export { mcq, open, asmWrite, topics, figures, traps, links };
export type * from './types';

/** Soglie minime richieste dalla specifica dei contenuti. */
const MINIMUMS = {
  mcq: 40,
  open: 12,
  asmWrite: 2,
  topics: 9,
  figures: 9,
  traps: 5,
  links: 6,
} as const;

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

/**
 * Controlli di integrità sul content layer. Ritorna la lista dei problemi
 * (vuota se tutto a posto) invece di lanciare: i test la asseriscono e in dev
 * viene stampata in console, così un refuso in una domanda si vede subito
 * senza far crashare l'app.
 */
export function validateContent(): string[] {
  const problems: string[] = [];

  // — conteggi minimi —
  const banks = { mcq, open, asmWrite, topics, figures, traps, links };
  for (const [name, min] of Object.entries(MINIMUMS)) {
    const size = banks[name as keyof typeof banks].length;
    if (size < min) problems.push(`banca "${name}": ${size} voci, ne servono almeno ${min}`);
  }

  // — id univoci dentro ogni banca —
  for (const [name, bank] of Object.entries(banks)) {
    const dupes = duplicates(bank.map((item) => item.id));
    if (dupes.length) problems.push(`banca "${name}": id duplicati → ${dupes.join(', ')}`);
  }

  // — ogni voce d'esame cita Hamacher —
  for (const item of [...mcq, ...open, ...asmWrite, ...topics]) {
    if (!item.ref.trim()) problems.push(`"${item.id}": riferimento Hamacher mancante`);
  }

  // — crocette ben formate —
  for (const item of mcq) {
    if (item.options.length !== 4) {
      problems.push(`"${item.id}": ${item.options.length} alternative, devono essere 4`);
    }
    if (item.correct < 0 || item.correct >= item.options.length) {
      problems.push(`"${item.id}": indice della risposta esatta (${item.correct}) fuori range`);
    }
    if (new Set(item.options).size !== item.options.length) {
      problems.push(`"${item.id}": alternative duplicate`);
    }
    if (!item.q.trim()) problems.push(`"${item.id}": testo vuoto`);
  }

  // — risposte modello presenti —
  for (const item of [...open, ...asmWrite]) {
    if (!item.model.trim()) problems.push(`"${item.id}": risposta modello mancante`);
  }

  // — le trappole richiamate dai moduli esistono davvero —
  const trapIds = new Set(traps.map((trap) => trap.id));
  for (const topic of topics) {
    for (const id of topic.trapIds) {
      if (!trapIds.has(id)) problems.push(`modulo "${topic.id}": trappola sconosciuta "${id}"`);
    }
  }

  return problems;
}

/** Trappole di un modulo, risolte contro la banca. */
export function trapsForTopic(topic: Topic): Trap[] {
  return topic.trapIds
    .map((id) => traps.find((trap) => trap.id === id))
    .filter((trap): trap is Trap => trap !== undefined);
}

export function topicById(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}

/** Titoli dei moduli, per etichettare un quesito con la sua area. */
export const TOPIC_TITLES: Record<TopicId, string> = Object.fromEntries(
  topics.map((topic) => [topic.id, topic.title]),
) as Record<TopicId, string>;

if (import.meta.env.DEV) {
  const problems = validateContent();
  if (problems.length) {
    console.warn(`[content] ${problems.length} problemi:\n- ${problems.join('\n- ')}`);
  }
}
