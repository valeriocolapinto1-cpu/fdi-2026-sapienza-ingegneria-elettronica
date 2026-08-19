import type { Topic } from '../types';
import { ovl } from './_ovl';

export const bool: Topic = {
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
      <li><b>Commutatività</b>: <code>A∧B = B∧A</code>, <code>A∨B = B∨A</code></li>
      <li><b>Associatività</b>: <code>(A∧B)∧C = A∧(B∧C)</code>, e lo stesso per ∨</li>
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

    <h4>L'algebra booleana degli insiemi</h4>
    <p>La stessa struttura algebrica descrive due mondi diversi: la logica della commutazione e
    gli insiemi. Le operazioni si corrispondono una a una:</p>
    <pre>logica          insiemi                significato
A ∨ B  (OR)     A ∪ B  (unione)        sta in almeno uno dei due
A ∧ B  (AND)    A ∩ B  (intersezione)  sta in entrambi
NOT A           complemento di A        tutto ciò che non sta in A
1               insieme universo
0               insieme vuoto
A ⊕ B  (XOR)    differenza simmetrica   sta in uno solo dei due</pre>
    <p>Ecco perché le stesse leggi valgono di là: De Morgan diventa «il complemento dell'unione è
    l'intersezione dei complementi», e i diagrammi di Venn sono una dimostrazione visiva dei
    teoremi booleani. All'esame la domanda arriva in entrambe le direzioni: quale operazione
    insiemistica corrisponde all'OR (l'<b>unione</b>), e quale proprietà è fondamentale
    nell'algebra di Boole (la <b>commutatività</b> — l'AND è associativo e commutativo come l'OR,
    contrariamente a quanto suggeriscono certe abitudini di disegno).</p>

    <h4>XOR, che torna spesso</h4>
    <p><code>A⊕0 = A</code>, <code>A⊕1 = ${ovl('A')}</code>, <code>A⊕A = 0</code>. Lo XOR vale 1 quando gli ingressi sono <b>diversi</b>, quindi è il rilevatore di disuguaglianza (e lo XNOR il comparatore di uguaglianza). È anche il generatore di parità e, come si è visto, il rilevatore di overflow in CP2.</p>`,
  };
