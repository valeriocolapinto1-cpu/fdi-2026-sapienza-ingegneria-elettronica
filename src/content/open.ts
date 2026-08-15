import type { OpenItem } from './types';

/**
 * Domande aperte di teoria (14 voci), con risposta modello per
 * l'autovalutazione. Le prime cinque vengono dal prototipo; le altre coprono
 * i moduli che ne erano scoperti (bin, bool, karnaugh, ff, isa, mem).
 *
 * PER AGGIUNGERNE UNA: aggiungi una voce con `id` nuovo, `topic` fra quelli
 * di `types.ts` e un `model` che elenchi i punti che l'esame vuole sentire.
 */
export const open: OpenItem[] = [
  {
    id: 'open-irq-01',
    topic: 'irq',
    q: 'Spiega la differenza tra interruzioni ed eccezioni.',
    model:
      'Le interruzioni sono segnali hardware asincroni da dispositivi esterni (sulle linee di controllo del bus); le eccezioni sono eventi software sincroni generati dal processore (div/0, overflow, chiamate di sistema). Entrambe sospendono il programma, salvano lo stato e invocano una routine; le eccezioni sono più versatili e possono richiamare routine diverse. Cita ISR e salvataggio di PC/registri.',
    ref: 'Hamacher cap. 4',
  },
  {
    id: 'open-pipe-01',
    topic: 'pipe',
    q: "Che cos'è il pipelining e quale problema introduce?",
    model:
      'Sovrapposizione delle fasi (fetch, decode, execute, memory, write) di istruzioni diverse su unità dedicate → maggiore throughput. Introduce la dipendenza dai dati (stalli), mitigata con operand forwarding.',
    ref: 'Hamacher cap. 6',
  },
  {
    id: 'open-mem-01',
    topic: 'mem',
    q: 'Differenza tra RAM e cache, definendo località spaziale e temporale.',
    model:
      'Entrambe volatili. La cache è più piccola, veloce e costosa (SRAM), tiene copie dei dati frequenti. Nella RAM il tempo di accesso NON dipende dalla posizione del dato. Località temporale: dati usati di recente riusati a breve; spaziale: indirizzi vicini referenziati a breve.',
    ref: 'Hamacher cap. 8',
  },
  {
    id: 'open-mem-02',
    topic: 'mem',
    q: 'Quali sono le limitazioni di una cache L1 molto grande (rispetto ad aggiungere L2)?',
    model:
      'Costo elevato, maggiore spazio fisico e soprattutto minore velocità (indirizzi più grandi → accesso più lento). Meglio una gerarchia L1 piccola/veloce + L2 più grande/lenta.',
    ref: 'Hamacher cap. 8',
  },
  {
    id: 'open-isa-01',
    topic: 'isa',
    q: "Perché conviene aggiornare il PC all'istruzione successiva e non a quella corrente?",
    model:
      "Per la sequenzialità dell'esecuzione: dopo il fetch, incrementare il PC prepara la prossima istruzione senza ricalcolo, utile in pipeline (fetch anticipato). I salti (branch) caricano un nuovo indirizzo nel PC.",
    ref: 'Hamacher cap. 5',
  },

  // ───────── aggiunte per coprire i moduli scoperti ─────────
  {
    id: 'open-ff-01',
    topic: 'ff',
    q: "Che cos'è un flip-flop? Distingui dispositivi sincroni e asincroni.",
    model:
      "Un flip-flop è un elemento <b>bistabile</b> che memorizza 1 bit: realizzato con porte logiche retroazionate, mantiene uno dei due stati stabili finché un ingresso non lo commuta. È il mattone di registri e contatori. I dispositivi <b>sincroni</b> (edge-triggered) cambiano stato solo sul fronte del clock, quindi l'istante di commutazione è prevedibile; gli <b>asincroni</b> reagiscono immediatamente agli ingressi, senza clock.",
    ref: 'Hamacher App. A',
  },
  {
    id: 'open-ff-02',
    topic: 'ff',
    q: 'Descrivi il flip-flop master-slave e spiega perché serve la struttura a due stadi.',
    model:
      "Due latch D in serie: il <b>master</b> campiona l'ingresso mentre il clock è alto, lo <b>slave</b> ne trasferisce il valore in uscita quando il clock commuta. Poiché i due stadi non sono mai trasparenti contemporaneamente, l'ingresso non può «attraversare» il dispositivo nello stesso ciclo: si evita l'instabilità (corse) e l'uscita cambia in un solo istante ben definito, il fronte del clock.",
    ref: 'Hamacher App. A',
  },
  {
    id: 'open-isa-02',
    topic: 'isa',
    q: 'Confronta le architetture RISC e CISC.',
    model:
      "<b>RISC</b>: istruzioni semplici, di lunghezza fissa (una parola); modello <b>load/store</b> (i dati vanno portati in registro prima di essere elaborati, niente operazioni memoria-memoria); pochi modi di indirizzamento → decodifica semplice e circuito veloce, adatto alla pipeline. Esempi: ARM, Nios II. <b>CISC</b>: istruzioni complesse di lunghezza variabile, operazioni anche su operandi in memoria; i programmi risultano più corti ma la decodifica è più onerosa. Esempi: Intel IA-32, ColdFire.",
    ref: 'Hamacher cap. 2–3',
  },
  {
    id: 'open-bool-01',
    topic: 'bool',
    q: 'Enuncia i teoremi di De Morgan e spiega perché NAND e NOR sono universali.',
    model:
      "De Morgan: <span class=\"ovl\">A·B</span> = <span class=\"ovl\">A</span> + <span class=\"ovl\">B</span> e <span class=\"ovl\">A+B</span> = <span class=\"ovl\">A</span> · <span class=\"ovl\">B</span>; valgono anche per più di due fattori. Con soli ∧ e ∨ non si ottiene la negazione, quindi quell'insieme non è funzionalmente completo. NAND e NOR invece lo sono da soli: da ciascuno si ricava il NOT (collegando insieme gli ingressi) e, per De Morgan, anche AND e OR — quindi qualunque rete combinatoria.",
    ref: 'Hamacher App. A',
  },
  {
    id: 'open-mem-03',
    topic: 'mem',
    q: 'Descrivi la gerarchia di memoria e spiega perché conviene organizzarla a livelli.',
    model:
      "Dai registri alla cache (L1, L2), alla memoria principale DRAM, fino alla memoria secondaria: scendendo, la capacità cresce e il costo per bit cala, ma il tempo di accesso peggiora. La gerarchia funziona grazie alla <b>località</b>: i livelli alti tengono i dati usati di recente e quelli vicini, così la gran parte degli accessi si risolve in alto. Un solo livello grande e veloce sarebbe proibitivo per costo e comunque più lento, perché indirizzare molte celle rallenta l'accesso.",
    ref: 'Hamacher cap. 8',
  },
  {
    id: 'open-mem-04',
    topic: 'mem',
    q: 'Confronta le tre mappature della cache (diretta, associativa, set-associativa).',
    model:
      "<b>Diretta</b>: ogni blocco di memoria può andare in una sola linea di cache; hardware semplice e confronto immediato, ma blocchi che mappano sulla stessa linea si sfrattano a vicenda (conflitti) anche con la cache semivuota. <b>Associativa</b>: un blocco può andare in qualunque linea; sfrutta al meglio lo spazio, ma richiede di confrontare il tag con tutte le linee, quindi è costosa e più lenta. <b>Set-associativa</b>: compromesso: la cache è divisa in insiemi, il blocco va in un insieme fisso ma in una linea qualsiasi al suo interno. Serve una politica di sostituzione, tipicamente <b>LRU</b>.",
    ref: 'Hamacher cap. 8',
  },
  {
    id: 'open-irq-02',
    topic: 'irq',
    q: 'Come sfrutta un debugger il meccanismo delle eccezioni?',
    model:
      "Il debugger usa eccezioni generate dal processore per riprendere il controllo del programma sotto esame. In <b>trace mode</b> viene sollevata un'eccezione dopo <em>ogni</em> istruzione, così l'esecuzione procede passo-passo e si può ispezionare lo stato a ogni passo. Con i <b>breakpoint</b> l'eccezione scatta solo in punti scelti: il programma corre a piena velocità fino al breakpoint successivo. In entrambi i casi il controllo passa a una routine del debugger dopo il salvataggio dello stato.",
    ref: 'Hamacher cap. 4',
  },
  {
    id: 'open-bin-01',
    topic: 'bin',
    q: "Spiega la rappresentazione in complemento a 2 e come si rileva l'overflow.",
    model:
      "Per un positivo: binario con zeri a sinistra fino a N bit. Per <code>-x</code>: si scrive <code>x</code>, si invertono tutti i bit e si somma 1. Il bit più significativo indica il segno e lo zero ha <b>una sola</b> codifica; l'intervallo è asimmetrico, da −2ᴺ⁻¹ a +2ᴺ⁻¹−1. L'<b>overflow</b> nella somma si ha quando due operandi <b>concordi</b> danno un risultato di segno opposto (nella sottrazione, quando gli operandi sono discordi); in hardware si rileva con lo <b>XOR</b> tra il riporto entrante e quello uscente dal bit di segno. Attenzione a non confonderlo con il riporto uscente, che da solo non segnala overflow in CP2.",
    ref: 'Hamacher cap. 1',
  },
  {
    id: 'open-karnaugh-01',
    topic: 'karnaugh',
    q: 'Descrivi la minimizzazione con la mappa di Karnaugh e il ruolo delle indifferenze.',
    model:
      "La mappa dispone i mintermini in celle adiacenti secondo il <b>codice Gray</b>: fra celle vicine cambia una sola variabile. Si raggruppano gli <code>1</code> in blocchi di dimensione potenza di 2, il più grandi possibile: dentro un gruppo le variabili che cambiano si eliminano, e restano quelle costanti, che formano un implicante. L'unione degli implicanti scelti dà la SOP minima. Le celle sono adiacenti anche a bordo tavola (wrap-around). Le <b>indifferenze</b> (x) possono essere prese come 1 quando servono ad allargare un gruppo, o lasciate a 0 se non aiutano: si valutano una per una, non tutte insieme. Nel disegno finale scomponi in porte a 2 ingressi.",
    ref: 'Hamacher App. A',
  },
];
