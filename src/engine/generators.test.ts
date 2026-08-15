import { describe, expect, it } from 'vitest';
import { simLoop, simMulCmp, simShift } from './asmSim';
import { coverCost, minimalCover, type Implicant } from './boolean';
import { buildExam, EXAM_MODES, questionCountFor, totalPointsFor } from './buildExam';
import { GENERATORS, type GeneratorId } from './generators';
import { normalizeFill } from './grade';
import { mulberry32 } from './rng';
import type { AsmLine, Exam, McQuestion, Question } from './types';

/** Genera N quesiti con un generatore, su semi diversi. */
function sample(gen: GeneratorId, count: number): Question[] {
  return Array.from({ length: count }, (_, i) => {
    const rng = mulberry32(1000 + i);
    return GENERATORS[gen]({ rng, points: 2, used: new Set(), seq: 1 });
  });
}

const ALL_GENERATORS = Object.keys(GENERATORS) as GeneratorId[];

describe('invarianti comuni a tutti i generatori', () => {
  it.each(ALL_GENERATORS)('«%s» produce quesiti ben formati', (gen) => {
    for (const question of sample(gen, 120)) {
      expect(question.q.trim()).not.toBe('');
      expect(question.ref).toMatch(/Hamacher/);
      expect(question.points).toBeGreaterThan(0);

      if (question.kind === 'mc') {
        // Il bug del prototipo: opzioni collassate a 3, o distrattori
        // identici alla risposta esatta ma marcati come sbagliati.
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options).size).toBe(4);
        expect(question.correct).toBeGreaterThanOrEqual(0);
        expect(question.correct).toBeLessThan(4);
      }

      if (question.kind === 'fill') {
        expect(question.answer).not.toBe('');
        // La risposta attesa deve sopravvivere alla propria normalizzazione.
        expect(normalizeFill(question.answer, question.normalize)).toBe(question.answer);
      }

      if (question.kind === 'self') {
        expect(question.model.trim()).not.toBe('');
      }
    }
  });
});

describe('genMC', () => {
  it('fa seguire l’indice corretto alle opzioni rimescolate', () => {
    // La risposta esatta compare fra le opzioni e l'indice la individua.
    for (const question of sample('mc', 200) as McQuestion[]) {
      expect(question.options[question.correct]).toBeDefined();
      expect(question.bankId).toBeDefined();
    }
  });

  it('distribuisce la risposta esatta su tutte le posizioni', () => {
    // Con lo shuffle distorto del prototipo questa distribuzione era sbilanciata.
    const counts = [0, 0, 0, 0];
    for (const question of sample('mc', 800) as McQuestion[]) {
      counts[question.correct] = (counts[question.correct] ?? 0) + 1;
    }
    for (const count of counts) {
      expect(count).toBeGreaterThan(120); // ~200 attesi per posizione
    }
  });
});

describe('genGate', () => {
  const TABLES: Record<string, number[]> = {
    AND: [0, 0, 0, 1],
    OR: [0, 1, 1, 1],
    NAND: [1, 1, 1, 0],
    NOR: [1, 0, 0, 0],
    XOR: [0, 1, 1, 0],
    XNOR: [1, 0, 0, 1],
  };

  it('nomina la porta che realizza davvero la tabella mostrata', () => {
    for (const question of sample('gate', 200) as McQuestion[]) {
      expect(question.payload?.type).toBe('truthTable');
      if (question.payload?.type !== 'truthTable') continue;

      const shown = question.payload.rows.map((row) => row.out);
      const named = question.options[question.correct] as string;
      expect(TABLES[named], `porta sconosciuta: ${named}`).toEqual(shown);
    }
  });
});

describe('genAsmSnippet', () => {
  /** Rilegge i parametri dal listato mostrato e ri-esegue il programma. */
  function answerFromListing(lines: AsmLine[]): number {
    const text = lines.map((line) => line.text).join('\n');
    const num = (pattern: RegExp): number => {
      const match = text.match(pattern);
      if (!match?.[1]) throw new Error(`parametro non trovato: ${pattern} in\n${text}`);
      return Number(match[1]);
    };

    if (text.includes('Branch_if')) {
      return simLoop({
        start: num(/Move\s+R1,\s*#(-?\d+)/),
        step: num(/Sub\s+R1,\s*R1,\s*#(-?\d+)/),
      }).iterations;
    }
    if (text.includes('MUL')) {
      return simMulCmp({
        a: num(/MOV\s+R1,\s*#(-?\d+)/),
        b: num(/MOV\s+R2,\s*#(-?\d+)/),
        cmp: num(/CMP\s+R3,\s*#(-?\d+)/),
        add: num(/ADD\s+R3,\s*R3,\s*#(-?\d+)/),
      }).r3;
    }
    return simShift({
      value: num(/MOV\s+R1,\s*#(-?\d+)/),
      left: num(/LSL\s+R1,\s*R1,\s*#(-?\d+)/),
      right: num(/LSR\s+R1,\s*R1,\s*#(-?\d+)/),
    }).result;
  }

  it('la risposta esatta è quella che si ottiene eseguendo il codice mostrato', () => {
    for (const question of sample('asmSnippet', 300) as McQuestion[]) {
      expect(question.payload?.type).toBe('asm');
      if (question.payload?.type !== 'asm') continue;

      const simulated = answerFromListing(question.payload.lines);
      expect(Number(question.options[question.correct])).toBe(simulated);
    }
  });

  it('usa tutti e tre i template', () => {
    const seen = new Set<string>();
    for (const question of sample('asmSnippet', 200)) {
      if (question.payload?.type !== 'asm') continue;
      const text = question.payload.lines.map((line) => line.text).join(' ');
      seen.add(text.includes('Branch_if') ? 'loop' : text.includes('MUL') ? 'mulcmp' : 'shift');
    }
    expect([...seen].sort()).toEqual(['loop', 'mulcmp', 'shift']);
  });
});

describe('genKarnaugh', () => {
  it('mostra una funzione non banale, a 3 o 4 variabili', () => {
    const widths = new Set<number>();
    for (const question of sample('karnaugh', 200)) {
      expect(question.payload?.type).toBe('kmap');
      if (question.payload?.type !== 'kmap') continue;

      const { vars, minterms, dontCares, rows } = question.payload;
      widths.add(vars.length);

      expect(minterms.length).toBeGreaterThan(0);
      expect(minterms.length).toBeLessThan(2 ** vars.length);
      expect(rows).toHaveLength(2 ** vars.length);

      // Le righe mostrate coincidono con on-set e indifferenze.
      rows.forEach((row, m) => {
        const expected = minterms.includes(m) ? 1 : dontCares.includes(m) ? 'x' : 0;
        expect(row.out, `riga ${m}`).toBe(expected);
      });
      // On-set e indifferenze sono insiemi disgiunti.
      expect(minterms.filter((m) => dontCares.includes(m))).toEqual([]);
    }
    expect([...widths].sort()).toEqual([3, 4]);
  });

  it('introduce indifferenze solo a 4 variabili', () => {
    let withDontCares = 0;
    for (const question of sample('karnaugh', 200)) {
      if (question.payload?.type !== 'kmap') continue;
      if (question.payload.vars.length === 3) {
        expect(question.payload.dontCares).toEqual([]);
      } else if (question.payload.dontCares.length > 0) {
        withDontCares++;
      }
    }
    expect(withDontCares).toBeGreaterThan(0);
  });

  it('la soluzione modello è una SOP MINIMA, non solo corretta', () => {
    // È il bug del prototipo: implicanti che si assorbivano davano
    // «Y = A + A·B̄», corretta ma non minima.
    for (const question of sample('karnaugh', 200)) {
      if (question.payload?.type !== 'kmap') continue;
      const { vars, minterms, dontCares } = question.payload;

      const cover: Implicant[] = minimalCover(
        new Set(minterms),
        new Set(dontCares),
        vars.length,
      );
      const cost = coverCost(cover, vars.length);

      // Il modello dichiara il numero di termini: deve essere quello minimo.
      const declared = question.kind === 'self' ? question.model.match(/\((\d+) termini\)/) : null;
      expect(declared?.[1], `modello senza conteggio: ${question.q}`).toBeDefined();
      expect(Number(declared?.[1])).toBe(cost.terms);
    }
  });
});

describe('buildExam', () => {
  it('la prova completa ha 12 quesiti e vale esattamente 30 punti', () => {
    for (let seed = 0; seed < 500; seed++) {
      const exam = buildExam('full', seed);
      expect(exam.questions, `seme ${seed}`).toHaveLength(12);
      expect(exam.totalPoints, `seme ${seed}`).toBe(30);
    }
  });

  it('rispetta il mix del formato reale', () => {
    const exam = buildExam('full', 7);
    const kinds = exam.questions.map((question) => question.kind);
    // 9 auto-corretti (crocette, CP2, porta, assembly) + 3 da svolgere.
    expect(kinds.filter((kind) => kind === 'self')).toHaveLength(3);
    expect(kinds.filter((kind) => kind !== 'self')).toHaveLength(9);
  });

  it.each(EXAM_MODES)('la modalità «%s» è coerente con il proprio blueprint', (mode) => {
    for (let seed = 0; seed < 60; seed++) {
      const exam = buildExam(mode, seed);
      expect(exam.questions).toHaveLength(questionCountFor(mode));
      expect(exam.totalPoints).toBe(totalPointsFor(mode));
      expect(new Set(exam.questions.map((question) => question.id)).size).toBe(
        exam.questions.length,
      );
    }
  });

  it('non ripete la stessa voce di banca nella stessa prova', () => {
    // Il prototipo poteva pescare due volte la stessa crocetta.
    for (let seed = 0; seed < 200; seed++) {
      const exam = buildExam('full', seed);
      const bankIds = exam.questions
        .map((question) => question.bankId)
        .filter((id): id is string => id !== undefined);
      expect(new Set(bankIds).size, `seme ${seed}`).toBe(bankIds.length);
    }
  });

  it('è riproducibile: stesso seme, stessa prova', () => {
    const strip = (exam: Exam): string =>
      JSON.stringify({ ...exam, createdAt: 0 });
    expect(strip(buildExam('full', 42))).toBe(strip(buildExam('full', 42)));
  });

  it('è rigenerabile: semi diversi, contenuti diversi', () => {
    const first = buildExam('full', 1).questions.map((question) => question.q).join();
    const second = buildExam('full', 2).questions.map((question) => question.q).join();
    expect(first).not.toBe(second);
  });

  it('usa ogni generatore registrato in almeno una modalità', () => {
    const used = new Set<string>();
    for (const mode of EXAM_MODES) {
      for (let seed = 0; seed < 30; seed++) {
        for (const question of buildExam(mode, seed).questions) used.add(question.cat);
      }
    }
    // 10 generatori, ma `asmWrite` e `open` condividono la logica di banca:
    // qui basta verificare che nessuna categoria attesa manchi all'appello.
    for (const cat of [
      'Crocetta',
      'Completamento',
      'Conversione',
      'Aritmetica CP2',
      'Range',
      'Riconoscimento porta',
      'Assembly · snippet',
      'Sintesi reti combinatorie',
      'Assembly · scrittura',
      'Domanda aperta',
    ]) {
      expect(used.has(cat), `categoria mai generata: ${cat}`).toBe(true);
    }
  });
});
