import type { LinkItem } from './types';

export const links: LinkItem[] = [
  {
    id: 'link-hamacher',
    label: "C. Hamacher — Introduzione all'Architettura dei Calcolatori (McGraw Hill, 2013)",
    note: 'Testo principale del modulo',
    kind: 'testo',
  },
  {
    id: 'link-tanenbaum',
    label: 'A. Tanenbaum — Architettura dei Calcolatori (Pearson, 2013)',
    note: 'Testo integrativo',
    kind: 'testo',
  },
  {
    id: 'link-napoli',
    label: 'Sito del prof. Napoli',
    url: 'https://cnapoli.diag.uniroma1.it',
    note: 'Teaching · Exams · Calendar',
    kind: 'risorsa',
  },
  {
    id: 'link-regolamento',
    label: 'Regolamento della prova scritta',
    url: 'https://sites.google.com/diag.uniroma1.it/napoli/teaching/exams/em-fin',
    note: 'Struttura e punteggi ufficiali',
    kind: 'regolamento',
  },
  {
    id: 'link-slide',
    label: 'Slide riassuntive (Hamacher)',
    url: 'https://www.dmi.unict.it/tramonta/ae/',
    note: 'Prof. Tramontana — UniCT',
    kind: 'risorsa',
  },
  {
    id: 'link-prove',
    label: "Repo prove d'esame",
    url: 'https://github.com/sapienzastudentsnetwork/architettura-degli-elaboratori',
    note: 'Sapienza Students Network',
    kind: 'risorsa',
  },
];
