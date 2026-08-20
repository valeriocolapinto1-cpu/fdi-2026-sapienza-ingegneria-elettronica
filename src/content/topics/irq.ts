import type { Topic } from '../types';

export const irq: Topic = {
    id: 'irq',
    title: 'Interruzioni, eccezioni & I/O',
    blurb: 'ISR, priorità e annidamento, vettorializzazione, polling vs interrupt, DMA.',
    ref: 'Hamacher cap. 4',
    trapIds: [],
    prereq: ['isa'],
    summary: [
      '<b>Interruzione</b> = evento esterno, asincrono, non legato all\'istruzione in corso. <b>Eccezione</b> = evento generato dall\'istruzione stessa (overflow, istruzione illegale, page fault).',
      'Sequenza: si finisce l\'istruzione corrente → si salvano PC e stato → si mascherano le interruzioni → si salta alla <b>ISR</b> → si ritorna con un\'istruzione dedicata che ripristina tutto.',
      '<b>Priorità</b> e <b>mascheramento</b> decidono chi può interrompere chi: l\'annidamento è ammesso solo verso priorità più alte.',
      'Individuare la sorgente: <b>polling</b> dei registri di stato (tempo proporzionale al numero di dispositivi) o interruzioni <b>vettorizzate</b> (il dispositivo fornisce l\'indirizzo della routine).',
      'La ISR deve salvare e ripristinare i registri che usa: il programma interrotto non deve accorgersi di nulla.',
    ],
    checks: [
      {
        q: 'Qual è la differenza sostanziale fra interruzione ed eccezione?',
        a: 'L\'interruzione è <b>asincrona</b> e viene da fuori: capita fra un\'istruzione e l\'altra, indipendentemente da cosa si stia eseguendo. L\'eccezione è <b>sincrona</b>: la provoca l\'istruzione in corso, e rieseguendo lo stesso programma si ripresenta nello stesso punto.',
      },
      {
        q: 'Perché all\'ingresso della routine di servizio le interruzioni vengono in genere disabilitate?',
        a: 'Per proteggere il salvataggio dello stato: una seconda richiesta di pari priorità, accolta prima che PC e registri siano al sicuro, li sovrascriverebbe e il ritorno non sarebbe più possibile.',
      },
      {
        q: 'Vettorizzate o polling: qual è il vantaggio delle prime?',
        a: 'Il dispositivo fornisce da sé l\'indirizzo della propria routine, quindi il tempo di individuazione è <b>costante</b> e non dipende da quanti dispositivi ci sono. Col polling si interrogano in sequenza e il tempo cresce con il numero.',
      },
    ],
    body: `
    <h4>Interruzioni</h4>
    <p>Segnali <b>hardware asincroni</b> che viaggiano sulle <b>linee di controllo</b> del bus, generati da dispositivi esterni. Sono asincroni nel senso che arrivano in un istante scorrelato dal programma in esecuzione.</p>

    <h4>Che cosa succede, nell'ordine</h4>
    <ol>
      <li>Il dispositivo alza la linea di richiesta.</li>
      <li>Il processore termina l'istruzione <b>in corso</b> — non la interrompe a metà.</li>
      <li>Salva lo <b>stato</b>: PC e registro di stato, più i registri che la routine userà.</li>
      <li>Disabilita (o abbassa) le interruzioni allo stesso livello, per non essere interrotto subito.</li>
      <li>Carica nel PC l'indirizzo della <b>ISR</b> (Interrupt Service Routine) ed esegue.</li>
      <li>Invia il riscontro al dispositivo, ripristina lo stato e riprende dall'istruzione successiva.</li>
    </ol>

    <h4>Priorità e annidamento</h4>
    <p>Con più dispositivi serve un ordine. A ogni sorgente si assegna un <b>livello di priorità</b>: una richiesta più urgente può interrompere una ISR in corso (<b>annidamento</b>), una meno urgente aspetta. Il processore mantiene un livello corrente e accetta solo le richieste superiori. Le interruzioni possono anche essere <b>mascherate</b> singolarmente.</p>

    <h4>Come si individua chi ha chiamato</h4>
    <ul>
      <li><b>Polling</b>: il processore interroga i dispositivi in sequenza finché trova quello che ha alzato la richiesta. Semplice, ma il tempo cresce con il numero di dispositivi.</li>
      <li><b>Vettorializzazione</b>: il dispositivo mette sul bus un identificatore, con cui il processore indicizza una <b>tabella dei vettori</b> e salta direttamente alla ISR giusta. Più veloce e indipendente dal numero di dispositivi.</li>
    </ul>

    <h4>Eccezioni</h4>
    <p>Eventi <b>sincroni</b>, generati dal processore durante l'esecuzione: divisione per zero, overflow, codice operativo illegale, violazione di protezione, chiamate di sistema. Sincroni perché riproducibili — rieseguendo lo stesso programma sugli stessi dati si ripresentano nello stesso punto.</p>
    <p>Un'eccezione è sollevata, per esempio, se un processo tenta di accedere alla memoria di altri utenti, di modificare la modalità del sistema o la priorità di altri processi.</p>

    <h4>Interruzioni vs eccezioni, in breve</h4>
    <pre>                interruzione        eccezione
origine         dispositivo esterno processore
sincronia       asincrona           sincrona
riproducibile   no                  sì
tipico uso      I/O, timer          errori, system call</pre>

    <h4>Il debugger</h4>
    <ul>
      <li><b>Trace mode</b>: un'eccezione dopo <b>ogni</b> istruzione → esecuzione passo-passo, si ispeziona lo stato a ogni passo.</li>
      <li><b>Breakpoint</b>: l'eccezione scatta solo in punti scelti → il programma corre a piena velocità fino al successivo.</li>
    </ul>

    <h4>I/O programmato e DMA</h4>
    <p>Nell'I/O <b>programmato</b> il processore trasferisce ogni parola personalmente: semplice ma spreca tempo di CPU. Con il <b>DMA</b> (Direct Memory Access) un controllore dedicato sposta interi blocchi fra periferica e memoria <b>senza</b> il processore, che riceve una sola interruzione a trasferimento concluso. È il meccanismo con cui si legge da disco senza paralizzare la macchina.</p>

    <h4>Bus e buffer</h4>
    <p>Un bus trasporta <b>dati, indirizzi e segnali di controllo</b>. Quando due dispositivi lavorano a velocità diverse si interpone un <b>buffer</b>, che compensa lo scarto accumulando i dati. La trasmissione può essere <b>parallela</b> (più bit insieme, corta distanza) o <b>seriale</b> (un bit per volta, come USB: meno fili, meno interferenze, distanze maggiori).</p>
    <p>Le interruzioni sono essenziali nei sistemi <b>real-time</b>, dove un evento deve essere servito entro un tempo massimo, e nei sistemi <b>multitasking</b>, dove il timer che scandisce i cambi di contesto è esso stesso una sorgente di interruzione.</p>
    <h4>Esempio svolto</h4>
    <p><b>Due dispositivi chiamano, con priorità diverse.</b> Il programma principale è in esecuzione; il disco (priorità 2) chiede attenzione, e mentre la sua routine è in corso arriva il timer (priorità 5, più alta):</p>
    <pre>t₀  programma principale in esecuzione
t₁  richiesta disco (p2)   → finisce l'istruzione in corso,
                             salva PC e stato, maschera ≤ 2, salta a ISR_disco
t₂  ISR_disco in esecuzione
t₃  richiesta timer (p5)   → 5 &gt; 2, quindi è accolta:
                             salva PC e stato dell'ISR_disco, salta a ISR_timer
t₄  ISR_timer finisce      → ripristina e torna dentro ISR_disco
t₅  ISR_disco finisce      → ripristina e torna al programma principale</pre>
    <p>Due punti da notare. L'interruzione è servita <b>fra</b> due istruzioni, mai a metà: il processore completa quella in corso. E l'annidamento è ammesso solo verso l'alto: se al tempo t₃ avesse chiamato un altro dispositivo di priorità 2, sarebbe rimasto in attesa perché la maschera lo esclude.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Dire che l'interruzione «blocca l'istruzione a metà»: viene servita al confine fra due istruzioni, ed è ciò che rende possibile riprendere esattamente da dove si era.</li>
      <li>Dimenticare che l'ISR deve <b>salvare i registri che usa</b>: il programma interrotto non deve accorgersi di nulla.</li>
      <li>Confondere la priorità con l'ordine di arrivo: chi ha priorità maggiore passa avanti anche se ha chiesto dopo.</li>
    </ul>`,
  };
