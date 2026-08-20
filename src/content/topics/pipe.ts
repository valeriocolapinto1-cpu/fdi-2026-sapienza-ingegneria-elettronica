import type { Topic } from '../types';

export const pipe: Topic = {
    id: 'pipe',
    title: 'Pipeline & prestazioni',
    blurb: 'Stadi, hazard sui dati e sul controllo, forwarding, equazione delle prestazioni.',
    ref: 'Hamacher cap. 6',
    trapIds: [],
    prereq: ['cpu', 'isa'],
    diagramIds: ['pipeline-5-stadi'],
    summary: [
      'Equazione delle prestazioni: <b>T = (N × S) / R</b> — istruzioni × cicli per istruzione, diviso la frequenza. Si migliora agendo su uno dei tre fattori, e spesso migliorarne uno peggiora un altro.',
      'Pipeline a k stadi: n istruzioni escono in <b>k + (n − 1)</b> cicli. Il guadagno tende a k ma non lo raggiunge mai.',
      'Tre famiglie di <b>hazard</b>: strutturali (risorsa contesa), sui dati (leggo un valore non ancora scritto), di controllo (salti).',
      '<b>Forwarding</b>: il risultato viene passato direttamente allo stadio che lo aspetta, senza attendere la scrittura nel registro. Non elimina lo stallo dopo una load.',
      'I salti costano cicli: si rimedia con predizione, delay slot e calcolo anticipato della condizione.',
      'Oltre un\'istruzione per ciclo: <b>superscalare</b> (più unità, decisione a run time) o <b>VLIW</b> (è il compilatore a impacchettare).',
    ],
    checks: [
      {
        q: 'Quanti cicli servono a 100 istruzioni in una pipeline ideale a 5 stadi?',
        a: '5 + 99 = <b>104</b>. Il primo risultato esce dopo 5 cicli (riempimento), poi ne esce uno per ciclo. Senza pipeline sarebbero 500.',
      },
      {
        q: 'Il forwarding elimina tutti gli stalli sui dati?',
        a: 'No. Dopo una <code>Load</code> il dato è disponibile solo alla fine dello stadio di memoria: se l\'istruzione successiva lo usa subito, resta uno stallo di un ciclo (<b>load-use hazard</b>). Il compilatore lo nasconde riordinando le istruzioni.',
      },
      {
        q: 'Perché una pipeline a 5 stadi non rende il processore 5 volte più veloce?',
        a: 'Per tre motivi: il riempimento e lo svuotamento, gli stalli dovuti agli hazard, e lo sbilanciamento degli stadi — il periodo è quello dello stadio <b>più lento</b>, più il ritardo dei registri di stadio.',
      },
    ],
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
    <p>Un processore <b>superscalare</b> replica le unità funzionali e avvia più istruzioni per ciclo, portando il CPI sotto 1. Richiede però di individuare a runtime le istruzioni indipendenti, quindi hardware di controllo notevolmente più complesso.</p>
    <h4>Esempio svolto</h4>
    <p><b>Quattro istruzioni con una dipendenza:</b> la seconda usa il risultato della prima.</p>
    <pre>I1: Add  R3, R1, R2
I2: Sub  R5, R3, R4      ← ha bisogno di R3

ciclo      1  2  3  4  5  6  7
I1         F  D  E  M  W
I2 (senza     F  D  ·  ·  E  M  W     tre cicli di stallo:
   forward)                            R3 è scritto solo in W
I2 (con       F  D  E  M  W            forwarding da E di I1 a E di I2
   forward)</pre>
    <p>Il forwarding porta il risultato dall'uscita della ALU direttamente al suo ingresso al ciclo dopo, senza aspettare la scrittura nel registro: lo stallo sparisce del tutto.</p>
    <p><b>Ma se I1 fosse una <code>Load</code></b>, il dato sarebbe pronto solo alla fine dello stadio M, cioè un ciclo più tardi: resterebbe <b>uno</b> stallo, che nessun forwarding può eliminare. Il compilatore lo nasconde spostando in quel buco un'istruzione indipendente.</p>
    <p><b>Conto dei cicli</b>: 4 istruzioni in una pipeline a 5 stadi senza stalli richiedono 5 + 3 = <b>8</b> cicli; con un solo stallo, 9.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Calcolare i cicli come k × n: la pipeline serve proprio a non pagare k cicli per istruzione. Sono <b>k + (n − 1)</b>.</li>
      <li>Credere che il forwarding risolva anche il load-use hazard: lì un ciclo si perde comunque.</li>
      <li>Dimenticare i salti: fino a quando la condizione non è nota le istruzioni prelevate potrebbero essere quelle sbagliate e vanno annullate.</li>
    </ul>`,
  };
