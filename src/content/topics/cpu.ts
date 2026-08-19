import type { Topic } from '../types';

export const cpu: Topic = {
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
  };
