/**
 * Tipi del CONTENT LAYER.
 *
 * Le banche dati sono dati puri: nessun import dal motore, nessun accesso al
 * DOM. Aggiungere una domanda significa aggiungere un oggetto a un array in
 * questa cartella — non serve toccare il codice.
 *
 * `ref` è obbligatorio ovunque: è il tipo stesso a garantire il requisito
 * «ogni quesito e ogni scheda cita Hamacher».
 */

/** Rimando al testo, es. "Hamacher cap. 8" o "Hamacher App. A". */
export type HamacherRef = string;

/** Aree del programma. Servono anche a comporre i drill per argomento. */
export type TopicId =
  | 'bin' // numeri binari, basi, complemento a 2
  | 'bool' // algebra di Boole, porte, algebra degli insiemi
  | 'comb' // reti combinatorie notevoli: decoder, MUX, tri-state
  | 'karnaugh' // sintesi e minimizzazione
  | 'arith' // aritmetica hardware: sommatori, moltiplicazione
  | 'ff' // circuiti sequenziali, flip-flop, registri, contatori
  | 'tech' // ritardo di propagazione, CMOS, PLA/FPGA
  | 'cpu' // datapath e unità di controllo
  | 'isa' // RISC/CISC, assembly, indirizzamento
  | 'irq' // interruzioni ed eccezioni
  | 'io' // I/O, DMA, bus e standard
  | 'pipe' // pipeline e prestazioni
  | 'mem' // gerarchia di memoria e cache
  | 'vm' // memoria virtuale e TLB
  | 'ieee'; // virgola mobile

/** Crocetta a risposta singola. */
export interface McqItem {
  id: string;
  topic: TopicId;
  /** Testo del quesito; può contenere markup inline (<b>, <code>). */
  q: string;
  /** Le alternative, nell'ordine d'autore: il motore le rimescola. */
  options: string[];
  /** Indice della risposta esatta dentro `options`. */
  correct: number;
  ref: HamacherRef;
}

/** Domanda aperta di teoria, con risposta modello per l'autovalutazione. */
export interface OpenItem {
  id: string;
  topic: TopicId;
  q: string;
  /** Risposta modello; può contenere markup inline. */
  model: string;
  ref: HamacherRef;
}

/** Esercizio «scrivi un programma», valutato dallo studente. */
export interface AsmWriteItem {
  id: string;
  q: string;
  /** Soluzione modello, tipicamente un blocco <pre>. */
  model: string;
  ref: HamacherRef;
}

/** Scheda di studio. */
export interface Topic {
  id: TopicId;
  /** Titolo della scheda. */
  title: string;
  /** Riga di sintesi mostrata sulla card. */
  blurb: string;
  /** Corpo della teoria in HTML (riscritto in forma originale). */
  body: string;
  ref: HamacherRef;
  /** Trappole collegate, risolte contro la banca `traps`. */
  trapIds: string[];
}

/** Figura di Hamacher che l'esame può chiedere di completare. */
export interface Figure {
  id: string;
  /** Numero della figura, es. "fig. 8.16". */
  code: string;
  /** Che cosa rappresenta. */
  desc: string;
  /**
   * Schema ridisegnato corrispondente, se esiste (`content/diagrams.ts`).
   * Quando c'è, i Riferimenti mostrano il disegno invece del solo codice e
   * offrono di esercitarsi a completarlo.
   */
  diagramId?: string;
}

/**
 * «Trappola» del docente. Sono percezioni raccolte dagli studenti: `status`
 * tiene esplicito che vanno verificate, come chiede la specifica.
 */
export interface Trap {
  id: string;
  title: string;
  body: string;
  status: 'verificata' | 'da-verificare';
}

/** Voce dell'elenco testi e risorse. */
export interface LinkItem {
  id: string;
  label: string;
  /** Assente per i testi cartacei. */
  url?: string;
  note: string;
  kind: 'testo' | 'regolamento' | 'risorsa';
}
