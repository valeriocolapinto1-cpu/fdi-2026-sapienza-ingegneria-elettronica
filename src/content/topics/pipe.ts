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
    exercises: [
      {
        id: 'ex-pipe-1',
        level: 'base',
        q: 'Disegna il diagramma a stadi di <b>quattro istruzioni indipendenti</b> in una pipeline a 5 stadi (F, D, E, M, W) e conta i cicli necessari.',
        hint: 'Ogni istruzione entra un ciclo dopo la precedente. Il conto non è 4 × 5: chiediti quando esce l’<b>ultima</b>.',
        solution: `<pre>ciclo:  1  2  3  4  5  6  7  8
I1      F  D  E  M  W
I2         F  D  E  M  W
I3            F  D  E  M  W
I4               F  D  E  M  W</pre><p>L’ultima istruzione completa al ciclo <b>8</b>. La formula generale:</p><pre>cicli = k + (n − 1) = 5 + 3 = 8</pre><p>I primi 4 cicli sono il <b>riempimento</b>: la pipeline non ha ancora prodotto nulla. Dal ciclo 5 in poi esce un risultato per ciclo. Senza pipeline le stesse quattro istruzioni avrebbero richiesto 4 × 5 = 20 cicli.</p>`,
      },
      {
        id: 'ex-pipe-2',
        level: 'base',
        q: 'Un programma esegue 1000 istruzioni su una pipeline a 5 stadi, senza stalli. Quanti cicli servono? Qual è lo <b>speedup</b> rispetto a un processore non pipeline che impiega 5 cicli per istruzione?',
        hint: 'Applica k + (n − 1) e confronta con n × k. Poi guarda a che numero tende il rapporto.',
        solution: `<pre>con pipeline:    5 + 999 = 1004 cicli
senza pipeline: 1000 × 5   = 5000 cicli

speedup = 5000 / 1004 = <b>4,98×</b></pre><p>Quasi 5, cioè quasi il numero di stadi — ma non 5. La differenza sono i 4 cicli di riempimento, che si diluiscono al crescere di n: con 10 istruzioni lo speedup sarebbe 50/14 = 3,6; con un milione, 4,99998.</p><p>Il limite teorico è k, e nella realtà non lo si raggiunge mai: qui abbiamo <b>ipotizzato zero stalli</b>, cosa che nessun programma reale garantisce, e abbiamo ignorato che gli stadi non sono perfettamente bilanciati.</p>`,
      },
      {
        id: 'ex-pipe-3',
        level: 'esame',
        q: 'Data la sequenza <code>Add R3,R1,R2</code> · <code>Sub R5,R3,R4</code> · <code>And R6,R3,R7</code>, individua le dipendenze e disegna il diagramma <b>senza</b> e <b>con</b> forwarding, contando i cicli in entrambi i casi.',
        hint: 'Cerca i registri scritti da un’istruzione e letti dalle successive. Poi chiediti in quale stadio il valore è <b>disponibile</b> e in quale <b>serve</b>.',
        solution: `<p>Dipendenze: R3 è scritto da I1 e letto sia da I2 sia da I3. Sono due dipendenze <b>RAW</b> (read after write).</p><pre>SENZA FORWARDING (R3 leggibile solo dopo lo stadio W di I1)
ciclo:  1  2  3  4  5  6  7  8  9
I1      F  D  E  M  W
I2         F  D  ·  ·  E  M  W
I3            F  ·  ·  D  E  M  W
                                → 9 cicli

CON FORWARDING (il risultato passa dall'uscita della ALU)
ciclo:  1  2  3  4  5  6  7
I1      F  D  E  M  W
I2         F  D  E  M  W
I3            F  D  E  M  W
                          → 7 cicli</pre><p>Con il forwarding il risultato di I1 viene prelevato all’uscita dello stadio E e portato direttamente all’ingresso della ALU al ciclo successivo: I2 non deve aspettare la scrittura nel banco dei registri. Due cicli risparmiati su tre istruzioni — su un programma vero, un guadagno enorme.</p>`,
      },
      {
        id: 'ex-pipe-4',
        level: 'esame',
        q: 'Perché la sequenza <code>Load R1,(R2)</code> · <code>Add R3,R1,R4</code> costa uno stallo <b>anche con il forwarding</b>? Come lo elimina il compilatore?',
        hint: 'Confronta lo stadio in cui il dato diventa disponibile con quello in cui serve. Per la Load non è lo stesso caso di un’operazione aritmetica.',
        solution: `<pre>ciclo:  1  2  3  4  5  6
Load    F  D  E  M  W
                 ↓ il dato esce dalla MEMORIA alla fine di M
Add        F  D  ·  E  M  W
                    ↑ serve all'inizio di E</pre><p>Per un’operazione aritmetica il risultato è pronto alla fine dello stadio E, cioè <b>un ciclo prima</b> di quando serve all’istruzione seguente: il forwarding arriva in tempo. Per una <code>Load</code> il dato esce dalla memoria alla fine dello stadio M, cioè <b>esattamente</b> quando servirebbe: nessun percorso di forwarding può anticiparlo, perché significherebbe mandarlo indietro nel tempo.</p><p>Resta quindi <b>uno</b> stallo, e si chiama <b>load-use hazard</b>. Il compilatore lo elimina spostando in quel buco un’istruzione indipendente:</p><pre>PRIMA                     DOPO
Load R1,(R2)              Load R1,(R2)
Add  R3,R1,R4    ←stallo  Sub  R7,R8,R9   ← istruzione indipendente
Sub  R7,R8,R9             Add  R3,R1,R4   ← ora il dato c'è</pre><p>Stesso risultato, un ciclo in meno: è il tipo di riordino che rende il compilatore parte integrante delle prestazioni.</p>`,
      },
      {
        id: 'ex-pipe-5',
        level: 'esame',
        q: 'In una pipeline a 5 stadi l’esito di un salto si conosce alla fine del <b>terzo</b> stadio. Il 20 % delle istruzioni sono salti e di questi il 60 % viene preso. Calcola il <b>CPI medio</b> supponendo che, quando il salto è preso, si perdano le istruzioni già prelevate.',
        hint: 'Conta quante istruzioni sbagliate sono entrate in pipeline prima che l’esito fosse noto: quelle vanno annullate, e ogni annullamento è un ciclo perso.',
        solution: `<p>Se l’esito si conosce alla fine dello stadio 3, nel frattempo sono entrate le istruzioni ai cicli 2 e 3: <b>due</b> istruzioni da annullare quando il salto è preso. Quando non è preso, la sequenza proseguiva già correttamente e non si perde nulla.</p><pre>penalità = 2 cicli, ma solo sui salti PRESI

CPI = 1 + (frazione di salti) × (frazione presi) × penalità
    = 1 + 0,20 × 0,60 × 2
    = 1 + 0,24 = <b>1,24</b></pre><p>Un 24 % di cicli in più rispetto all’ideale, solo per i salti. Le contromisure: <b>anticipare</b> il calcolo della condizione a uno stadio precedente (riduce la penalità), <b>predire</b> l’esito e proseguire sul ramo previsto (annulla solo quando la previsione sbaglia), o riempire i cicli con il <b>delay slot</b>, lasciando al compilatore il compito di trovare istruzioni utili da metterci.</p>`,
      },
    ],
  };
