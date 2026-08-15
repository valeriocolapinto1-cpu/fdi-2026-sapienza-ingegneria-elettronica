import type { Topic } from './types';

/** Soprallineatura per la negazione booleana: ovl('A') → Ā */
const ovl = (s: string): string => `<span class="ovl">${s}</span>`;

/**
 * Moduli di studio. Contenuti riscritti in forma originale: i riferimenti a
 * Hamacher sono rimandi al testo, non citazioni.
 *
 * L'ordine è pedagogico, non alfabetico: numeri → logica → sintesi →
 * sequenziali → processore → ISA → interruzioni → pipeline → memoria →
 * memoria virtuale → virgola mobile.
 *
 * Le «trappole» non stanno nel corpo ma in `content/traps.ts`, richiamate qui
 * per id: così la stessa trappola può comparire in più moduli e nell'indice
 * dei Riferimenti senza essere scritta due volte.
 */
export const topics: Topic[] = [
  {
    id: 'bin',
    title: 'Numeri binari & complemento a 2',
    blurb: "Basi, rappresentazioni con segno, range, overflow. La parte più «spremuta» all'esame.",
    ref: 'Hamacher cap. 1',
    trapIds: ['trap-ram'],
    body: `
    <h4>Basi e conversioni</h4>
    <p>Un numero in base <code>b</code> è una somma di cifre pesate: <code>1011₂ = 1·2³ + 0·2² + 1·2¹ + 1·2⁰ = 11</code>. Per convertire da decimale a binario si divide ripetutamente per 2 e si leggono i resti <b>dal basso verso l'alto</b>.</p>
    <p>Esadecimale e ottale servono solo ad accorciare la scrittura: una cifra hex vale <b>4 bit</b>, una ottale <b>3 bit</b>. Si converte raggruppando, senza passare dal decimale:</p>
    <pre>1011 0110₂  →  B    6    →  0xB6
   ↑    ↑        11   6</pre>
    <p>Da decimale a esadecimale conviene dividere per 16: <code>182 = 11·16 + 6 → B6</code>.</p>

    <h4>Rappresentazioni con segno</h4>
    <p>Con N bit si possono codificare 2ᴺ configurazioni: la domanda è come spenderle fra positivi e negativi.</p>
    <ul>
      <li><b>Modulo e segno</b>: il bit più significativo è il segno, il resto è il valore assoluto. Intervallo simmetrico, ma <b>due</b> codifiche dello zero (+0 e −0) e l'aritmetica richiede di confrontare i segni.</li>
      <li><b>Complemento a 1</b>: il negativo si ottiene invertendo tutti i bit. Ancora <b>due</b> zeri, e la somma richiede il riporto circolare.</li>
      <li><b>Complemento a 2</b>: il negativo si ottiene invertendo i bit e sommando 1. <b>Una sola</b> codifica dello zero e intervallo asimmetrico.</li>
    </ul>

    <h4>Perché all'esame si usa il complemento a 2</h4>
    <p>Non è una convenzione arbitraria: in CP2 la <b>sottrazione diventa una somma</b>, perché <code>A − B = A + (−B)</code> e il negativo è ottenibile con un invertitore e un riporto entrante. Serve quindi <b>un solo sommatore</b> per entrambe le operazioni, e non c'è nessun caso speciale da trattare sui segni.</p>
    <p>Il bit più significativo ha peso <b>negativo</b>: su 4 bit, <code>1011₂ = −8 + 0 + 2 + 1 = −5</code>. È il modo più rapido per leggere un CP2 senza fare l'inversione.</p>

    <h4>Range</h4>
    <ul>
      <li>Senza segno: da <code>0</code> a <code>2ᴺ−1</code> (con 8 bit → 0…255).</li>
      <li>CP2: da <code>−2ᴺ⁻¹</code> a <code>+2ᴺ⁻¹−1</code> (con 8 bit → −128…+127).</li>
      <li>CP1 e modulo-e-segno: da <code>−(2ᴺ⁻¹−1)</code> a <code>+2ᴺ⁻¹−1</code>, simmetrico.</li>
    </ul>
    <p>L'asimmetria del CP2 è la ragione per cui <code>−128</code> esiste su 8 bit ma <code>+128</code> no: il suo opposto non è rappresentabile, e invertire-e-sommare-1 su <code>10000000</code> restituisce sé stesso.</p>

    <h4>Estensione del segno</h4>
    <p>Per portare un CP2 da N a M bit (M &gt; N) si <b>replica il bit di segno</b> a sinistra, non si riempie di zeri: <code>1011</code> (−5 su 4 bit) diventa <code>11111011</code> su 8 bit. Riempire di zeri darebbe 251.</p>

    <h4>Overflow — e perché non è il riporto uscente</h4>
    <p>Si ha overflow quando il risultato esce dall'intervallo rappresentabile. Due regole equivalenti:</p>
    <ul>
      <li><b>Per segni</b>: sommando due operandi <b>concordi</b> si ottiene un risultato di segno opposto. Sommando due discordi l'overflow è impossibile. Nella sottrazione il caso a rischio è quello fra operandi <b>discordi</b>.</li>
      <li><b>In hardware</b>: <code>overflow = C<sub>in</sub> ⊕ C<sub>out</sub></code> sul bit di segno, cioè lo XOR fra il riporto che entra nel bit più significativo e quello che ne esce.</li>
    </ul>
    <p>Il <b>riporto uscente da solo non significa nulla</b> in CP2. Due controesempi da tenere a mente:</p>
    <pre>4 bit:  −1 + 1  →  1111 + 0001 = 0000   carry=1  overflow=0
4 bit:   4 + 4  →  0100 + 0100 = 1000   carry=0  overflow=1</pre>
    <p>Il carry out segnala overflow solo nell'aritmetica <b>senza segno</b>. Confonderli è una perdita di punti classica: nello Strumento «Sommatore binario» i due flag sono mostrati separati apposta.</p>

    <h4>Shift</h4>
    <p>Shift a sinistra di k posizioni ≈ moltiplicazione per 2ᵏ; shift a destra ≈ divisione intera per 2ᵏ. Attenzione al tipo di shift a destra:</p>
    <ul>
      <li><b>Logico</b>: entra 0 da sinistra. Corretto per i numeri senza segno.</li>
      <li><b>Aritmetico</b>: replica il bit di segno. Necessario in CP2, altrimenti un negativo diventa positivo.</li>
    </ul>
    <p>Eliminare il bit meno significativo di un intero senza segno equivale a dividerlo per 2.</p>`,
  },

  {
    id: 'bool',
    title: 'Algebra di Boole & porte logiche',
    blurb: 'Assiomi, De Morgan, SOP e POS, insiemi funzionalmente completi.',
    ref: 'Hamacher — Appendice A',
    trapIds: ['trap-and-assoc', 'trap-simboli', 'trap-demorgan'],
    body: `
    <h4>Le porte fondamentali</h4>
    <p>Su due ingressi <code>A</code> e <code>B</code> le uscite valgono, nell'ordine 00, 01, 10, 11:</p>
    <pre>AND  (A∧B)   0 0 0 1      NAND   1 1 1 0
OR   (A∨B)   0 1 1 1      NOR    1 0 0 0
XOR  (A⊕B)   0 1 1 0      XNOR   1 0 0 1</pre>
    <p>Il NOT ha un solo ingresso e inverte. Si legge una tabella di verità «per righe»: la porta è quella la cui colonna di uscita coincide riga per riga.</p>

    <h4>Assiomi e teoremi che servono davvero</h4>
    <ul>
      <li>Identità: <code>A∧1 = A</code>, <code>A∨0 = A</code></li>
      <li>Annullamento: <code>A∧0 = 0</code>, <code>A∨1 = 1</code></li>
      <li>Idempotenza: <code>A∧A = A</code>, <code>A∨A = A</code></li>
      <li>Complemento: <code>A∧${ovl('A')} = 0</code>, <code>A∨${ovl('A')} = 1</code></li>
      <li>Involuzione: ${ovl(ovl('A'))} <code>= A</code></li>
      <li><b>Assorbimento</b>: <code>A∨(A∧B) = A</code>, <code>A∧(A∨B) = A</code></li>
      <li>Distributività: <code>A∧(B∨C) = (A∧B)∨(A∧C)</code> e, cosa che sorprende chi viene dall'algebra ordinaria, anche <code>A∨(B∧C) = (A∨B)∧(A∨C)</code></li>
    </ul>
    <p>L'assorbimento è il teorema che fa collassare le espressioni ridondanti: <code>A ∨ (A∧${ovl('B')}) = A</code>. È esattamente ciò che rende <b>non minima</b> una SOP scritta senza raggruppare.</p>

    <h4>De Morgan</h4>
    <p>${ovl('A·B')} = ${ovl('A')} + ${ovl('B')} &nbsp;e&nbsp; ${ovl('A+B')} = ${ovl('A')} · ${ovl('B')}. In parole: la negazione di un prodotto è la somma delle negazioni, e viceversa.</p>
    <p>Valgono anche per più di due fattori: ${ovl('A·B·C')} = ${ovl('A')}+${ovl('B')}+${ovl('C')}. Il modo pratico di applicarli è «spezza la barra e cambia l'operatore».</p>

    <h4>Insiemi funzionalmente completi</h4>
    <p>Con soli <code>AND</code> e <code>OR</code> (∧, ∨) non si sintetizza qualsiasi funzione: manca la negazione, e non si ottiene combinandoli — qualunque composizione di AND e OR è una funzione <b>monotòna</b>, mentre il NOT non lo è.</p>
    <p>Sono invece <b>universali</b> sia <code>NAND</code> sia <code>NOR</code>, da soli. Con il NAND:</p>
    <ul>
      <li><code>NOT A</code> = A NAND A</li>
      <li><code>A AND B</code> = NOT(A NAND B) = (A NAND B) NAND (A NAND B)</li>
      <li><code>A OR B</code> = ${ovl('A')} NAND ${ovl('B')} (per De Morgan)</li>
    </ul>
    <p>Avendo NOT, AND e OR si costruisce qualunque rete combinatoria: ecco perché basta un solo tipo di porta.</p>

    <h4>Dalla tabella all'espressione: SOP e POS</h4>
    <p>Ogni funzione si scrive in due forme canoniche:</p>
    <ul>
      <li><b>SOP</b> (somma di prodotti): un <b>mintermine</b> per ogni riga con uscita 1, in cui ogni variabile compare diretta se vale 1, negata se vale 0. Si sommano i mintermini.</li>
      <li><b>POS</b> (prodotto di somme): un <b>maxtermine</b> per ogni riga con uscita 0, con le variabili invertite rispetto al mintermine. Si moltiplicano i maxtermini.</li>
    </ul>
    <p>La forma canonica è sempre corretta ma quasi mai minima: minimizzarla è il lavoro della mappa di Karnaugh.</p>

    <h4>XOR, che torna spesso</h4>
    <p><code>A⊕0 = A</code>, <code>A⊕1 = ${ovl('A')}</code>, <code>A⊕A = 0</code>. Lo XOR vale 1 quando gli ingressi sono <b>diversi</b>, quindi è il rilevatore di disuguaglianza (e lo XNOR il comparatore di uguaglianza). È anche il generatore di parità e, come si è visto, il rilevatore di overflow in CP2.</p>`,
  },

  {
    id: 'karnaugh',
    title: 'Sintesi & mappe di Karnaugh',
    blurb: 'Dalla tabella di verità al circuito minimo. Esce quasi sempre.',
    ref: 'Hamacher — Appendice A',
    trapIds: ['trap-and-assoc'],
    body: `
    <h4>Idea</h4>
    <p>La mappa dispone i mintermini in celle adiacenti secondo il <b>codice Gray</b>: fra due celle vicine cambia <b>una sola variabile</b>. Raggruppando gli <code>1</code> in blocchi di dimensione potenza di 2 si eliminano le variabili che cambiano dentro il gruppo, e restano solo quelle costanti.</p>

    <h4>Come si dispone la mappa</h4>
    <p>L'ordine delle colonne <b>non</b> è 00, 01, 10, 11 ma <b>00, 01, 11, 10</b>: è questa la sequenza in cui cambia un bit alla volta. A 4 variabili si applica lo stesso ordine anche alle righe:</p>
    <pre>        CD
       00  01  11  10
AB 00 | m0  m1  m3  m2
   01 | m4  m5  m7  m6
   11 | m12 m13 m15 m14
   10 | m8  m9  m11 m10</pre>
    <p>Sbagliare l'ordine è l'errore più comune: la mappa smette di essere adiacente e i raggruppamenti risultano invalidi.</p>

    <h4>Regole di raggruppamento</h4>
    <ul>
      <li>I gruppi hanno dimensione 1, 2, 4, 8… mai 3 o 6.</li>
      <li>Si fanno <b>più grandi possibile</b>: un gruppo di 2ᵏ celle elimina k variabili, quindi ogni raddoppio accorcia il termine di un letterale.</li>
      <li>I gruppi possono <b>sovrapporsi</b>: una cella già coperta può entrare in un altro gruppo se questo permette di allargarlo.</li>
      <li>L'adiacenza è <b>circolare</b>: prima e ultima colonna sono vicine, così come prima e ultima riga (wrap-around). I quattro angoli di una mappa a 4 variabili formano un gruppo valido.</li>
      <li>Ogni <code>1</code> deve finire in almeno un gruppo, e non si devono coprire zeri.</li>
    </ul>

    <h4>Implicanti primi ed essenziali</h4>
    <p>Un <b>implicante</b> è un gruppo valido; è <b>primo</b> se non può essere ingrandito ulteriormente. È <b>essenziale</b> se copre almeno un <code>1</code> che nessun altro implicante primo copre: gli essenziali vanno presi per forza. Si completa poi la copertura con il minor numero di implicanti primi rimanenti.</p>

    <h4>Esempio svolto</h4>
    <p>Sia <code>Y(A,B,C) = 1</code> per i mintermini 1, 3, 5, 7 — cioè ogni volta che <code>C = 1</code>, indipendentemente da A e B. Il gruppo di 4 celle elimina due variabili e la SOP minima è semplicemente:</p>
    <pre>Y = C          (1 termine, 1 letterale)</pre>
    <p>Scrivere <code>Y = ${ovl('A')}·C + A·C</code> è <b>corretto ma non minimo</b>: l'assorbimento lo riduce a <code>C</code>, e all'esame la non-minimalità viene penalizzata.</p>

    <h4>Le indifferenze (x)</h4>
    <p>Sono combinazioni che non si presentano mai, o il cui valore d'uscita è irrilevante. Si possono prendere <b>come 1 quando aiutano ad allargare un gruppo</b>, oppure lasciare a 0 quando non servono: si valutano <b>una per una</b>, non tutte insieme, e non vanno mai coperte da sole (un gruppo di sole indifferenze è inutile).</p>

    <h4>POS dalla mappa</h4>
    <p>Raggruppando gli <b>zeri</b> invece degli uni si ottiene ${ovl('Y')}; negando con De Morgan si ricava la forma POS. Talvolta è più corta della SOP: se la mappa ha pochi zeri, conviene provarla.</p>

    <h4>Dal risultato al circuito</h4>
    <p>Ogni termine prodotto diventa una porta AND, la somma finale una porta OR, le variabili negate degli invertitori. Nel disegno <b>scomponi in porte a 2 ingressi</b>: un prodotto di tre letterali si realizza con due AND in cascata.</p>
    <p>Allenati nel Simulatore → drill «Reti combinatorie»: la soluzione mostrata è calcolata da un minimizzatore esatto, quindi è sempre davvero minima.</p>`,
  },

  {
    id: 'ff',
    title: 'Circuiti sequenziali & flip-flop',
    blurb: 'Latch, flip-flop D/JK/T, master-slave, registri e contatori.',
    ref: 'Hamacher — Appendice A',
    trapIds: [],
    body: `
    <h4>Combinatorio vs sequenziale</h4>
    <p>In una rete <b>combinatoria</b> l'uscita dipende solo dagli ingressi attuali. In una rete <b>sequenziale</b> dipende anche dallo <b>stato</b>, cioè dalla storia passata: serve un elemento di memoria, ottenuto con la <b>retroazione</b> (l'uscita rientra come ingresso).</p>

    <h4>Il latch SR</h4>
    <p>Due porte NOR retroazionate incrociate. Con <code>S=1, R=0</code> l'uscita va a 1 (set); con <code>S=0, R=1</code> va a 0 (reset); con <code>S=R=0</code> <b>mantiene</b> lo stato precedente — è la memoria. La combinazione <code>S=R=1</code> è <b>proibita</b>: forza entrambe le uscite allo stesso valore e, al rilascio, lo stato finale è imprevedibile (dipende da quale porta commuta prima).</p>

    <h4>Il latch D e il problema della trasparenza</h4>
    <p>Il latch D elimina lo stato proibito generando <code>R</code> come negazione di <code>S</code>: c'è un solo ingresso dato. Con un segnale di abilitazione (<b>gated latch</b>) il dato passa solo quando il clock è alto — ma finché resta alto il latch è <b>trasparente</b>: ogni variazione dell'ingresso attraversa il dispositivo. In una rete retroazionata questo provoca corse e stati instabili.</p>

    <h4>Flip-flop: il fronte, non il livello</h4>
    <p>Un <b>flip-flop</b> è un elemento bistabile che memorizza <b>1 bit</b> e commuta solo sul <b>fronte</b> del clock (edge-triggered), non sul livello. L'istante di campionamento è quindi puntuale e prevedibile.</p>
    <ul>
      <li><b>Sincroni</b>: cambiano stato solo al fronte di clock.</li>
      <li><b>Asincroni</b>: reagiscono immediatamente agli ingressi, senza clock. Tipici gli ingressi di preset/clear, che agiscono comunque.</li>
    </ul>

    <h4>Master-slave</h4>
    <p>Due latch D in serie con clock opposti: il <b>master</b> campiona l'ingresso mentre il clock è alto, lo <b>slave</b> ne trasferisce il valore in uscita quando il clock commuta. Poiché i due stadi <b>non sono mai trasparenti contemporaneamente</b>, l'ingresso non può attraversare il dispositivo nello stesso ciclo: si evitano le corse e l'uscita cambia in un solo istante ben definito.</p>

    <h4>I tipi che escono all'esame</h4>
    <ul>
      <li><b>D</b>: <code>Q⁺ = D</code>. È il registro elementare.</li>
      <li><b>JK</b>: <code>J=K=0</code> mantiene, <code>J=1,K=0</code> set, <code>J=0,K=1</code> reset, <code>J=K=1</code> <b>commuta</b> (toggle). Non ha combinazioni proibite.</li>
      <li><b>T</b>: <code>T=0</code> mantiene, <code>T=1</code> commuta. È un JK con gli ingressi uniti; è il mattone dei contatori.</li>
    </ul>

    <h4>Registri e contatori</h4>
    <p>N flip-flop D in parallelo sullo stesso clock formano un <b>registro</b> a N bit. Collegandoli in cascata, con l'uscita di uno nell'ingresso del successivo, si ottiene un <b>registro a scorrimento</b> (shift register), usato per moltiplicare/dividere per 2 e per la conversione serie-parallelo.</p>
    <p>Un <b>contatore</b> si costruisce con flip-flop T. Nella versione <b>asincrona</b> (ripple) il clock di ogni stadio è l'uscita del precedente: semplice, ma i ritardi si accumulano e le uscite non cambiano tutte insieme. Nella versione <b>sincrona</b> tutti condividono lo stesso clock e la logica combinatoria decide chi commuta: più veloce e senza stati spuri.</p>

    <h4>Tempi</h4>
    <p>Il dato deve essere stabile un po' <b>prima</b> del fronte (<i>setup time</i>) e restare stabile un po' <b>dopo</b> (<i>hold time</i>). Il periodo minimo di clock è vincolato dal ritardo di propagazione più lungo fra due registri, più il setup.</p>`,
  },

  {
    id: 'cpu',
    title: 'Processore: datapath & unità di controllo',
    blurb: 'Registri, ciclo fetch-decode-execute, bus interni, controllo cablato vs microprogrammato.',
    ref: 'Hamacher cap. 5',
    trapIds: ['trap-rtn'],
    body: `
    <h4>I registri che devi saper nominare</h4>
    <ul>
      <li><b>PC</b> (Program Counter): indirizzo della <b>prossima</b> istruzione.</li>
      <li><b>IR</b> (Instruction Register): l'istruzione appena prelevata, in attesa di decodifica.</li>
      <li><b>MAR</b> (Memory Address Register): l'indirizzo presentato alla memoria.</li>
      <li><b>MDR</b> (Memory Data Register): il dato in transito da/verso la memoria.</li>
      <li><b>Registri generali</b> (R0…Rn): gli operandi su cui lavora la ALU.</li>
    </ul>
    <p>MAR e MDR sono l'interfaccia verso il bus: il processore non parla mai direttamente con la memoria.</p>

    <h4>Il ciclo fetch–decode–execute in RTN</h4>
    <p>Il prelievo di un'istruzione è sempre la stessa sequenza, qualunque sia l'istruzione:</p>
    <pre><span class="cm">; fase di fetch</span>
      MAR ← [PC]
      Avvia lettura in memoria
      PC  ← [PC] + 4        <span class="cm">; incremento immediato</span>
      IR  ← [MDR]
<span class="cm">; poi decodifica ed esecuzione, dipendenti dall'istruzione</span></pre>
    <p><b>Perché il PC si incrementa subito</b>, e non a fine istruzione: l'esecuzione è per default sequenziale, quindi conviene preparare l'indirizzo successivo mentre la memoria sta ancora rispondendo. Così, quando serve, il PC è già pronto — utile soprattutto in pipeline, dove il prelievo dell'istruzione seguente parte in anticipo. I salti si limitano a <b>sovrascrivere</b> il PC con un nuovo indirizzo.</p>

    <h4>Datapath a bus singolo</h4>
    <p>Tutti i registri si affacciano su un unico bus interno. È economico, ma consente <b>un solo trasferimento per volta</b>: una somma fra due registri richiede più passi (portare il primo operando in un registro temporaneo, poi il secondo alla ALU, poi scrivere il risultato). Le istruzioni durano quindi diversi cicli di clock.</p>

    <h4>Datapath a tre bus</h4>
    <p>Due bus di lettura e uno di scrittura permettono di presentare <b>entrambi</b> gli operandi alla ALU e di scriverne il risultato <b>nello stesso ciclo</b>. Il costo è più hardware e più connessioni, il guadagno è che un'operazione registro-registro si completa in un solo passo. È la struttura che rende praticabile la pipeline.</p>

    <h4>La ALU</h4>
    <p>Esegue le operazioni aritmetiche e logiche. Riceve gli operandi dai registri e vi <b>riscrive</b> il risultato: i valori intermedi di un calcolo stanno nei registri, non in memoria. Produce anche i <b>flag</b> di stato (zero, segno, riporto, overflow) su cui si basano i salti condizionati.</p>

    <h4>Unità di controllo</h4>
    <p>Genera, ciclo per ciclo, i segnali che aprono i buffer, abilitano le scritture nei registri e selezionano l'operazione della ALU. Due realizzazioni:</p>
    <ul>
      <li><b>Cablata</b> (hardwired): una rete sequenziale progettata su misura. Veloce, ma modificare l'insieme di istruzioni significa riprogettare il circuito. È la scelta tipica dei RISC.</li>
      <li><b>Microprogrammata</b>: i segnali di controllo sono parole memorizzate in una memoria di controllo, eseguite come un microprogramma. Flessibile e adatta a insiemi di istruzioni complessi, ma più lenta perché ogni passo richiede una lettura. È la scelta storica dei CISC.</li>
    </ul>

    <h4>RTN, la notazione richiesta</h4>
    <p>Le parentesi quadre significano «contenuto di». <code>Add R1,R2,R3</code> si scrive <code>R1 ← [R2]+[R3]</code>. «Aumenta di LOC il valore in R1» diventa <code>R1 ← [LOC]+[R1]</code>. Scrivere <code>R1 ← R2 + R3</code> senza parentesi significa sommare i <i>numeri dei registri</i>, non i loro contenuti.</p>`,
  },

  {
    id: 'isa',
    title: 'RISC vs CISC, indirizzamento & assembly',
    blurb: 'ISA, modi di indirizzamento, RTN, sottoprogrammi e pile.',
    ref: 'Hamacher cap. 2–3',
    trapIds: ['trap-rtn'],
    body: `
    <h4>RISC</h4>
    <ul>
      <li>Istruzioni semplici, di <b>lunghezza fissa</b> (una parola): la decodifica è immediata e il prelievo prevedibile.</li>
      <li>Modello <b>load/store</b>: solo <code>Load</code> e <code>Store</code> toccano la memoria; tutte le altre operano fra registri. Niente operazioni memoria-memoria.</li>
      <li>Pochi modi di indirizzamento, molti registri generali.</li>
      <li>Il compilatore fa più lavoro, l'hardware meno: circuito veloce e adatto alla pipeline. Esempi: ARM, Nios II.</li>
    </ul>

    <h4>CISC</h4>
    <ul>
      <li>Istruzioni complesse, di <b>lunghezza variabile</b>; una sola istruzione può leggere dalla memoria, calcolare e riscrivere.</li>
      <li>Molti modi di indirizzamento; programmi più corti in numero di istruzioni.</li>
      <li>Decodifica onerosa e durata variabile: la pipeline è più difficile da riempire. Esempi: Intel IA-32, ColdFire.</li>
    </ul>
    <p>Il confronto giusto non è «quale è più veloce» ma <b>dove si sposta la complessità</b>: nel compilatore (RISC) o nell'hardware (CISC).</p>

    <h4>Modi di indirizzamento</h4>
    <p>Rispondono alla domanda: dove sta l'operando?</p>
    <ul>
      <li><b>Immediato</b> — il valore è nell'istruzione. <code>Move R1, #5</code> → <code>R1 ← 5</code></li>
      <li><b>Registro</b> — l'operando è in un registro. <code>Move R1, R2</code> → <code>R1 ← [R2]</code></li>
      <li><b>Assoluto/diretto</b> — l'istruzione contiene l'indirizzo. <code>Load R1, LOC</code> → <code>R1 ← [LOC]</code></li>
      <li><b>Indiretto da registro</b> — il registro contiene l'indirizzo. <code>Load R1, (R2)</code> → <code>R1 ← [[R2]]</code></li>
      <li><b>Indicizzato / base+spiazzamento</b> — indirizzo = registro + costante. <code>Load R1, 8(R2)</code> → <code>R1 ← [[R2]+8]</code>. È il modo con cui si accede ai campi di una struttura e agli elementi di un vettore.</li>
      <li><b>Autoincremento / autodecremento</b> — come l'indiretto, ma il registro avanza da solo dopo (o prima) dell'accesso: scorre un vettore senza istruzioni aggiuntive.</li>
      <li><b>Relativo al PC</b> — indirizzo = PC + spiazzamento. Usato dai salti, rende il codice rilocabile.</li>
    </ul>

    <h4>Salti e condizioni</h4>
    <p>Un salto <b>incondizionato</b> sovrascrive il PC. Un salto <b>condizionato</b> lo fa solo se una condizione sui flag è verificata: tipicamente si esegue prima un <code>CMP</code> (una sottrazione che aggiorna i flag senza salvare il risultato) e poi un <code>BEQ</code>, <code>BGT</code>, <code>BLT</code>… Il confronto e il salto sono due istruzioni distinte.</p>

    <h4>Sottoprogrammi</h4>
    <p>Una chiamata deve ricordare <b>dove tornare</b>. Due meccanismi:</p>
    <ul>
      <li><b>Link register</b>: l'istruzione di chiamata salva il PC di ritorno in un registro dedicato. Rapido, ma un solo livello: se la subroutine ne chiama un'altra, il valore viene sovrascritto.</li>
      <li><b>Pila</b>: l'indirizzo di ritorno viene impilato. Supporta <b>annidamento e ricorsione</b>, che il solo link register non regge.</li>
    </ul>

    <h4>La pila</h4>
    <p>Struttura LIFO in memoria, gestita dallo <b>stack pointer</b> (SP) che punta alla cima. Cresce tipicamente verso gli indirizzi <b>bassi</b>:</p>
    <pre><span class="cm">; push di R1</span>
      Sub  SP, SP, #4
      Store R1, (SP)
<span class="cm">; pop in R1</span>
      Load R1, (SP)
      Add  SP, SP, #4</pre>
    <p>Sulla pila viaggiano indirizzo di ritorno, parametri, variabili locali e i registri che la subroutine deve preservare: l'insieme si chiama <b>record di attivazione</b>.</p>

    <h4>Un programma completo</h4>
    <pre><span class="cm">; moltiplicazione tramite somme successive (stile RISC)</span>
      Load  LOC1, NUM1
      Load  LOC2, NUM2
      Clear LOC3
<span class="lb">CICLO:</span> Sub   LOC2, LOC2, 1
      Add   LOC3, LOC3, LOC1
      Branch_if_[LOC2]&gt;0  CICLO
      Store LOC3, RES</pre>
    <p>Da leggere così: si azzera l'accumulatore, si somma il moltiplicando tante volte quanto vale il moltiplicatore, decrementando il contatore a ogni giro. Il salto è <b>in coda</b>, quindi il corpo viene eseguito almeno una volta.</p>

    <h4>Ordinamento dei byte</h4>
    <p><b>Big endian</b>: il byte più significativo all'indirizzo più basso — il bit di segno si trova quindi all'inizio. <b>Little endian</b>: il meno significativo per primo. Conta quando si scambiano dati fra macchine diverse o si accede a una parola byte per byte.</p>

    <h4>Dalla sorgente all'esecuzione</h4>
    <p>Il <b>compilatore</b> traduce in linguaggio macchina producendo file oggetto; il <b>linker</b> li combina risolvendo i riferimenti esterni; il <b>loader</b> porta il programma in memoria applicando lo spiazzamento necessario. Sono tre passaggi distinti, e all'esame vengono chiesti separatamente.</p>`,
  },

  {
    id: 'irq',
    title: 'Interruzioni, eccezioni & I/O',
    blurb: 'ISR, priorità e annidamento, vettorializzazione, polling vs interrupt, DMA.',
    ref: 'Hamacher cap. 4',
    trapIds: [],
    body: `
    <h4>Interruzioni</h4>
    <p>Segnali <b>hardware asincroni</b> che viaggiano sulle <b>linee di controllo</b> del bus, generati da dispositivi esterni. Sono asincroni nel senso che arrivano in un istante scorrelato dal programma in esecuzione.</p>

    <h4>Che cosa succede, nell'ordine</h4>
    <ol>
      <li>Il dispositivo alza la linea di richiesta.</li>
      <li>Il processore termina l'istruzione <b>in corso</b> — non la interrompe a metà.</li>
      <li>Salva lo <b>stato</b>: PC e registro di stato, più i registri che la routine userà.</li>
      <li>Disabilita (o abbassa) le interruzioni allo stesso livello, per non essere interrotto subito.</li>
      <li>Carica nel PC l'indirizzo della <b>ISR</b> (Interrupt Service Routine) ed esegue.</li>
      <li>Invia il riscontro al dispositivo, ripristina lo stato e riprende dall'istruzione successiva.</li>
    </ol>

    <h4>Priorità e annidamento</h4>
    <p>Con più dispositivi serve un ordine. A ogni sorgente si assegna un <b>livello di priorità</b>: una richiesta più urgente può interrompere una ISR in corso (<b>annidamento</b>), una meno urgente aspetta. Il processore mantiene un livello corrente e accetta solo le richieste superiori. Le interruzioni possono anche essere <b>mascherate</b> singolarmente.</p>

    <h4>Come si individua chi ha chiamato</h4>
    <ul>
      <li><b>Polling</b>: il processore interroga i dispositivi in sequenza finché trova quello che ha alzato la richiesta. Semplice, ma il tempo cresce con il numero di dispositivi.</li>
      <li><b>Vettorializzazione</b>: il dispositivo mette sul bus un identificatore, con cui il processore indicizza una <b>tabella dei vettori</b> e salta direttamente alla ISR giusta. Più veloce e indipendente dal numero di dispositivi.</li>
    </ul>

    <h4>Eccezioni</h4>
    <p>Eventi <b>sincroni</b>, generati dal processore durante l'esecuzione: divisione per zero, overflow, codice operativo illegale, violazione di protezione, chiamate di sistema. Sincroni perché riproducibili — rieseguendo lo stesso programma sugli stessi dati si ripresentano nello stesso punto.</p>
    <p>Un'eccezione è sollevata, per esempio, se un processo tenta di accedere alla memoria di altri utenti, di modificare la modalità del sistema o la priorità di altri processi.</p>

    <h4>Interruzioni vs eccezioni, in breve</h4>
    <pre>                interruzione        eccezione
origine         dispositivo esterno processore
sincronia       asincrona           sincrona
riproducibile   no                  sì
tipico uso      I/O, timer          errori, system call</pre>

    <h4>Il debugger</h4>
    <ul>
      <li><b>Trace mode</b>: un'eccezione dopo <b>ogni</b> istruzione → esecuzione passo-passo, si ispeziona lo stato a ogni passo.</li>
      <li><b>Breakpoint</b>: l'eccezione scatta solo in punti scelti → il programma corre a piena velocità fino al successivo.</li>
    </ul>

    <h4>I/O programmato e DMA</h4>
    <p>Nell'I/O <b>programmato</b> il processore trasferisce ogni parola personalmente: semplice ma spreca tempo di CPU. Con il <b>DMA</b> (Direct Memory Access) un controllore dedicato sposta interi blocchi fra periferica e memoria <b>senza</b> il processore, che riceve una sola interruzione a trasferimento concluso. È il meccanismo con cui si legge da disco senza paralizzare la macchina.</p>

    <h4>Bus e buffer</h4>
    <p>Un bus trasporta <b>dati, indirizzi e segnali di controllo</b>. Quando due dispositivi lavorano a velocità diverse si interpone un <b>buffer</b>, che compensa lo scarto accumulando i dati. La trasmissione può essere <b>parallela</b> (più bit insieme, corta distanza) o <b>seriale</b> (un bit per volta, come USB: meno fili, meno interferenze, distanze maggiori).</p>
    <p>Le interruzioni sono essenziali nei sistemi <b>real-time</b>, dove un evento deve essere servito entro un tempo massimo, e nei sistemi <b>multitasking</b>, dove il timer che scandisce i cambi di contesto è esso stesso una sorgente di interruzione.</p>`,
  },

  {
    id: 'pipe',
    title: 'Pipeline & prestazioni',
    blurb: 'Stadi, hazard sui dati e sul controllo, forwarding, equazione delle prestazioni.',
    ref: 'Hamacher cap. 6',
    trapIds: [],
    body: `
    <h4>L'equazione delle prestazioni</h4>
    <p>Il tempo di esecuzione di un programma si scompone in tre fattori:</p>
    <pre>T = (N × S) / R

N = numero di istruzioni eseguite
S = cicli di clock medi per istruzione (CPI)
R = frequenza di clock</pre>
    <p>Serve a ragionare sui compromessi: un CISC riduce <code>N</code> ma alza <code>S</code>; un RISC alza <code>N</code> e abbassa <code>S</code>. Migliorare un solo fattore non basta, ed è il motivo per cui «più megahertz» non implica «più veloce».</p>

    <h4>Pipelining</h4>
    <p>L'esecuzione si divide in stadi affidati a unità hardware distinte, tipicamente cinque:</p>
    <pre>F  Fetch     preleva l'istruzione
D  Decode    decodifica e legge i registri
E  Execute   opera nella ALU
M  Memory    accede alla memoria dati
W  Write     riscrive nel registro destinazione</pre>
    <p>Mentre un'istruzione è in uno stadio, la successiva occupa quello precedente: le esecuzioni si <b>sovrappongono</b> come in una catena di montaggio. La <b>latenza</b> della singola istruzione non migliora — anzi peggiora un poco — ma il <b>throughput</b> cresce: a regime esce un'istruzione per ciclo.</p>
    <p>Con k stadi lo speedup ideale è <b>k</b>, mai raggiunto del tutto perché gli stadi non sono perfettamente bilanciati (il periodo di clock è dettato dal più lento) e perché la pipeline si svuota e si riempie.</p>

    <h4>Hazard: quando la sovrapposizione non funziona</h4>
    <ul>
      <li><b>Strutturali</b>: due istruzioni vogliono la stessa risorsa nello stesso ciclo — per esempio un unico accesso alla memoria conteso fra fetch e load. Si risolvono duplicando la risorsa (cache istruzioni e cache dati separate).</li>
      <li><b>Sui dati</b>: un'istruzione ha bisogno di un risultato non ancora scritto.</li>
      <li><b>Di controllo</b>: dopo un salto non si sa quale istruzione prelevare.</li>
    </ul>

    <h4>Dipendenza dai dati e forwarding</h4>
    <p>Nel caso classico:</p>
    <pre>Add R3, R1, R2      <span class="cm">; R3 pronto solo allo stadio W</span>
Sub R5, R3, R4      <span class="cm">; ma serve gia allo stadio E</span></pre>
    <p>Senza rimedi la seconda istruzione deve <b>stallare</b> (si inseriscono bolle) finché il valore non è scritto. L'<b>operand forwarding</b> risolve inoltrando il risultato <b>direttamente</b> dall'uscita della ALU all'ingresso dello stadio che lo richiede, senza attendere la scrittura in registro. Un caso non eliminabile del tutto è il <i>load-use</i>: il dato arriva dalla memoria uno stadio più tardi e uno stallo resta necessario.</p>

    <h4>Salti</h4>
    <p>Il salto è noto solo dopo la decodifica, ma nel frattempo la pipeline ha già prelevato le istruzioni successive, che vanno scartate: è la <b>penalità di salto</b>. Mitigazioni:</p>
    <ul>
      <li><b>Predizione</b>: si tira a indovinare l'esito e si prosegue; se la previsione sbaglia si svuota la pipeline. Statica (es. «i salti all'indietro sono presi», tipico dei cicli) o dinamica, basata sulla storia recente.</li>
      <li><b>Delayed branch</b>: le istruzioni immediatamente successive al salto vengono eseguite comunque, e il compilatore vi colloca lavoro utile.</li>
      <li>Calcolare l'indirizzo di destinazione il prima possibile, per accorciare la finestra di incertezza.</li>
    </ul>

    <h4>Oltre una istruzione per ciclo</h4>
    <p>Un processore <b>superscalare</b> replica le unità funzionali e avvia più istruzioni per ciclo, portando il CPI sotto 1. Richiede però di individuare a runtime le istruzioni indipendenti, quindi hardware di controllo notevolmente più complesso.</p>`,
  },

  {
    id: 'mem',
    title: 'Gerarchia di memoria & cache',
    blurb: 'SRAM/DRAM, località, mappature, politiche di scrittura, tempo medio di accesso.',
    ref: 'Hamacher cap. 8',
    trapIds: ['trap-ram'],
    body: `
    <h4>La gerarchia</h4>
    <p>Scendendo dai registri alla memoria secondaria la capacità cresce e il costo per bit cala, ma il tempo di accesso peggiora di ordini di grandezza:</p>
    <pre>registri  →  cache L1  →  cache L2  →  memoria principale  →  disco
 più veloce, più costosa, più piccola  ⟶  più lenta, più economica, più grande</pre>
    <p>Una sola memoria grande e veloce sarebbe proibitiva per costo e comunque <b>più lenta</b>: indirizzare molte celle allunga la decodifica. Meglio più livelli.</p>

    <h4>SRAM e DRAM</h4>
    <ul>
      <li><b>SRAM</b>: la cella è un latch a transistor. Veloce, <b>non richiede refresh</b>, ma occupa molto spazio e costa: si usa per le cache.</li>
      <li><b>DRAM</b>: la cella è un condensatore con un transistor. Densa ed economica, ma il condensatore si <b>scarica per correnti di dispersione</b> e va <b>rinfrescato</b> periodicamente. È la memoria principale.</li>
    </ul>
    <p>Le DRAM <b>sincrone</b> allineano gli accessi al clock e trasferiscono raffiche di parole consecutive, ammortizzando il costo dell'indirizzamento su tutto il blocco.</p>
    <p>Sulla RAM, attenzione a come la si definisce: la sigla non va tradotta «ad accesso casuale». Il punto è che il <b>tempo di accesso non dipende dalla posizione</b> del dato, a differenza di un nastro o di un disco.</p>

    <h4>Perché la cache funziona: la località</h4>
    <ul>
      <li><b>Temporale</b>: un dato usato di recente sarà probabilmente riusato a breve (le variabili di un ciclo).</li>
      <li><b>Spaziale</b>: se si accede a un indirizzo, quelli vicini saranno probabilmente richiesti a breve (gli elementi di un vettore, le istruzioni in sequenza).</li>
    </ul>
    <p>La località spaziale è il motivo per cui la cache non trasferisce singole parole ma <b>blocchi</b> (linee) di parole contigue.</p>

    <h4>Hit, miss e il costo del miss</h4>
    <ul>
      <li><b>Hit</b>: il dato è in cache, accesso rapido.</li>
      <li><b>Miss</b>: non c'è, si scende nella gerarchia; il ritardo aggiuntivo è la <b>miss penalty</b>.</li>
    </ul>
    <p>Il tempo medio di accesso è quello che conta davvero:</p>
    <pre>t_medio = t_hit + miss_rate × miss_penalty</pre>
    <p>Con un hit rate del 95%, un hit da 1 ns e una penalità da 100 ns si ottiene <code>1 + 0,05·100 = 6 ns</code>: un miss su venti costa già cinque volte il tempo di un hit. Ecco perché anche piccoli miglioramenti dell'hit rate contano molto.</p>

    <h4>Come si mappa un blocco</h4>
    <p>L'indirizzo si scompone in tre campi: <b>tag</b>, <b>indice</b> (quale linea o insieme) e <b>offset</b> (quale parola dentro il blocco).</p>
    <ul>
      <li><b>Diretta</b>: ogni blocco ha una sola linea possibile, scelta dall'indice. Confronto di un solo tag, hardware minimo — ma due blocchi che mappano sulla stessa linea si sfrattano a vicenda anche con la cache semivuota (<b>conflitti</b>).</li>
      <li><b>Completamente associativa</b>: un blocco può andare ovunque. Sfrutta al meglio lo spazio, ma richiede di confrontare il tag con <b>tutte</b> le linee: costosa e più lenta.</li>
      <li><b>Set-associativa a n vie</b>: compromesso. La cache è divisa in insiemi; l'indice sceglie l'insieme, il blocco va in una qualsiasi delle n linee al suo interno. Si confrontano n tag.</li>
    </ul>

    <h4>Sostituzione</h4>
    <p>Quando l'insieme è pieno bisogna sfrattare qualcuno. <b>LRU</b> (least recently used) scarta il blocco non usato da più tempo ed è il più comune, perché aderisce alla località temporale. Alternative: <b>LFU</b> (meno usato in assoluto), FIFO, casuale — più economiche da realizzare, meno efficaci.</p>

    <h4>Politiche di scrittura</h4>
    <ul>
      <li><b>Write-through</b>: si scrive contemporaneamente in cache e in memoria. Semplice e sempre coerente, ma genera molto traffico.</li>
      <li><b>Write-back</b>: si scrive solo in cache e si marca la linea con un <b>dirty bit</b>; la memoria viene aggiornata solo quando la linea è sfrattata. Molto meno traffico, ma la memoria è temporaneamente non aggiornata.</li>
    </ul>

    <h4>Memorie a sola lettura</h4>
    <p><b>ROM</b> scritta in fabbrica; <b>PROM</b> programmabile una volta; <b>EPROM</b> cancellabile con <b>raggi ultravioletti</b>; <b>EEPROM</b> cancellabile <b>elettricamente</b>, byte per byte; <b>Flash</b>, evoluzione della EEPROM che cancella a blocchi. La coppia EPROM/EEPROM è chiesta spesso: il discrimine è UV contro elettrico.</p>`,
  },

  {
    id: 'vm',
    title: 'Memoria virtuale & TLB',
    blurb: 'Spazio logico e fisico, paginazione, page fault, traduzione degli indirizzi.',
    ref: 'Hamacher cap. 8',
    trapIds: ['trap-ram'],
    body: `
    <h4>Il problema</h4>
    <p>I programmi possono essere più grandi della memoria fisica, e più programmi devono coesistere senza pestarsi i piedi. La <b>memoria virtuale</b> risolve entrambe le cose: ogni processo lavora su uno spazio di indirizzi <b>logico</b> tutto suo, che il sistema mappa sulla memoria <b>fisica</b> disponibile, appoggiandosi al disco per ciò che non ci sta.</p>

    <h4>Paginazione</h4>
    <p>Lo spazio logico è diviso in <b>pagine</b> di dimensione fissa, la memoria fisica in <b>frame</b> della stessa dimensione. Una pagina qualsiasi può stare in un frame qualsiasi: non serve contiguità, quindi non c'è frammentazione esterna.</p>
    <p>L'indirizzo virtuale si spezza in due campi:</p>
    <pre>| numero di pagina | offset nella pagina |
        ↓ tradotto           ↓ invariato
| numero di frame  | offset nella pagina |</pre>
    <p>L'offset non viene toccato: pagina e frame hanno la stessa dimensione, quindi cambia solo la parte alta dell'indirizzo.</p>

    <h4>La tabella delle pagine</h4>
    <p>Contiene, per ogni pagina, il frame che la ospita più alcuni bit di controllo: <b>valid</b> (la pagina è in memoria?), <b>dirty</b> (è stata modificata?), <b>bit di protezione</b> (lettura/scrittura/esecuzione), bit di riferimento per le politiche di sostituzione. Ogni processo ha la propria tabella: è così che si ottiene l'<b>isolamento</b> fra processi, e condividendo deliberatamente alcune voci si ottiene la <b>condivisione</b> di codice o dati.</p>

    <h4>Page fault</h4>
    <p>Se il bit valid è 0 la pagina non è in memoria: si solleva un'<b>eccezione</b> di page fault. Il sistema operativo sceglie una vittima (tipicamente con criteri LRU), la riscrive su disco <b>solo se</b> è dirty, carica la pagina richiesta e fa <b>rieseguire</b> l'istruzione interrotta. Il costo è quello di un accesso a disco: milioni di cicli, ordini di grandezza più di un cache miss. Per questo la sostituzione si può permettere algoritmi sofisticati in software.</p>

    <h4>Il TLB</h4>
    <p>La tabella delle pagine sta in memoria: tradurre un indirizzo richiederebbe un accesso in più <b>per ogni</b> accesso: si raddoppierebbe il costo di tutto. Il <b>TLB</b> (Translation Lookaside Buffer) è una piccola cache completamente o set-associativa delle traduzioni usate di recente.</p>
    <ol>
      <li>Il processore emette un indirizzo virtuale.</li>
      <li>Si cerca il numero di pagina nel TLB. <b>TLB hit</b> → il frame è immediato.</li>
      <li><b>TLB miss</b> → si legge la tabella delle pagine in memoria e si aggiorna il TLB.</li>
      <li>Se anche la tabella dice «non valida» → page fault.</li>
    </ol>
    <p>Funziona per la stessa ragione della cache: la <b>località</b>. Un programma insiste su poche pagine per volta, quindi anche un TLB di poche decine di voci raggiunge percentuali di successo altissime.</p>

    <h4>Rapporto con la cache</h4>
    <p>Sono due meccanismi distinti che si sommano: il TLB accelera la <b>traduzione</b> degli indirizzi, la cache accelera l'<b>accesso ai dati</b>. Un accesso può quindi fare TLB hit e cache miss, o viceversa. Da tenere separati anche a parole: la cache sta fra CPU e memoria principale, la memoria virtuale fra memoria principale e disco.</p>`,
  },

  {
    id: 'ieee',
    title: 'Virgola mobile IEEE 754',
    blurb: 'Segno, esponente polarizzato, mantissa, codifica e valori speciali.',
    ref: 'Hamacher cap. 1',
    trapIds: [],
    body: `
    <h4>Perché serve</h4>
    <p>Con la virgola fissa il numero di cifre decimali è deciso una volta per tutte e l'intervallo è angusto. La virgola mobile spende i bit su una <b>notazione scientifica binaria</b>, <code>± mantissa × 2^esponente</code>, ottenendo un intervallo enormemente più ampio a parità di bit — al prezzo di una precisione <b>relativa</b> anziché assoluta.</p>

    <h4>Singola precisione (32 bit)</h4>
    <pre>| S |   E (8 bit)  |        M (23 bit)        |
  1        8                    23</pre>
    <ul>
      <li><b>S</b>: segno, 0 positivo e 1 negativo.</li>
      <li><b>E</b>: esponente <b>polarizzato</b> con bias <b>127</b>: si memorizza <code>E = esponente reale + 127</code>. Serve a rappresentare esponenti negativi senza un secondo bit di segno, e permette di confrontare i float come se fossero interi.</li>
      <li><b>M</b>: mantissa, la parte dopo la virgola. Il <b>bit implicito</b> «1.» non si memorizza: normalizzando, la cifra prima della virgola è sempre 1, quindi si guadagna un bit gratis.</li>
    </ul>
    <p>Valore = <code>(−1)ˢ · 1.M · 2^(E−127)</code></p>

    <h4>Codificare un numero — esempio</h4>
    <p>Si voglia rappresentare <code>−6,5</code>:</p>
    <ol>
      <li>In binario: <code>6,5 = 110,1₂</code></li>
      <li>Normalizzo: <code>110,1 = 1,101 × 2²</code> → mantissa <code>101</code>, esponente reale <code>2</code></li>
      <li>Polarizzo: <code>E = 2 + 127 = 129 = 10000001₂</code></li>
      <li>Segno: negativo → <code>S = 1</code></li>
    </ol>
    <pre>1 10000001 10100000000000000000000</pre>
    <p>Per <b>decodificare</b> si procede a ritroso: si sottrae il bias dall'esponente, si rimette l'1 implicito davanti alla mantissa e si sposta la virgola.</p>

    <h4>Doppia precisione (64 bit)</h4>
    <p>1 bit di segno, <b>11</b> di esponente con bias <b>1023</b>, <b>52</b> di mantissa. Stessa logica, più intervallo e più precisione.</p>

    <h4>Valori speciali</h4>
    <p>Due configurazioni dell'esponente sono riservate:</p>
    <ul>
      <li><code>E = 0</code> con mantissa nulla → <b>zero</b> (con segno: esistono +0 e −0).</li>
      <li><code>E = 0</code> con mantissa non nulla → numeri <b>denormalizzati</b>, senza bit implicito: riempiono il vuoto attorno allo zero.</li>
      <li><code>E = 255</code> (tutti 1) con mantissa nulla → <b>infinito</b>, con segno.</li>
      <li><code>E = 255</code> con mantissa non nulla → <b>NaN</b>, risultato di operazioni indefinite come 0/0.</li>
    </ul>

    <h4>Da ricordare</h4>
    <p>Lo standard si chiama <b>IEEE 754</b>. Due conseguenze pratiche: l'addizione in virgola mobile <b>non è associativa</b>, perché ogni passaggio arrotonda; e molti decimali «semplici» come 0,1 non hanno rappresentazione binaria finita, quindi il confronto per uguaglianza fra float è inaffidabile.</p>`,
  },
];
