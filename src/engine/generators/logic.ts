import { minimalCover, sopToString, varNames, type Implicant } from '../boolean';
import { pick, randInt, shuffle, type Rng } from '../rng';
import type { McQuestion, SelfQuestion } from '../types';
import { makeChoices, questionId, type GenCtx } from './context';

/** Uscite nell'ordine AB = 00, 01, 10, 11. */
const GATES = {
  AND: [0, 0, 0, 1],
  OR: [0, 1, 1, 1],
  NAND: [1, 1, 1, 0],
  NOR: [1, 0, 0, 0],
  XOR: [0, 1, 1, 0],
  XNOR: [1, 0, 0, 1],
} as const satisfies Record<string, readonly (0 | 1)[]>;

const GATE_NAMES = Object.keys(GATES) as (keyof typeof GATES)[];
const INPUTS = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
] as const;

/** Data una tabella di verità a 2 ingressi, riconosci la porta. */
export function genGate(ctx: GenCtx): McQuestion {
  const name = pick(ctx.rng, GATE_NAMES);
  const table = GATES[name];

  const { options, correct } = makeChoices(
    ctx.rng,
    name,
    GATE_NAMES.filter((other) => other !== name),
  );

  return {
    id: questionId(ctx),
    kind: 'mc',
    cat: 'Riconoscimento porta',
    points: ctx.points,
    q: 'Quale porta logica realizza questa tabella di verità?',
    topic: 'bool',
    ref: 'Hamacher App. A',
    payload: {
      type: 'truthTable',
      vars: ['A', 'B'],
      rows: INPUTS.map((inputs, index) => ({
        in: [...inputs],
        out: table[index] as 0 | 1,
      })),
    },
    options,
    correct,
  };
}

/** Cubo casuale che fissa `fixed` delle `vars` variabili. */
function randomCube(rng: Rng, vars: number, fixed: number): Implicant {
  const positions = shuffle(
    rng,
    Array.from({ length: vars }, (_, i) => i),
  ).slice(0, fixed);

  let mask = 0;
  let bits = 0;
  for (const position of positions) {
    const bit = 1 << position;
    mask |= bit;
    if (rng() < 0.5) bits |= bit;
  }
  return { mask, bits };
}

/**
 * Sintesi di rete combinatoria a 3 o 4 variabili.
 *
 * La funzione è campionata da 1–2 cubi casuali — così esce qualcosa di
 * strutturato invece che rumore — ma la **soluzione modello non è la SOP di
 * partenza**: è ricalcolata con `minimalCover()`, il minimizzatore esatto.
 *
 * È la correzione del bug del prototipo, dove gli implicanti estratti a caso
 * potevano assorbirsi (`A + A·B̄`) e la «soluzione» mostrata era corretta ma
 * non minima — esattamente l'errore che l'esame penalizza. Qui la minimalità
 * è garantita per costruzione, indifferenze comprese.
 */
export function genKarnaugh(ctx: GenCtx): SelfQuestion {
  const vars = pick(ctx.rng, [3, 4] as const);
  const cells = 1 << vars;

  let onSet = new Set<number>();
  let dontCares = new Set<number>();

  // Ricampiona finché la funzione non è banale (mai tutta 0 o tutta 1).
  for (let attempt = 0; attempt < 50; attempt++) {
    const cubes = Array.from({ length: randInt(ctx.rng, 1, 2) }, () =>
      randomCube(ctx.rng, vars, randInt(ctx.rng, 1, vars - 1)),
    );

    const candidate = new Set<number>();
    for (let m = 0; m < cells; m++) {
      if (cubes.some((cube) => (m & cube.mask) === (cube.bits & cube.mask))) candidate.add(m);
    }
    if (candidate.size === 0 || candidate.size === cells) continue;

    // A 4 variabili si introducono alcune indifferenze, prese fra le celle a 0.
    const zeros = Array.from({ length: cells }, (_, m) => m).filter((m) => !candidate.has(m));
    const howMany = vars === 4 ? Math.min(randInt(ctx.rng, 1, 3), zeros.length - 1) : 0;

    onSet = candidate;
    dontCares = new Set(shuffle(ctx.rng, zeros).slice(0, Math.max(0, howMany)));
    break;
  }

  const cover = minimalCover(onSet, dontCares, vars);
  const names = varNames(vars);
  const minterms = [...onSet].sort((a, b) => a - b);
  const cares = [...dontCares].sort((a, b) => a - b);

  const rows = Array.from({ length: cells }, (_, m) => ({
    in: names.map((_, i) => (m >> (vars - 1 - i)) & 1),
    out: (onSet.has(m) ? 1 : dontCares.has(m) ? 'x' : 0) as 0 | 1 | 'x',
  }));

  const dontCareNote = cares.length
    ? ' Le celle marcate <code>x</code> sono indifferenze: usale per allargare i gruppi solo dove conviene.'
    : '';

  return {
    id: questionId(ctx),
    kind: 'self',
    cat: 'Sintesi reti combinatorie',
    points: ctx.points,
    q: `Minimizza con Karnaugh la funzione <code>Y(${names.join(',')})</code> e disegna il circuito.${dontCareNote}`,
    topic: 'karnaugh',
    ref: 'Hamacher App. A',
    payload: { type: 'kmap', vars: names, rows, minterms, dontCares: cares },
    model:
      `Una SOP minima è: <b>Y = ${sopToString(cover, vars)}</b> ` +
      `(${cover.length} termin${cover.length === 1 ? 'e' : 'i'}). ` +
      '<br><span style="color:var(--color-muted);font-size:13px">Forme equivalenti sono ' +
      'accettabili se coprono esattamente gli stessi mintermini con lo stesso numero di ' +
      'termini e letterali. Ricorda di scomporre in porte a 2 ingressi nel disegno.</span>',
  };
}
