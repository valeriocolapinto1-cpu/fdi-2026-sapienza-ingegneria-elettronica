import type { Topic } from './types';

/** Soprallineatura per la negazione booleana: ovl('A') → Ā */
const ovl = (s: string): string => `<span class="ovl">${s}</span>`;

/**
 * Moduli di studio. Contenuti riscritti in forma originale: i riferimenti a
 * Hamacher sono rimandi al testo, non citazioni.
 *
 * Le «trappole» non stanno nel corpo ma in `content/traps.ts`, richiamate qui
 * per id: così la stessa trappola può comparire in più moduli e nell'indice
 * dei Riferimenti senza essere scritta due volte.
 */
export const topics: Topic[] = [
  {
    id: 'bin',
    title: 'Numeri binari & complemento a 2',
    blurb: "Rappresentazione con segno, range, overflow. La parte più «spremuta» all'esame.",
    ref: 'Hamacher cap. 1',
    trapIds: ['trap-ram'],
    body: `
    <h4>Complemento a 2 in N bit</h4>
    <p>Un positivo si scrive in binario e si riempie di zeri a sinistra fino a N bit. Per un negativo <code>-x</code>: si scrive <code>x</code> in binario, si invertono tutti i bit (CP1) e si somma <code>1</code>. Il bit più significativo è il segno: <code>0</code> positivo, <code>1</code> negativo. Lo zero ha <b>una sola</b> codifica.</p>
    <h4>Range</h4>
    <ul>
      <li>Senza segno: da <code>0</code> a <code>2ᴺ−1</code> (con 8 bit → 255).</li>
      <li>CP2: da <code>−2ᴺ⁻¹</code> a <code>+2ᴺ⁻¹−1</code> (con 8 bit → da −128 a +127).</li>
      <li>CP1 e modulo-e-segno: intervallo simmetrico e <b>due</b> codifiche dello zero.</li>
    </ul>
    <h4>Overflow</h4>
    <p>Nella somma in CP2 l'overflow si verifica sommando due operandi <b>concordi</b> e ottenendo un risultato di segno opposto. Nella sottrazione tra due numeri <b>discordi</b>. Si rileva con lo <b>XOR</b> tra riporto entrante e riporto uscente dal bit di segno.</p>
    <h4>Shift</h4>
    <p>Shift a sinistra ≈ moltiplicazione per 2; shift a destra ≈ divisione intera per 2. Eliminare il bit meno significativo di un intero senza segno equivale a dividere per 2.</p>`,
  },

  {
    id: 'bool',
    title: 'Algebra di Boole & porte logiche',
    blurb: 'Insiemi funzionalmente completi, De Morgan, universalità di NAND/NOR.',
    ref: 'Hamacher — Appendice A',
    trapIds: ['trap-and-assoc', 'trap-simboli', 'trap-demorgan'],
    body: `
    <h4>Insiemi funzionalmente completi</h4>
    <p>Con soli <code>AND</code> e <code>OR</code> (∧, ∨) non si sintetizza qualsiasi funzione: manca la negazione, che non si ottiene combinandoli. Sono invece <b>universali</b> sia <code>NAND</code> sia <code>NOR</code>: con uno solo di essi si costruisce qualunque rete combinatoria.</p>
    <h4>De Morgan</h4>
    <p>${ovl('A·B')} = ${ovl('A')} + ${ovl('B')} &nbsp;e&nbsp; ${ovl('A+B')} = ${ovl('A')} · ${ovl('B')}. Valgono anche per più di due fattori: ${ovl('A·B·C')} = ${ovl('A')}+${ovl('B')}+${ovl('C')}.</p>`,
  },

  {
    id: 'karnaugh',
    title: 'Sintesi & mappe di Karnaugh',
    blurb: 'Dalla tabella di verità al circuito minimo. Esce quasi sempre.',
    ref: 'Hamacher — Appendice A',
    trapIds: ['trap-and-assoc'],
    body: `
    <h4>Idea</h4>
    <p>La mappa di Karnaugh dispone i mintermini in celle adiacenti secondo il <b>codice Gray</b> (una sola variabile cambia tra celle vicine). Raggruppando gli <code>1</code> in blocchi di potenze di 2 (1, 2, 4, 8…) si eliminano le variabili che cambiano dentro il gruppo, ottenendo una somma di prodotti (SOP) minima.</p>
    <ul>
      <li>Gruppi il più grande possibile → prodotti più corti → meno porte.</li>
      <li>Le celle sono adiacenti anche «a bordo tavola» (wrap-around).</li>
      <li>Le condizioni di indifferenza si usano per allargare i gruppi, valutandole singolarmente (tutte 0 o tutte 1).</li>
    </ul>
    <p>All'esame: dalla tabella ricavi la SOP minima, poi <b>disegni il circuito</b>. Allenati nel Simulatore → drill «Reti combinatorie».</p>`,
  },

  {
    id: 'ff',
    title: 'Circuiti sequenziali & flip-flop',
    blurb: 'Bistabilità, sincroni vs asincroni, master-slave.',
    ref: 'Hamacher — Appendice A',
    trapIds: [],
    body: `
    <h4>Flip-flop</h4>
    <p>Elemento bistabile che memorizza <b>1 bit</b>: mantiene uno dei due stati stabili finché un ingresso non lo commuta. Costituito da porte logiche retroazionate; è il mattone di registri e contatori.</p>
    <h4>Sincroni vs asincroni</h4>
    <p>I <b>sincroni</b> (edge-triggered) cambiano stato solo sul fronte del clock; gli <b>asincroni</b> reagiscono immediatamente agli ingressi, senza clock.</p>
    <h4>Master-slave</h4>
    <p>Due latch D in serie: il <b>master</b> campiona l'ingresso quando il clock è alto, lo <b>slave</b> trasferisce il valore quando il clock commuta. Il trasferimento in due fasi evita instabilità e garantisce un'uscita prevedibile sul fronte.</p>`,
  },

  {
    id: 'isa',
    title: 'RISC vs CISC & assembly',
    blurb: 'ISA, modi di indirizzamento, RTN, sottoprogrammi e pile.',
    ref: 'Hamacher cap. 2–3',
    trapIds: ['trap-rtn'],
    body: `
    <h4>RISC</h4>
    <ul>
      <li>Istruzioni semplici, lunghezza fissa (una parola).</li>
      <li>Modello load/store: i dati vanno caricati in registro prima di essere elaborati; niente operazioni direttamente memoria-memoria.</li>
      <li>Modi di indirizzamento pochi e semplici → circuito veloce, adatto alla pipeline.</li>
      <li>Esempi: ARM, Nios II.</li>
    </ul>
    <h4>CISC</h4>
    <ul>
      <li>Istruzioni complesse, di lunghezza variabile; operazioni anche direttamente su operandi in memoria.</li>
      <li>Programmi più corti ma decodifica più onerosa. Esempi: Intel IA-32, ColdFire.</li>
    </ul>
    <h4>RTN (Register Transfer Notation)</h4>
    <p><code>Add R1,R2,R3</code> → <code>R1 ← [R2]+[R3]</code>. «Aumenta di LOC il valore in R1» → <code>R1 ← [LOC]+[R1]</code>. Le parentesi quadre indicano «contenuto di».</p>
    <pre><span class="cm">; moltiplicazione tramite somme (stile RISC)</span>
      Load  LOC1, NUM1
      Load  LOC2, NUM2
      Clear LOC3
<span class="lb">CICLO:</span> Sub   LOC2, LOC2, 1
      Add   LOC3, LOC3, LOC1
      Branch_if_[LOC2]&gt;0  CICLO
      Store LOC3, RES</pre>`,
  },

  {
    id: 'irq',
    title: 'Interruzioni & eccezioni',
    blurb: 'ISR, differenza IRQ/eccezioni, debugger (trace & breakpoint).',
    ref: 'Hamacher cap. 4',
    trapIds: [],
    body: `
    <h4>Interruzioni</h4>
    <p>Segnali <b>hardware asincroni</b> che viaggiano sulle linee di controllo del bus, generati da dispositivi esterni. Il processore sospende il programma, <b>salva lo stato</b> (PC, registri) e passa alla <b>ISR</b> (routine di servizio); al termine ripristina lo stato e riprende.</p>
    <h4>Eccezioni</h4>
    <p>Eventi <b>sincroni</b>, generati dal processore durante l'esecuzione (divisione per 0, overflow, codice illegale, chiamate di sistema). Più versatili: possono richiamare routine diverse. Usate anche per il debugging.</p>
    <h4>Debugger</h4>
    <ul>
      <li><b>Trace mode</b>: un'interruzione dopo ogni istruzione → esecuzione passo-passo.</li>
      <li><b>Breakpoint</b>: interruzione solo a punti scelti → procede a piena velocità fino al successivo.</li>
    </ul>`,
  },

  {
    id: 'pipe',
    title: 'Pipeline & prestazioni',
    blurb: 'Sovrapposizione fetch-decode-execute, dipendenza dai dati, forwarding.',
    ref: 'Hamacher cap. 5–6',
    trapIds: [],
    body: `
    <h4>Pipelining</h4>
    <p>Si divide l'esecuzione in stadi (fetch, decode, execute, memory, write) affidati a unità hardware dedicate. Mentre un'istruzione è in un certo stadio, la successiva occupa lo stadio precedente: le esecuzioni si <b>sovrappongono</b> come in una catena di montaggio, aumentando il throughput.</p>
    <h4>Dipendenza dai dati</h4>
    <p>Se un'istruzione ha bisogno del risultato di quella precedente si crea uno <b>stallo</b>. Si mitiga con l'<b>operand forwarding</b>: il risultato è inoltrato direttamente all'unità che lo richiede senza attendere la scrittura in registro.</p>`,
  },

  {
    id: 'mem',
    title: 'Gerarchia di memoria & cache',
    blurb: 'Hit/miss, località, mappature, RAM/ROM, LRU.',
    ref: 'Hamacher cap. 8',
    trapIds: ['trap-ram'],
    body: `
    <h4>Cache</h4>
    <p>Memoria piccola, veloce e costosa (SRAM) tra CPU e memoria principale (DRAM). Conserva copie dei dati usati di recente sfruttando la <b>località temporale</b> (ciò a cui si è acceduto di recente servirà di nuovo a breve) e <b>spaziale</b> (indirizzi vicini tendono a essere referenziati a breve).</p>
    <ul>
      <li><b>Cache hit</b>: il dato è in cache → accesso rapido.</li>
      <li><b>Cache miss</b>: si scende nella gerarchia (L2, RAM, disco) → ritardo detto <b>miss penalty</b>.</li>
      <li>Mappature: diretta (semplice, soggetta a conflitti), associativa (flessibile, costosa), set-associativa (compromesso).</li>
      <li>Sostituzione: <b>LRU</b> (meno usato di recente), alternativa <b>LFU</b>.</li>
    </ul>
    <h4>Perché non una cache enorme?</h4>
    <p>Costo, spazio fisico e — soprattutto — <b>velocità</b>: indirizzi più grandi rallentano l'accesso. Meglio più livelli (L1 piccola/veloce, L2 più grande/lenta).</p>
    <h4>Tipi di ROM</h4>
    <p>EPROM cancellata con raggi ultravioletti, EEPROM cancellata elettricamente.</p>`,
  },

  {
    id: 'ieee',
    title: 'Virgola mobile IEEE 754',
    blurb: 'Segno, esponente polarizzato, mantissa.',
    ref: 'Hamacher cap. 1',
    trapIds: [],
    body: `
    <h4>Singola precisione (32 bit)</h4>
    <p>1 bit di <b>segno</b>, 8 bit di <b>esponente</b> con polarizzazione (bias 127), 23 bit di <b>mantissa</b> (con bit implicito «1.» nei numeri normalizzati). Valore ≈ <code>(−1)ˢ · 1.M · 2^(E−127)</code>.</p>
    <p>È lo standard richiesto quando si parla di rappresentazione dei reali: la sigla da ricordare è <b>IEEE 754</b>.</p>`,
  },
];
