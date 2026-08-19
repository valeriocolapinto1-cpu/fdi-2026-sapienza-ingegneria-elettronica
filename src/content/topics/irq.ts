import type { Topic } from '../types';

export const irq: Topic = {
    id: 'irq',
    title: 'Interruzioni, eccezioni & I/O',
    blurb: 'ISR, priorità e annidamento, vettorializzazione, polling vs interrupt, DMA.',
    ref: 'Hamacher cap. 4',
    trapIds: [],
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
    <p>Le interruzioni sono essenziali nei sistemi <b>real-time</b>, dove un evento deve essere servito entro un tempo massimo, e nei sistemi <b>multitasking</b>, dove il timer che scandisce i cambi di contesto è esso stesso una sorgente di interruzione.</p>`,
  };
