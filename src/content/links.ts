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
  /**
   * Le note di questi due dicono a che cosa servono, non che cosa contengono:
   * sono le pagine ufficiali del corso e nessuno di noi può garantire in loro
   * vece. Se dicono qualcosa di diverso da questo sito, vale quello che dicono
   * loro.
   */
  {
    id: 'link-napoli',
    label: 'Pagina del docente del corso',
    url: 'https://cnapoli.diag.uniroma1.it',
    note: 'La fonte ufficiale: parti da qui',
    kind: 'risorsa',
  },
  {
    id: 'link-regolamento',
    label: 'Regole della prova scritta',
    url: 'https://sites.google.com/diag.uniroma1.it/napoli/teaching/exams/em-fin',
    note: 'Da verificare qui: in caso di differenze vale questa pagina',
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
