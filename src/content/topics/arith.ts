import type { Topic } from '../types';
import { ovl } from './_ovl';

export const arith: Topic = {
  id: 'arith',
  title: 'Aritmetica hardware: sommatori & moltiplicazione',
  blurb: 'Semisommatore, sommatore completo, ripple-carry, carry-lookahead, moltiplicazione.',
  ref: 'Hamacher cap. 9',
  trapIds: ['trap-and-assoc'],
    prereq: ['bin', 'comb'],
    diagramIds: ['sommatore-ripple'],
    summary: [
      '<b>Semisommatore</b>: S = A ⊕ B, riporto = A · B. <b>Sommatore completo</b>: aggiunge il riporto entrante, S = A ⊕ B ⊕ Cin.',
      '<b>Ripple-carry</b>: n sommatori completi in cascata. Semplice, ma il ritardo cresce <b>linearmente</b> con n perché il riporto deve attraversarli tutti.',
      '<b>Carry-lookahead</b>: G = A·B (genera), P = A ⊕ B (propaga); i riporti si calcolano in parallelo. Ritardo quasi costante, molte più porte.',
      'Un solo circuito per somma e sottrazione: A − B = A + B̅ + 1, cioè si invertono i bit di B e si forza a 1 il riporto entrante.',
      'Moltiplicazione = <b>somme e spostamenti</b>; l\'algoritmo di Booth tratta i numeri in complemento a 2 senza casi particolari.',
    ],
    checks: [
      {
        q: 'Perché il ripple-carry è lento, e quanto?',
        a: 'Il riporto di ogni stadio dipende da quello precedente, quindi il risultato è pronto solo dopo che il riporto ha attraversato tutti gli stadi: il ritardo è circa n volte quello di un sommatore completo, cioè cresce <b>linearmente</b> col numero di bit.',
      },
      {
        q: 'Che cosa significa che uno stadio «genera» o «propaga» il riporto?',
        a: '<b>Genera</b> se produce un riporto da solo, indipendentemente da quello entrante: succede quando A = B = 1, cioè G = A·B. <b>Propaga</b> se lascia passare il riporto entrante: succede quando A ⊕ B = 1. Da queste due funzioni si ricavano tutti i riporti in parallelo.',
      },
      {
        q: 'Come si esegue una sottrazione avendo solo un sommatore?',
        a: 'Si invertono i bit del sottraendo e si mette a 1 il riporto entrante del primo stadio: invertire + 1 è esattamente il complemento a 2, quindi A + (−B) senza circuiti aggiuntivi.',
      },
    ],
  body: `
    <h4>Semisommatore (half adder)</h4>
    <p>Somma <b>due</b> bit e produce somma e riporto. Non accetta un riporto entrante, ed è per
    questo che si chiama «mezzo»:</p>
    <pre>a  b │  s   c
0  0 │  0   0
0  1 │  1   0
1  0 │  1   0
1  1 │  0   1</pre>
    <p>Si legge direttamente dalla tabella: <code>s = a ⊕ b</code> e <code>c = a · b</code>. La
    somma è uno XOR perché vale 1 quando i bit sono <b>diversi</b>; il riporto è un AND perché
    esce solo quando sono entrambi 1.</p>

    <h4>Sommatore completo (full adder)</h4>
    <p>Per sommare numeri di più bit ogni stadio deve accettare anche il <b>riporto entrante</b>
    <code>c<sub>i</sub></code> prodotto dallo stadio precedente. Con tre ingressi:</p>
    <ul>
      <li><code>s<sub>i</sub> = a<sub>i</sub> ⊕ b<sub>i</sub> ⊕ c<sub>i</sub></code> — la somma
      vale 1 quando il numero di ingressi a 1 è <b>dispari</b>.</li>
      <li><code>c<sub>i+1</sub> = a<sub>i</sub>·b<sub>i</sub> + c<sub>i</sub>·(a<sub>i</sub> ⊕ b<sub>i</sub>)</code>
      — il riporto esce se entrambi gli addendi valgono 1, oppure se ne vale uno e c'era già un
      riporto entrante.</li>
    </ul>
    <p>Si realizza con due semisommatori più una OR. Nel disegno ricordati di scomporre in porte
    a 2 ingressi.</p>

    <h4>Ripple-carry: semplice ma lento</h4>
    <p>Mettendo n sommatori completi in cascata, con il riporto uscente di ciascuno collegato al
    riporto entrante del successivo, si ottiene un sommatore a n bit:</p>
    <pre>   a₃b₃      a₂b₂      a₁b₁      a₀b₀
    │ │       │ │       │ │       │ │
  ┌─▼─▼─┐   ┌─▼─▼─┐   ┌─▼─▼─┐   ┌─▼─▼─┐
c₄│ FA  │◄c₃│ FA  │◄c₂│ FA  │◄c₁│ FA  │◄ c₀
  └──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘
     s₃        s₂        s₁        s₀</pre>
    <p>Il difetto è nel nome: il riporto <b>si propaga a ondate</b>. Lo stadio più significativo
    non può produrre il risultato definitivo finché non gli arriva il riporto, che ha attraversato
    tutti gli stadi precedenti. Il ritardo cresce <b>linearmente con n</b>: raddoppiare i bit
    raddoppia il tempo di somma. È il caso peggiore che detta il periodo di clock.</p>

    <h4>Carry-lookahead: calcolare i riporti in anticipo</h4>
    <p>L'idea è non aspettare il riporto ma <b>prevederlo</b>. Per ogni posizione si definiscono
    due funzioni che dipendono solo dagli operandi, quindi disponibili subito:</p>
    <ul>
      <li><b>Generate</b> <code>G<sub>i</sub> = a<sub>i</sub> · b<sub>i</sub></code> — questa
      posizione <i>genera</i> un riporto per conto suo, qualunque cosa arrivi da destra.</li>
      <li><b>Propagate</b> <code>P<sub>i</sub> = a<sub>i</sub> ⊕ b<sub>i</sub></code> — questa
      posizione <i>propaga</i> il riporto che riceve.</li>
    </ul>
    <p>Da cui <code>c<sub>i+1</sub> = G<sub>i</sub> + P<sub>i</sub>·c<sub>i</sub></code>.
    Espandendo la ricorsione si esprime <b>ogni</b> riporto direttamente in funzione di
    <code>c<sub>0</sub></code>:</p>
    <pre>c₁ = G₀ + P₀c₀
c₂ = G₁ + P₁G₀ + P₁P₀c₀
c₃ = G₂ + P₂G₁ + P₂P₁G₀ + P₂P₁P₀c₀</pre>
    <p>Tutti i riporti si calcolano <b>in parallelo</b>, con due soli livelli di porte: il ritardo
    diventa quasi indipendente da n. Il prezzo è il numero di porte, che cresce rapidamente —
    perciò si costruiscono blocchi da 4 bit e li si mette in cascata, applicando lo stesso schema
    un livello più su (lookahead gerarchico).</p>

    <h4>Sommatore/sottrattore unico</h4>
    <p>In complemento a 2 la sottrazione è la somma dell'opposto, e l'opposto è «inverti e
    aggiungi 1». Basta quindi un segnale di controllo <code>Sub</code>:</p>
    <ul>
      <li>ogni bit di B passa per uno XOR con <code>Sub</code>: se <code>Sub = 1</code> viene
      invertito, se vale 0 passa intatto;</li>
      <li><code>Sub</code> entra anche come riporto iniziale <code>c<sub>0</sub></code>,
      fornendo il «+1».</li>
    </ul>
    <p>Un solo circuito fa entrambe le operazioni: è la ragione pratica per cui si usa il
    complemento a 2 e non il modulo e segno.</p>

    <h4>Moltiplicazione per somme e spostamenti</h4>
    <p>Il metodo è quello che si usa a mano: per ogni bit del moltiplicatore, se vale 1 si somma
    il moltiplicando opportunamente <b>spostato</b>, altrimenti si somma zero.</p>
    <pre>    1 1 0 1   (13)
  × 1 0 1 1   (11)
  ─────────
    1 1 0 1     ← bit 0 = 1
   1 1 0 1      ← bit 1 = 1, spostato di 1
  0 0 0 0       ← bit 2 = 0
 1 1 0 1        ← bit 3 = 1, spostato di 3
 ───────────
 1 0 0 0 1 1 1 1   (143)</pre>
    <p>In hardware si realizza con una matrice di sommatori (<i>array multiplier</i>), oppure in
    modo sequenziale con un accumulatore e un registro a scorrimento — che è esattamente ciò che
    fa il programma assembly «moltiplicazione tramite somme ripetute». Il prodotto di due numeri
    a n bit occupa <b>2n bit</b>.</p>
    <p>Con i numeri con segno la somma-e-sposta ingenua sbaglia: serve l'estensione del segno sui
    prodotti parziali, oppure l'algoritmo di <b>Booth</b>, che ricodifica il moltiplicatore
    guardando coppie di bit adiacenti e sostituisce lunghe sequenze di 1 con una sottrazione più
    una somma.</p>

    <h4>Divisione</h4>
    <p>Anche qui si imita il procedimento a mano: si confronta il divisore con il resto parziale,
    si sottrae quando ci sta e si scrive 1 nel quoziente, altrimenti si scrive 0. Nella variante
    <b>restoring</b> la sottrazione si esegue sempre e, se il risultato è negativo, si ripristina
    il resto sommando indietro il divisore; nella <b>non-restoring</b> si evita il ripristino
    alternando somme e sottrazioni. La divisione per zero è tipicamente un'<b>eccezione</b>.</p>

    <h4>Perché conta all'esame</h4>
    <p>Questa è la parte che collega l'algebra di Boole al processore: la ALU è fatta così, e le
    domande sul <b>ritardo</b> nascono qui — un ripple-carry a 32 bit è lento perché il riporto
    attraversa 32 stadi in cascata, ed è questo cammino a fissare il periodo minimo di clock.
    L'espressione ${ovl('a')}·b + a·${ovl('b')} che riconosci come XOR è la somma del
    semisommatore.</p>
    <h4>Esempio svolto</h4>
    <p><b>Somma 5 + 6 su 4 bit con un ripple-carry, mostrando i riporti.</b></p>
    <pre>riporti:  0 1 1 0
   A   =    0 1 0 1   (5)
   B   =    0 1 1 0   (6)
  ────────────────────
   S   =    1 0 1 1   (−5 letto in CP2!)</pre>
    <p>Il riporto <b>entrante</b> nel bit di segno è 1, quello <b>uscente</b> è 0: 1 ⊕ 0 = 1, quindi <b>overflow</b>. Ed è giusto: su 4 bit il massimo è +7, e 11 non ci sta. Il risultato letto in CP2 vale −5 e non ha senso — la macchina non se ne accorge da sola, per questo esiste il flag.</p>
    <p><b>Ora 5 − 6 con lo stesso circuito.</b> Si invertono i bit di B e si forza a 1 il riporto entrante:</p>
    <pre>B = 0110  →  B̄ = 1001,  Cin = 1

  0101 + 1001 + 1 = 1111  =  −1 ✓
riporto uscente 0, riporto entrante nel segno 0  →  nessun overflow</pre>
    <p>Un unico sommatore fa entrambe le operazioni: la linea di controllo che sceglie somma o sottrazione pilota sia gli XOR che invertono B, sia il riporto entrante.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Invertire B e dimenticare il riporto entrante a 1: si sottrae B+1 invece di B.</li>
      <li>Dichiarare overflow guardando solo il riporto uscente: serve lo <b>XOR</b> dei due riporti sul bit di segno.</li>
      <li>Nella moltiplicazione, sommare i prodotti parziali senza <b>estendere il segno</b> quando si lavora in complemento a 2 (è il problema che l'algoritmo di Booth risolve).</li>
    </ul>`,
};
