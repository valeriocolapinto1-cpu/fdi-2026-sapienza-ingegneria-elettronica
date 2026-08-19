import type { Topic } from '../types';
import { ovl } from './_ovl';

export const arith: Topic = {
  id: 'arith',
  title: 'Aritmetica hardware: sommatori & moltiplicazione',
  blurb: 'Semisommatore, sommatore completo, ripple-carry, carry-lookahead, moltiplicazione.',
  ref: 'Hamacher cap. 9',
  trapIds: ['trap-and-assoc'],
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
    semisommatore.</p>`,
};
