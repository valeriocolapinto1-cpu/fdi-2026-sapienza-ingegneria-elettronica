import type { Topic } from '../types';

export const pipe: Topic = {
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
  };
