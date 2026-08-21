import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * I test dello store girano su un `localStorage` finto, ricreando il modulo a
 * ogni caso: `progress.ts` cattura lo storage al momento dell'import, quindi
 * va reimportato dopo aver piantato il globale.
 */
function withStorage(seed?: unknown): Map<string, string> {
  const backing = new Map<string, string>();
  if (seed !== undefined) backing.set('aefin.v1', JSON.stringify(seed));
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => backing.get(key) ?? null,
      setItem: (key: string, value: string) => void backing.set(key, value),
      removeItem: (key: string) => void backing.delete(key),
    },
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  });
  return backing;
}

async function load(): Promise<typeof import('./progress')> {
  vi.resetModules();
  return import('./progress');
}

describe('carriera di studio', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('aprire un modulo non lo segna come studiato', async () => {
    withStorage();
    const { markVisited, getProgress, isStudied } = await load();

    markVisited('bin');
    const data = getProgress();

    expect(data.visited).toContain('bin');
    expect(isStudied(data, 'bin')).toBe(false);
  });

  it('la spunta si mette, si toglie e ricorda la data', async () => {
    withStorage();
    const { setStudied, toggleStudied, getProgress, isStudied } = await load();

    setStudied('mem', true, 1_700_000_000_000);
    expect(getProgress().done.mem).toBe(1_700_000_000_000);
    expect(isStudied(getProgress(), 'mem')).toBe(true);

    toggleStudied('mem');
    expect(isStudied(getProgress(), 'mem')).toBe(false);
    expect(getProgress().done.mem).toBeUndefined();

    toggleStudied('mem');
    expect(isStudied(getProgress(), 'mem')).toBe(true);
  });

  it('segnare in blocco non riscrive la data di chi era già segnato', async () => {
    withStorage();
    const { setStudied, setStudiedMany, getProgress } = await load();

    setStudied('bin', true, 111);
    setStudiedMany(['bin', 'bool', 'comb'], true);

    const { done } = getProgress();
    expect(done.bin, 'la data originale va conservata').toBe(111);
    expect(done.bool).toBeDefined();
    expect(done.comb).toBeDefined();

    setStudiedMany(['bin', 'bool'], false);
    expect(getProgress().done.bin).toBeUndefined();
    expect(getProgress().done.comb).toBeDefined();
  });

  it('azzerare la carriera lascia intatto lo storico delle prove', async () => {
    withStorage();
    const { setStudiedMany, recordExam, resetCareer, getProgress } = await load();

    setStudiedMany(['bin', 'bool'], true);
    recordExam({
      examId: 'x',
      mode: 'full',
      finishedAt: 1,
      results: [],
      earned: 30,
      total: 30,
      score30: 30,
      lode: true,
      percent: 100,
    });

    resetCareer();
    const data = getProgress();
    expect(Object.keys(data.done)).toHaveLength(0);
    expect(data.exams, 'le prove non si toccano').toHaveLength(1);
  });

  it('i dati della versione 1 diventano «aperti», non «studiati»', async () => {
    // Nella v1 il campo si chiamava `studied` ma veniva riempito
    // automaticamente all'apertura: interpretarlo come una carriera già fatta
    // sarebbe una bugia.
    withStorage({
      version: 1,
      exams: [{ mode: 'quick', percent: 80, lode: false, earned: 8, total: 10, at: 5 }],
      studied: ['bin', 'bool'],
      bank: { 'mcq-1': { right: 2, wrong: 0 } },
    });
    const { getProgress, computeStats } = await load();

    const data = getProgress();
    expect(data.version).toBe(2);
    expect(data.visited).toEqual(['bin', 'bool']);
    expect(Object.keys(data.done)).toHaveLength(0);
    // Il resto sopravvive alla migrazione.
    expect(data.exams).toHaveLength(1);
    expect(data.bank['mcq-1']).toEqual({ right: 2, wrong: 0 });

    const stats = computeStats(data);
    expect(stats.studiedCount).toBe(0);
    expect(stats.visitedCount).toBe(2);
  });

  it('dati di una versione sconosciuta non fanno esplodere nulla', async () => {
    withStorage({ version: 99, garbage: true });
    const { getProgress } = await load();

    const data = getProgress();
    expect(data.version).toBe(2);
    expect(data.exams).toEqual([]);
    expect(data.done).toEqual({});
  });
});
