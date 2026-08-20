import { describe, expect, it } from 'vitest';
import { asmWrite, figures, links, mcq, open, topics, traps, validateContent } from './index';
import { definitions } from './definitions';
import { diagrams, diagramById } from './diagrams';
import { outline } from './outline';

describe('content layer', () => {
  it('supera tutti i controlli di integrità', () => {
    // Se questo test fallisce, il messaggio elenca esattamente cosa correggere.
    expect(validateContent()).toEqual([]);
  });

  it('parte già popolato ai volumi richiesti', () => {
    expect(mcq.length).toBeGreaterThanOrEqual(90);
    expect(open.length).toBeGreaterThanOrEqual(19);
    expect(asmWrite.length).toBeGreaterThanOrEqual(2);
    expect(topics.length).toBeGreaterThanOrEqual(17);
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

  it('ogni modulo ha il ripasso «in due minuti» e le domande di autoverifica', () => {
    for (const topic of topics) {
      // Il ripasso dell'ultimo giorno: se è troppo corto non riassume, se è
      // troppo lungo non è un ripasso.
      expect(topic.summary.length, `modulo "${topic.id}"`).toBeGreaterThanOrEqual(4);
      expect(topic.summary.length, `modulo "${topic.id}"`).toBeLessThanOrEqual(8);
      for (const line of topic.summary) {
        expect(line.trim().length, `${topic.id}: riga di ripasso troppo scarna`).toBeGreaterThan(40);
      }

      expect(topic.checks.length, `modulo "${topic.id}"`).toBeGreaterThanOrEqual(3);
      for (const check of topic.checks) {
        expect(check.q.trim(), topic.id).not.toBe('');
        // Una risposta di una riga non insegna niente: deve spiegare il perché.
        expect(check.a.trim().length, `${topic.id}: risposta troppo breve`).toBeGreaterThan(80);
      }
    }
  });

  it('ogni modulo ha un esempio svolto e gli errori tipici', () => {
    // Un esame è fatto di esercizi: la teoria senza un esempio con i numeri
    // non insegna a farli, e l'elenco degli errori tipici è ciò che separa
    // «ho capito» da «l'ho preso».
    for (const topic of topics) {
      const titles = outline(topic.body).map((section) => section.title.toLowerCase());
      expect(
        titles.some((title) => title.includes('esempio')),
        `modulo "${topic.id}": nessun esempio svolto`,
      ).toBe(true);
      expect(
        titles.some((title) => title.includes('errori tipici')),
        `modulo "${topic.id}": nessuna sezione sugli errori tipici`,
      ).toBe(true);
    }
  });

  it('i rimandi fra moduli e schemi puntano a qualcosa che esiste', () => {
    const ids = new Set(topics.map((topic) => topic.id));
    for (const topic of topics) {
      for (const id of topic.prereq ?? []) {
        expect(ids.has(id), `modulo "${topic.id}": prerequisito sconosciuto "${id}"`).toBe(true);
        expect(id, `modulo "${topic.id}" è prerequisito di se stesso`).not.toBe(topic.id);
      }
      for (const id of topic.diagramIds ?? []) {
        expect(diagramById(id), `modulo "${topic.id}": schema sconosciuto "${id}"`).toBeDefined();
      }
    }
  });

  it('i prerequisiti vengono prima nell’ordine di studio', () => {
    // L'ordine dell'elenco è pedagogico: un modulo non può dipendere da uno
    // che si studia dopo, altrimenti il percorso consigliato è incoerente.
    const position = new Map(topics.map((topic, index) => [topic.id, index]));
    for (const topic of topics) {
      for (const id of topic.prereq ?? []) {
        expect(
          position.get(id)!,
          `"${topic.id}" dipende da "${id}", che però viene dopo`,
        ).toBeLessThan(position.get(topic.id)!);
      }
    }
  });

  it('le definizioni stanno in una frase e citano il testo', () => {
    expect(definitions.length).toBeGreaterThanOrEqual(50);
    expect(new Set(definitions.map((item) => item.id)).size).toBe(definitions.length);
    const titles = new Set(topics.map((topic) => topic.id));
    for (const item of definitions) {
      expect(item.ref, `manca il riferimento su ${item.id}`).toMatch(/Hamacher/);
      expect(titles.has(item.topic), `argomento sconosciuto in ${item.id}`).toBe(true);
      // Se non sta in una frase non è una definizione: è un modulo di studio.
      expect(item.short.trim().length, item.id).toBeGreaterThan(20);
      expect(item.short.length, `${item.id}: troppo lunga per il foglio`).toBeLessThan(320);
    }
  });

  it('ogni schema è completabile: slot distinti, dentro il riquadro, con distrattori', () => {
    expect(diagrams.length).toBeGreaterThanOrEqual(8);
    expect(new Set(diagrams.map((item) => item.id)).size).toBe(diagrams.length);

    for (const diagram of diagrams) {
      const ids = diagram.slots.map((slot) => slot.id);
      expect(new Set(ids).size, `${diagram.id}: id di slot duplicati`).toBe(ids.length);
      expect(diagram.slots.length, `${diagram.id}: troppo pochi slot`).toBeGreaterThanOrEqual(4);

      for (const slot of diagram.slots) {
        expect(slot.label.trim(), `${diagram.id}/${slot.id}`).not.toBe('');
        // Fuori dal viewBox l'etichetta finirebbe fuori dal disegno.
        expect(slot.x, `${diagram.id}/${slot.id}: x fuori riquadro`).toBeGreaterThanOrEqual(0);
        expect(slot.x, `${diagram.id}/${slot.id}: x fuori riquadro`).toBeLessThanOrEqual(diagram.width);
        expect(slot.y, `${diagram.id}/${slot.id}: y fuori riquadro`).toBeGreaterThanOrEqual(0);
        expect(slot.y, `${diagram.id}/${slot.id}: y fuori riquadro`).toBeLessThanOrEqual(diagram.height);
      }

      // Un distrattore uguale a un'etichetta giusta renderebbe il quesito
      // ambiguo: la stessa risposta sarebbe giusta e sbagliata insieme.
      const labels = new Set(diagram.slots.map((slot) => slot.label));
      for (const distractor of diagram.distractors) {
        expect(labels.has(distractor), `${diagram.id}: "${distractor}" è anche un'etichetta`).toBe(
          false,
        );
      }
      expect(diagram.distractors.length, `${diagram.id}: senza distrattori`).toBeGreaterThanOrEqual(2);
      expect(diagram.ref).toMatch(/Hamacher/);
    }
  });

  it('ogni figura che rimanda a uno schema lo trova davvero', () => {
    for (const figure of figures) {
      if (!figure.diagramId) continue;
      expect(diagramById(figure.diagramId), `figura ${figure.id}`).toBeDefined();
    }
  });

  it('copre con le domande aperte tutti i moduli tranne IEEE 754', () => {
    const covered = new Set(open.map((item) => item.topic));
    for (const topic of topics) {
      if (topic.id === 'ieee') continue;
      expect(covered.has(topic.id), `nessuna domanda aperta per "${topic.id}"`).toBe(true);
    }
  });
});
