import { describe, expect, it } from 'vitest';
import { asmWrite, figures, links, mcq, open, topics, traps, validateContent } from './index';

describe('content layer', () => {
  it('supera tutti i controlli di integrità', () => {
    // Se questo test fallisce, il messaggio elenca esattamente cosa correggere.
    expect(validateContent()).toEqual([]);
  });

  it('parte già popolato ai volumi richiesti', () => {
    expect(mcq.length).toBeGreaterThanOrEqual(49);
    expect(open.length).toBeGreaterThanOrEqual(12);
    expect(asmWrite.length).toBeGreaterThanOrEqual(2);
    expect(topics.length).toBeGreaterThanOrEqual(9);
    expect(figures.length).toBeGreaterThanOrEqual(9);
    expect(traps.length).toBeGreaterThanOrEqual(5);
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  it('cita Hamacher su ogni quesito e ogni scheda', () => {
    for (const item of [...mcq, ...open, ...asmWrite, ...topics]) {
      expect(item.ref, `manca il riferimento su ${item.id}`).toMatch(/Hamacher/);
    }
  });

  it('marca le trappole come percezioni da verificare', () => {
    // La specifica chiede che non passino per regole confermate.
    expect(traps.every((trap) => trap.status === 'da-verificare')).toBe(true);
  });

  it('copre con le domande aperte tutti i moduli tranne IEEE 754', () => {
    const covered = new Set(open.map((item) => item.topic));
    for (const topic of topics) {
      if (topic.id === 'ieee') continue;
      expect(covered.has(topic.id), `nessuna domanda aperta per "${topic.id}"`).toBe(true);
    }
  });
});
