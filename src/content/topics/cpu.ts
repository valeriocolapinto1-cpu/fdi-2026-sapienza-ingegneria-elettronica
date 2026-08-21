import type { Topic } from '../types';

export const cpu: Topic = {
    id: 'cpu',
    title: 'Processore: datapath & unità di controllo',
    blurb: 'Registri, ciclo fetch-decode-execute, bus interni, controllo cablato vs microprogrammato.',
    ref: 'Hamacher cap. 5',
    trapIds: ['trap-rtn'],
    prereq: ['ff', 'comb'],
    diagramIds: ['unita-funzionali', 'processore-3bus'],
    summary: [
      'Registri da saper nominare: <b>PC</b> (prossima istruzione), <b>IR</b> (istruzione corrente), <b>MAR</b> e <b>MDR</b> (interfaccia con la memoria), più il banco dei registri generali.',
      'Il ciclo è sempre lo stesso: <b>prelievo → decodifica → esecuzione</b>, e si descrive in RTN.',
      'Datapath a <b>bus singolo</b>: un solo trasferimento per volta, quindi più cicli per istruzione. A <b>tre bus</b>: due sorgenti e una destinazione insieme, un\'operazione ALU per ciclo.',
      'L\'unità di controllo genera i segnali: <b>cablata</b> (veloce, rigida) o <b>microprogrammata</b> (flessibile, più lenta — tipica dei CISC).',
      'In RTN le <b>parentesi quadre</b> indicano «il contenuto di», quindi stanno sulle sorgenti e non sulla destinazione.',
    ],
    checks: [
      {
        q: 'Scrivi in RTN il prelievo dell\'istruzione.',
        a: '<code>PC<sub>out</sub>, MAR<sub>in</sub>, Read</code> · <code>MDR<sub>out</sub>, IR<sub>in</sub></code>, con <code>PC ← [PC] + 4</code> eseguito mentre si attende la memoria. La destinazione non porta parentesi, le sorgenti sì.',
      },
      {
        q: 'Perché il datapath a bus singolo richiede più cicli per la stessa istruzione?',
        a: 'Perché sul bus può viaggiare un solo dato per volta: i due operandi della ALU vanno portati in cicli distinti, appoggiandoli a un registro temporaneo. Con tre bus i due operandi e il risultato viaggiano insieme.',
      },
      {
        q: 'Differenza fra unità di controllo cablata e microprogrammata.',
        a: 'La cablata è una rete logica fissa: veloce, ma cambiare un\'istruzione significa ridisegnarla. La microprogrammata legge microistruzioni da una memoria di controllo: più lenta, ma si modifica riscrivendo il microcodice.',
      },
    ],
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
    <p>Le parentesi quadre significano «contenuto di». <code>Add R1,R2,R3</code> si scrive <code>R1 ← [R2]+[R3]</code>. «Aumenta di LOC il valore in R1» diventa <code>R1 ← [LOC]+[R1]</code>. Scrivere <code>R1 ← R2 + R3</code> senza parentesi significa sommare i <i>numeri dei registri</i>, non i loro contenuti.</p>
    <h4>Esempio svolto</h4>
    <p><b>Scrivi la sequenza di controllo completa di <code>Add R1, R2, R3</code> su un datapath a bus singolo</b> (R1 ← [R2] + [R3]).</p>
    <pre>1.  PC_out, MAR_in, Read, Select4, Add, Z_in     ; prelievo + PC ← [PC]+4
2.  Z_out, PC_in, WMFC                          ; attende la memoria
3.  MDR_out, IR_in                              ; istruzione in IR
4.  R2_out, Y_in                                ; primo operando nel temporaneo
5.  R3_out, SelectY, Add, Z_in                  ; ALU: [Y] + [R3] → Z
6.  Z_out, R1_in, End                           ; risultato nel registro</pre>
    <p>Sei passi, e i primi tre sono <b>sempre gli stessi</b>: il prelievo non dipende dall'istruzione. Il registro <code>Y</code> serve perché sul bus singolo può viaggiare un solo operando per volta: il primo va parcheggiato. <code>WMFC</code> (<i>wait for memory function completed</i>) è l'attesa della memoria, che è molto più lenta del processore.</p>
    <p>Su un datapath a <b>tre bus</b> i passi 4-6 collassano in uno solo: i due operandi escono insieme su bus A e B e il risultato rientra su bus C nello stesso ciclo.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Mettere le parentesi quadre sulla destinazione: si scrive <code>R1 ← [R2] + [R3]</code>, mai <code>[R1] ←</code>. Le quadre significano «il contenuto di», e il contenuto non è una destinazione.</li>
      <li>Dimenticare l'incremento del PC, o metterlo in un passo suo: si fa <b>durante</b> l'attesa della memoria, che altrimenti sarebbe tempo perso.</li>
      <li>Saltare il <code>WMFC</code> e leggere MDR troppo presto.</li>
    </ul>`,
    exercises: [
      {
        id: 'ex-cpu-1',
        level: 'base',
        q: 'Un’istruzione deve leggere un dato dalla memoria. Quali registri entrano in gioco, in che ordine, e a che serve ciascuno?',
        hint: 'La memoria non parla direttamente con i registri generali: c’è sempre una coppia di registri che fa da interfaccia.',
        solution: `<pre>1. l'indirizzo del dato va in <b>MAR</b>   (Memory Address Register)
2. si attiva il segnale <b>Read</b>
3. la memoria deposita il dato in <b>MDR</b> (Memory Data Register)
4. da MDR il dato passa al registro destinazione</pre><p>MAR e MDR esistono perché la memoria è lenta e sta «fuori»: servono due punti di appoggio stabili, uno per l’indirizzo e uno per il dato, mentre il processore aspetta. L’attesa ha anche un nome nei diagrammi di controllo: <b>WMFC</b>, cioè «attendi che la memoria abbia finito».</p><p>Gli altri due registri da saper nominare sono <b>PC</b>, che contiene l’indirizzo della prossima istruzione, e <b>IR</b>, che contiene l’istruzione in corso di esecuzione.</p>`,
      },
      {
        id: 'ex-cpu-2',
        level: 'base',
        q: 'Scrivi in RTN la sequenza di <b>prelievo dell’istruzione</b> e spiega perché l’incremento del PC si colloca proprio lì.',
        hint: 'Il prelievo è uguale per tutte le istruzioni. Chiediti che cosa fa il processore mentre aspetta la risposta della memoria.',
        solution: `<pre>1.  PC_out, MAR_in, Read, Select4, Add, Z_in
2.  Z_out, PC_in, WMFC
3.  MDR_out, IR_in</pre><p>Passo per passo: l’indirizzo della prossima istruzione esce dal PC e finisce in MAR, si avvia la lettura, e <b>contemporaneamente</b> la ALU calcola PC + 4 mettendolo nel registro temporaneo Z. Al passo 2 quel valore torna nel PC mentre si attende la memoria. Al passo 3 l’istruzione arrivata in MDR viene copiata in IR.</p><p>L’incremento sta lì perché la memoria impiega comunque diversi cicli: farlo durante l’attesa <b>non costa nulla</b>. Metterlo in un passo separato allungherebbe ogni istruzione di un ciclo — su miliardi di istruzioni, una differenza enorme.</p>`,
      },
      {
        id: 'ex-cpu-3',
        level: 'esame',
        q: 'Scrivi la sequenza di controllo completa dell’istruzione <code>Load R1, (R2)</code> su un datapath a <b>bus singolo</b>: carica in R1 il contenuto della cella il cui indirizzo sta in R2.',
        hint: 'Prelievo (tre passi, sempre gli stessi) più la parte specifica. La memoria va letta due volte: una per l’istruzione, una per il dato.',
        solution: `<pre>1.  PC_out, MAR_in, Read, Select4, Add, Z_in
2.  Z_out, PC_in, WMFC
3.  MDR_out, IR_in
────────────────────────── fine prelievo
4.  R2_out, MAR_in, Read
5.  WMFC
6.  MDR_out, R1_in, End</pre><p>Al passo 4 il contenuto di R2 — che è un <b>indirizzo</b> — viene mandato a MAR e parte la seconda lettura. Il passo 5 è pura attesa: qui, a differenza del prelievo, non c’è nulla di utile da fare in parallelo. Al passo 6 il dato passa da MDR a R1.</p><p>Se l’istruzione fosse stata <code>Load R1, 20(R2)</code> servirebbe un passo in più per sommare lo spiazzamento: R2 in Y, poi lo spiazzamento dall’IR sommato a Y e il risultato in MAR.</p>`,
      },
      {
        id: 'ex-cpu-4',
        level: 'esame',
        q: 'L’istruzione <code>Add R1, R2, R3</code> richiede 6 cicli su un datapath a bus singolo e 4 su uno a tre bus. Con un ciclo di clock da 2 ns, quanto dura l’istruzione nei due casi? E su un programma di 10⁶ istruzioni analoghe?',
        hint: 'Moltiplica cicli per durata del ciclo, poi scala. Chiediti anche <b>perché</b> il bus singolo richiede due cicli in più.',
        solution: `<pre>bus singolo:  6 × 2 ns = <b>12 ns</b>       →  10⁶ × 12 ns = 12 ms
tre bus:      4 × 2 ns = <b>8 ns</b>        →  10⁶ ×  8 ns =  8 ms</pre><p>Un terzo di tempo in meno. La ragione dei due cicli risparmiati: sul bus singolo i due operandi devono viaggiare in momenti diversi (uno viene parcheggiato nel registro temporaneo Y) e il risultato in un terzo momento, mentre con tre bus i due operandi escono insieme su bus A e B e il risultato rientra su bus C nello <b>stesso ciclo</b>.</p><p>Il prezzo è l’hardware: tre bus significa triplicare le linee e i multiplexer di accesso al banco dei registri. È il tipico compromesso costo/prestazioni che l’esame chiede di saper argomentare, non solo di calcolare.</p>`,
      },
      {
        id: 'ex-cpu-5',
        level: 'esame',
        q: 'A metà progetto il committente chiede di aggiungere dodici istruzioni complesse. L’unità di controllo era prevista <b>cablata</b>: conviene cambiare idea? Che cosa si guadagna e che cosa si perde?',
        hint: 'Chiediti dove sta scritta la sequenza dei segnali di controllo nei due casi, e che cosa significa «modificarla».',
        solution: '<p>Con l’unità <b>cablata</b> la sequenza dei segnali è una rete logica: aggiungere dodici istruzioni significa <b>ridisegnare la rete</b>, rifare la sintesi e riverificare i tempi di tutto il blocco. Con l’unità <b>microprogrammata</b> le sequenze stanno in una memoria di controllo: aggiungere istruzioni significa <b>scrivere altre microistruzioni</b>, senza toccare l’hardware.</p><p>Quindi sì, conviene passare al microprogrammato — ed è storicamente la scelta dei processori CISC, il cui repertorio ricco è fatto proprio di istruzioni complesse.</p><p>Che cosa si perde: <b>velocità</b>. Ogni passo richiede di leggere una microistruzione dalla memoria di controllo, e quella lettura si aggiunge al ciclo. Un’unità cablata può generare i segnali in modo combinatorio, senza letture intermedie. È il motivo per cui i RISC, che puntano su un ciclo brevissimo e su istruzioni semplici, tornano al controllo cablato.</p>',
      },
    ],
  };
