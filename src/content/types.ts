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
  | 'ieee' // virgola mobile
  | 'sw' // dal codice sorgente all'eseguibile, ruolo del sistema operativo
  | 'perf'; // prestazioni, legge di Amdahl, parallelismo

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

/**
 * Domanda di autoverifica in fondo a un modulo.
 *
 * Non è una crocetta: è la domanda che ti fai da solo dopo aver letto, con la
 * risposta nascosta finché non hai provato a rispondere. Serve a scoprire se
 * hai capito o se hai solo riconosciuto il testo.
 */
export interface TopicCheck {
  q: string;
  a: string;
}

/**
 * Esercizio svolto in fondo a un modulo.
 *
 * Non è un quesito d'esame generato dal motore: è un esercizio **scritto**,
 * con il suo svolgimento passo per passo. Serve a imparare il procedimento,
 * non a essere valutati — per la valutazione c'è il simulatore.
 *
 * `hint` esiste perché guardare subito la soluzione non insegna niente: la
 * spinta iniziale permette di riprovare da soli prima di arrendersi.
 */
export interface TopicExercise {
  id: string;
  /** Testo, come lo troveresti sul foglio. */
  q: string;
  /** Da dove si comincia, senza dare la risposta. */
  hint: string;
  /** Svolgimento completo, passo per passo. */
  solution: string;
  /** `base` = per capire il meccanismo; `esame` = difficoltà e formato della prova. */
  level: 'base' | 'esame';
}

/** Scheda di studio. */
export interface Topic {
  id: TopicId;
  /** Titolo della scheda. */
  title: string;
  /** Riga di sintesi mostrata sulla card. */
  blurb: string;
  /**
   * «In due minuti»: i punti che devono restare in testa dopo la lettura.
   * Sono anche il ripasso dell'ultimo giorno, quando non c'è tempo di
   * rileggere tutto.
   */
  summary: string[];
  /** Corpo della teoria in HTML (riscritto in forma originale). */
  body: string;
  /** Domande di controllo, con risposta a scomparsa. */
  checks: TopicCheck[];
  /** Esercizi svolti: si prova, si chiede un aiuto, si confronta. */
  exercises: TopicExercise[];
  ref: HamacherRef;
  /** Trappole collegate, risolte contro la banca `traps`. */
  trapIds: string[];
  /** Moduli che conviene aver letto prima di questo. */
  prereq?: TopicId[];
  /** Schemi di `diagrams.ts` che illustrano il modulo. */
  diagramIds?: string[];
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
