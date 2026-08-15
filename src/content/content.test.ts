import { describe, expect, it } from 'vitest';
import { asmWrite, figures, links, mcq, open, topics, traps, validateContent } from './index';

describe('content layer', () => {
  it('supera tutti i controlli di integrità', () => {
    // Se questo test fallisce, il messaggio elenca esattamente cosa correggere.
    expect(validateContent()).toEqual([]);
  });

  it('parte già popolato ai volumi richiesti', () => {
    expect(mcq.length).toBeGreaterThanOrEqual(90);
    expect(open.length).toBeGreaterThanOrEqual(19);
    expect(asmWrite.length).toBeGreaterThanOrEqual(2);
    expect(topics.length).toBeGreaterThanOrEqual(11);
    expect(figures.length).toBeGreaterThanOrEqual(9);
    expect(traps.length).toBeGreaterThanOrEqual(5);
    expect(links.length).toBeGreaterThanOrEqual(6);
  });

  it('ogni modulo ha una teoria sostanziosa, non un abbozzo', () => {
    // I moduli del prototipo stavano fra 390 e 1200 caratteri: troppo poco
    // per studiarci sopra. Questa soglia impedisce di tornare indietro.
    for (const topic of topics) {
      expect(topic.body.length, `modulo "${topic.id}" troppo scarno`).toBeGreaterThan(2000);
      // Almeno quattro sezioni: un modulo con un solo <h4> non è organizzato.
      expect(
        (topic.body.match(/<h4>/g) ?? []).length,
        `modulo "${topic.id}" con troppe poche sezioni`,
      ).toBeGreaterThanOrEqual(4);
    }
  });

  it('ogni argomento è coperto da almeno tre crocette', () => {
    // Un argomento senza domande non può uscire nei drill: sarebbe teoria morta.
    for (const topic of topics) {
      const count = mcq.filter((item) => item.topic === topic.id).length;
      expect(count, `argomento "${topic.id}" con sole ${count} crocette`).toBeGreaterThanOrEqual(3);
    }
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
