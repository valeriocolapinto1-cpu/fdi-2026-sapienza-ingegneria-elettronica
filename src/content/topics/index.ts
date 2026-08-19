import type { Topic } from '../types';

import { bin } from './bin';
import { bool } from './bool';
import { comb } from './comb';
import { karnaugh } from './karnaugh';
import { arith } from './arith';
import { ff } from './ff';
import { tech } from './tech';
import { cpu } from './cpu';
import { isa } from './isa';
import { irq } from './irq';
import { io } from './io';
import { pipe } from './pipe';
import { mem } from './mem';
import { vm } from './vm';
import { ieee } from './ieee';

/**
 * Moduli di studio, uno per file in questa cartella.
 *
 * L'ordine è **pedagogico**, non alfabetico, ed è quello in cui conviene
 * studiare: dai numeri alla logica, dalla logica alle reti, dalle reti al
 * processore, dal processore alla memoria.
 *
 * PER AGGIUNGERE UN MODULO: crea il file qui accanto, aggiungi il suo id a
 * `TopicId` in `../types.ts` e inseriscilo nell'elenco al punto giusto. I test
 * pretendono poi almeno tre crocette e una domanda aperta sull'argomento.
 */
export const topics: Topic[] = [
  bin,
  bool,
  comb,
  karnaugh,
  arith,
  ff,
  tech,
  cpu,
  isa,
  irq,
  io,
  pipe,
  mem,
  vm,
  ieee,
];
