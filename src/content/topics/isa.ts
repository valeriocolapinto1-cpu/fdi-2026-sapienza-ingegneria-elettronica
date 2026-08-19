import type { Topic } from '../types';

export const isa: Topic = {
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
  };
