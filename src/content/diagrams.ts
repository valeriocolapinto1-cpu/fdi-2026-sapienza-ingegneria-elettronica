import type { HamacherRef, TopicId } from './types';

/**
 * Schemi da completare.
 *
 * All'esame c'è sempre un «completare l'immagine»: si riceve un disegno con
 * alcune etichette mancanti e l'elenco di quelle da collocare. Qui ogni schema
 * è **ridisegnato in forma originale** — stessa struttura logica dello schema
 * di riferimento, tratto nostro — e le etichette sono dati, così lo stesso
 * disegno serve sia da figura sia da esercizio.
 *
 * Le coordinate sono nel sistema del `viewBox`: la UI le converte in
 * percentuali, quindi lo schema resta leggibile a qualunque larghezza.
 */
export interface DiagramSlot {
  id: string;
  /** Centro dell'etichetta, in coordinate viewBox. */
  x: number;
  y: number;
  /** L'etichetta giusta per questa posizione. */
  label: string;
}

export interface Diagram {
  id: string;
  title: string;
  topic: TopicId;
  ref: HamacherRef;
  width: number;
  height: number;
  /** Disegno di base, senza le etichette da indovinare. */
  svg: string;
  slots: DiagramSlot[];
  /** Etichette plausibili ma sbagliate, per non rendere il quiz una formalità. */
  distractors: string[];
}

/* Abbreviazioni per non ripetere gli attributi in ogni rettangolo. */
const B = 'class="dg-box"';
const L = 'class="dg-line"';
const A = 'class="dg-line" marker-end="url(#aefin-arrow)"';
const T = 'class="dg-text"';
/** Testo ancorato a sinistra: per le scritte di bordo. */
const TS = 'class="dg-text dg-start"';
const G = 'class="dg-group"';

export const diagrams: Diagram[] = [
  {
    id: 'unita-funzionali',
    title: 'Unità funzionali di un calcolatore',
    topic: 'cpu',
    ref: 'Hamacher cap. 1',
    width: 620,
    height: 330,
    slots: [
      { id: 'mem', x: 310, y: 45, label: 'Memoria' },
      { id: 'net', x: 310, y: 190, label: 'Rete di interconnessione' },
      { id: 'in', x: 90, y: 130, label: 'Ingresso' },
      { id: 'out', x: 90, y: 235, label: 'Uscita' },
      { id: 'alu', x: 530, y: 130, label: 'Aritmetica e logica' },
      { id: 'ctrl', x: 530, y: 235, label: 'Controllo' },
    ],
    distractors: ['Cache', 'Registri', 'Disco', 'Bus dati', 'Interruzioni'],
    svg: `
      <rect ${G} x="20" y="95" width="140" height="180" rx="8"/>
      <text ${T} x="90" y="292" font-size="12">I/O</text>
      <rect ${G} x="460" y="95" width="140" height="180" rx="8"/>
      <text ${T} x="530" y="292" font-size="12">Processore</text>

      <rect ${B} x="240" y="20" width="140" height="52" rx="6"/>
      <rect ${B} x="240" y="150" width="140" height="80" rx="6"/>
      <rect ${B} x="35" y="105" width="110" height="52" rx="6"/>
      <rect ${B} x="35" y="210" width="110" height="52" rx="6"/>
      <rect ${B} x="475" y="105" width="110" height="52" rx="6"/>
      <rect ${B} x="475" y="210" width="110" height="52" rx="6"/>

      <line ${L} x1="310" y1="72" x2="310" y2="150"/>
      <line ${L} x1="145" y1="190" x2="240" y2="190"/>
      <line ${L} x1="380" y1="190" x2="475" y2="190"/>
      <line ${L} x1="90" y1="157" x2="90" y2="210"/>
      <line ${L} x1="145" y1="131" x2="180" y2="131"/>
      <line ${L} x1="180" y1="131" x2="180" y2="236"/>
      <line ${L} x1="180" y1="236" x2="145" y2="236"/>
      <line ${L} x1="530" y1="157" x2="530" y2="210"/>`,
  },

  {
    id: 'processore-3bus',
    title: 'Processore CISC a tre bus',
    topic: 'cpu',
    ref: 'Hamacher cap. 5',
    width: 620,
    height: 400,
    slots: [
      { id: 'busa', x: 60, y: 22, label: 'Bus A' },
      { id: 'busb', x: 150, y: 22, label: 'Bus B' },
      { id: 'busc', x: 240, y: 22, label: 'Bus C' },
      { id: 'pc', x: 420, y: 62, label: 'PC' },
      { id: 'banco', x: 420, y: 132, label: 'Banco registri' },
      { id: 'alu', x: 420, y: 202, label: 'ALU' },
      { id: 'temp', x: 420, y: 262, label: 'Registri temporanei' },
      { id: 'ir', x: 420, y: 322, label: 'IR' },
      { id: 'iface', x: 420, y: 372, label: 'Interfaccia processore-memoria' },
    ],
    distractors: ['Cache', 'MAR', 'TLB', 'Generatore indirizzi', 'Controllo'],
    svg: `
      <line ${L} x1="60" y1="40" x2="60" y2="395"/>
      <line ${L} x1="150" y1="40" x2="150" y2="395"/>
      <line ${L} x1="240" y1="40" x2="240" y2="395"/>

      <rect ${B} x="300" y="42" width="240" height="40" rx="6"/>
      <rect ${B} x="300" y="112" width="240" height="40" rx="6"/>
      <path ${B} d="M320 182 h200 l-30 40 h-140 z"/>
      <rect ${B} x="300" y="242" width="240" height="40" rx="6"/>
      <rect ${B} x="300" y="302" width="240" height="40" rx="6"/>
      <rect ${B} x="300" y="352" width="240" height="40" rx="6"/>

      <line ${L} x1="60" y1="62" x2="300" y2="62"/>
      <line ${L} x1="150" y1="132" x2="300" y2="132"/>
      <line ${L} x1="240" y1="132" x2="300" y2="132"/>
      <line ${L} x1="60" y1="202" x2="320" y2="202"/>
      <line ${L} x1="150" y1="212" x2="330" y2="212"/>
      <line ${L} x1="240" y1="262" x2="300" y2="262"/>
      <line ${L} x1="60" y1="322" x2="300" y2="322"/>
      <line ${L} x1="150" y1="372" x2="300" y2="372"/>`,
  },

  {
    id: 'cache-set-associativa',
    title: 'Cache a corrispondenza associativa a gruppi',
    topic: 'mem',
    ref: 'Hamacher cap. 8',
    width: 640,
    height: 420,
    slots: [
      { id: 'cache', x: 120, y: 22, label: 'Cache' },
      { id: 'centrale', x: 500, y: 22, label: 'Memoria centrale' },
      { id: 'gruppo', x: 40, y: 90, label: 'Gruppo' },
      { id: 'blocco', x: 120, y: 90, label: 'Blocco' },
      { id: 'etichetta', x: 120, y: 332, label: 'Etichetta' },
      { id: 'posizione', x: 240, y: 332, label: 'Posizione' },
      { id: 'spiazzamento', x: 350, y: 332, label: 'Spiazzamento' },
      { id: 'indirizzo', x: 235, y: 390, label: 'Indirizzo di memoria centrale' },
    ],
    distractors: ['Tag', 'Frame', 'Pagina', 'Offset di pagina', 'Dato'],
    svg: `
      <rect ${G} x="20" y="105" width="200" height="200" rx="8"/>
      <rect ${G} x="400" y="40" width="200" height="265" rx="8"/>

      <rect ${B} x="70" y="115" width="140" height="30" rx="4"/>
      <rect ${B} x="70" y="150" width="140" height="30" rx="4"/>
      <rect ${B} x="70" y="200" width="140" height="30" rx="4"/>
      <rect ${B} x="70" y="235" width="140" height="30" rx="4"/>
      <text ${T} x="140" y="192" font-size="11">⋮</text>
      <text ${T} x="40" y="136" font-size="11">0</text>
      <text ${T} x="40" y="256" font-size="11">k</text>

      <rect ${B} x="415" y="55" width="170" height="26" rx="4"/>
      <rect ${B} x="415" y="86" width="170" height="26" rx="4"/>
      <rect ${B} x="415" y="150" width="170" height="26" rx="4"/>
      <rect ${B} x="415" y="240" width="170" height="26" rx="4"/>
      <rect ${B} x="415" y="271" width="170" height="26" rx="4"/>
      <text ${T} x="500" y="132" font-size="11">⋮</text>
      <text ${T} x="500" y="222" font-size="11">⋮</text>

      <line ${A} x1="400" y1="163" x2="225" y2="163"/>
      <line ${A} x1="400" y1="255" x2="225" y2="222"/>

      <rect ${B} x="60" y="318" width="120" height="28" rx="4"/>
      <rect ${B} x="185" y="318" width="110" height="28" rx="4"/>
      <rect ${B} x="300" y="318" width="100" height="28" rx="4"/>
      <line ${L} x1="60" y1="358" x2="400" y2="358"/>`,
  },

  {
    id: 'gerarchia-memoria',
    title: 'Gerarchia di memoria',
    topic: 'mem',
    ref: 'Hamacher cap. 8',
    width: 560,
    height: 350,
    slots: [
      { id: 'reg', x: 280, y: 40, label: 'Registri' },
      { id: 'l1', x: 280, y: 100, label: 'Cache primaria (L1)' },
      { id: 'l2', x: 280, y: 160, label: 'Cache secondaria (L2)' },
      { id: 'main', x: 280, y: 220, label: 'Memoria principale' },
      { id: 'sec', x: 280, y: 285, label: 'Memoria secondaria' },
    ],
    distractors: ['TLB', 'Tabella delle pagine', 'Buffer di scrittura', 'ROM'],
    svg: `
      <rect ${B} x="200" y="22" width="160" height="36" rx="6"/>
      <rect ${B} x="180" y="82" width="200" height="36" rx="6"/>
      <rect ${B} x="160" y="142" width="240" height="36" rx="6"/>
      <rect ${B} x="140" y="202" width="280" height="36" rx="6"/>
      <rect ${B} x="120" y="262" width="320" height="46" rx="6"/>

      <line ${A} x1="70" y1="300" x2="70" y2="30"/>
      <text ${T} x="70" y="322" font-size="11">più veloce</text>
      <line ${A} x1="500" y1="30" x2="500" y2="300"/>
      <text ${T} x="500" y="322" font-size="11">più capiente</text>`,
  },

  {
    id: 'memoria-virtuale-tlb',
    title: 'Traduzione dell’indirizzo virtuale',
    topic: 'vm',
    ref: 'Hamacher cap. 8',
    width: 620,
    height: 320,
    slots: [
      { id: 'vpage', x: 110, y: 52, label: 'Numero di pagina' },
      { id: 'voff', x: 265, y: 52, label: 'Offset' },
      { id: 'tlb', x: 150, y: 160, label: 'TLB' },
      { id: 'pt', x: 400, y: 160, label: 'Tabella delle pagine' },
      { id: 'frame', x: 110, y: 268, label: 'Numero di frame' },
      { id: 'poff', x: 265, y: 268, label: 'Offset' },
    ],
    distractors: ['Etichetta', 'Indice di cache', 'Blocco', 'Registro di stato'],
    svg: `
      <text ${TS} x="24" y="20" font-size="12">Indirizzo virtuale</text>
      <rect ${B} x="40" y="34" width="140" height="36" rx="4"/>
      <rect ${B} x="190" y="34" width="150" height="36" rx="4"/>

      <rect ${B} x="70" y="128" width="160" height="60" rx="6"/>
      <rect ${B} x="320" y="128" width="160" height="60" rx="6"/>

      <line ${A} x1="110" y1="70" x2="110" y2="128"/>
      <line ${A} x1="230" y1="158" x2="320" y2="158"/>
      <text ${T} x="275" y="150" font-size="10">miss</text>
      <line ${A} x1="110" y1="188" x2="110" y2="250"/>
      <line ${L} x1="400" y1="188" x2="400" y2="215"/>
      <line ${L} x1="400" y1="215" x2="150" y2="215"/>
      <line ${A} x1="150" y1="215" x2="150" y2="250"/>
      <line ${A} x1="265" y1="70" x2="265" y2="250"/>

      <text ${TS} x="24" y="304" font-size="12">Indirizzo fisico</text>
      <rect ${B} x="40" y="250" width="140" height="36" rx="4"/>
      <rect ${B} x="190" y="250" width="150" height="36" rx="4"/>`,
  },

  {
    id: 'pipeline-5-stadi',
    title: 'Percorso dati a pipeline di cinque stadi',
    topic: 'pipe',
    ref: 'Hamacher cap. 6',
    width: 660,
    height: 220,
    slots: [
      { id: 'f', x: 75, y: 95, label: 'Prelievo (F)' },
      { id: 'd', x: 195, y: 95, label: 'Decodifica (D)' },
      { id: 'e', x: 315, y: 95, label: 'Esecuzione (E)' },
      { id: 'm', x: 435, y: 95, label: 'Memoria (M)' },
      { id: 'w', x: 555, y: 95, label: 'Scrittura (W)' },
    ],
    distractors: ['Interruzione', 'Arbitraggio', 'Rinvio', 'Predizione'],
    svg: `
      <rect ${B} x="25" y="60" width="100" height="70" rx="6"/>
      <rect ${B} x="145" y="60" width="100" height="70" rx="6"/>
      <rect ${B} x="265" y="60" width="100" height="70" rx="6"/>
      <rect ${B} x="385" y="60" width="100" height="70" rx="6"/>
      <rect ${B} x="505" y="60" width="100" height="70" rx="6"/>

      <rect ${B} x="128" y="50" width="14" height="90" rx="2"/>
      <rect ${B} x="248" y="50" width="14" height="90" rx="2"/>
      <rect ${B} x="368" y="50" width="14" height="90" rx="2"/>
      <rect ${B} x="488" y="50" width="14" height="90" rx="2"/>

      <line ${A} x1="0" y1="95" x2="25" y2="95"/>
      <line ${A} x1="605" y1="95" x2="640" y2="95"/>
      <line ${L} x1="25" y1="170" x2="605" y2="170"/>
      <text ${T} x="315" y="190" font-size="11">registri di stadio · un colpo di clock per stadio</text>`,
  },

  {
    id: 'interfaccia-io',
    title: 'Interfaccia di un dispositivo di I/O',
    topic: 'io',
    ref: 'Hamacher cap. 3',
    width: 620,
    height: 300,
    slots: [
      { id: 'proc', x: 80, y: 60, label: 'Processore' },
      { id: 'bus', x: 310, y: 128, label: 'Bus' },
      { id: 'data', x: 420, y: 60, label: 'DATA' },
      { id: 'status', x: 420, y: 118, label: 'STATUS' },
      { id: 'control', x: 420, y: 176, label: 'CONTROL' },
      { id: 'dev', x: 420, y: 258, label: 'Dispositivo' },
    ],
    distractors: ['ALU', 'Cache', 'DMA', 'Registro indice', 'PC'],
    svg: `
      <rect ${B} x="20" y="40" width="120" height="44" rx="6"/>
      <rect ${B} x="20" y="120" width="120" height="44" rx="6"/>
      <text ${T} x="80" y="147" font-size="12">Memoria</text>

      <line ${L} x1="140" y1="62" x2="230" y2="62"/>
      <line ${L} x1="140" y1="142" x2="230" y2="142"/>
      <line ${L} x1="230" y1="40" x2="230" y2="220"/>
      <line ${L} x1="240" y1="40" x2="240" y2="220"/>
      <line ${L} x1="250" y1="40" x2="250" y2="220"/>

      <rect ${G} x="330" y="30" width="180" height="170" rx="8"/>
      <rect ${B} x="350" y="42" width="140" height="34" rx="4"/>
      <rect ${B} x="350" y="100" width="140" height="34" rx="4"/>
      <rect ${B} x="350" y="158" width="140" height="34" rx="4"/>
      <text ${T} x="420" y="216" font-size="11">interfaccia</text>

      <line ${L} x1="250" y1="62" x2="350" y2="62"/>
      <line ${L} x1="250" y1="118" x2="350" y2="118"/>
      <line ${L} x1="250" y1="176" x2="350" y2="176"/>

      <rect ${B} x="350" y="240" width="140" height="40" rx="6"/>
      <line ${A} x1="420" y1="200" x2="420" y2="240"/>`,
  },

  {
    id: 'sommatore-ripple',
    title: 'Sommatore a propagazione di riporto',
    topic: 'arith',
    ref: 'Hamacher cap. 9',
    width: 740,
    height: 240,
    slots: [
      { id: 'fa', x: 545, y: 118, label: 'Sommatore completo' },
      { id: 'cin', x: 690, y: 78, label: 'Riporto entrante' },
      { id: 'cout', x: 55, y: 118, label: 'Riporto uscente' },
      { id: 'sum', x: 545, y: 205, label: 'Bit di somma' },
      { id: 'ops', x: 545, y: 30, label: 'Bit degli addendi' },
    ],
    distractors: ['Overflow', 'Bit di segno', 'Semisommatore', 'Registro'],
    svg: `
      <g transform="translate(60,0)">
      <rect ${B} x="80" y="90" width="90" height="60" rx="6"/>
      <rect ${B} x="200" y="90" width="90" height="60" rx="6"/>
      <rect ${B} x="320" y="90" width="90" height="60" rx="6"/>
      <rect ${B} x="440" y="90" width="90" height="60" rx="6"/>

      <line ${A} x1="530" y1="120" x2="575" y2="120" transform="rotate(180 552 120)"/>
      <line ${A} x1="440" y1="120" x2="410" y2="120"/>
      <line ${A} x1="320" y1="120" x2="290" y2="120"/>
      <line ${A} x1="200" y1="120" x2="170" y2="120"/>
      <line ${A} x1="80" y1="120" x2="55" y2="120"/>

      <line ${L} x1="105" y1="60" x2="105" y2="90"/>
      <line ${L} x1="145" y1="60" x2="145" y2="90"/>
      <line ${L} x1="225" y1="60" x2="225" y2="90"/>
      <line ${L} x1="265" y1="60" x2="265" y2="90"/>
      <line ${L} x1="345" y1="60" x2="345" y2="90"/>
      <line ${L} x1="385" y1="60" x2="385" y2="90"/>
      <line ${L} x1="465" y1="60" x2="465" y2="90"/>
      <line ${L} x1="505" y1="60" x2="505" y2="90"/>

      <line ${A} x1="125" y1="150" x2="125" y2="185"/>
      <line ${A} x1="245" y1="150" x2="245" y2="185"/>
      <line ${A} x1="365" y1="150" x2="365" y2="185"/>
      <line ${A} x1="485" y1="150" x2="485" y2="185"/>
      </g>`,
  },
];

export function diagramById(id: string): Diagram | undefined {
  return diagrams.find((diagram) => diagram.id === id);
}
