import type { Topic } from '../types';

export const mem: Topic = {
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
  };
