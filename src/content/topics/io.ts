import type { Topic } from '../types';

export const io: Topic = {
  id: 'io',
  title: 'Input/Output, DMA & bus',
  blurb: 'I/O programmato, memory-mapped, handshake, DMA, bus e standard seriali.',
  ref: 'Hamacher cap. 3–4',
  trapIds: [],
  body: `
    <h4>Il problema dell'I/O</h4>
    <p>Processore e memoria lavorano in nanosecondi, una tastiera in decimi di secondo, un disco
    in millisecondi. Tutta l'organizzazione dell'I/O nasce da questo <b>divario di velocità</b>:
    il problema non è scambiare i dati, è farlo senza che la macchina resti ferma ad aspettare.</p>

    <h4>L'interfaccia di un dispositivo</h4>
    <p>Il processore non parla con la periferica ma con la sua <b>interfaccia</b>, che espone
    tipicamente tre registri:</p>
    <ul>
      <li><b>DATA</b> — il dato in transito;</li>
      <li><b>STATUS</b> — i bit di stato: dato pronto, dispositivo occupato, errore;</li>
      <li><b>CONTROL</b> — i comandi e le abilitazioni, per esempio «genera interruzione quando
      sei pronto».</li>
    </ul>

    <h4>Dove vivono quei registri: memory-mapped o isolato</h4>
    <ul>
      <li><b>Memory-mapped I/O</b>: i registri dell'interfaccia occupano indirizzi dello stesso
      spazio della memoria. Non servono istruzioni speciali — si leggono e scrivono con
      <code>Load</code> e <code>Store</code>. In cambio si consuma spazio di indirizzamento.</li>
      <li><b>I/O isolato</b>: spazio di indirizzi separato e istruzioni dedicate (<code>IN</code>,
      <code>OUT</code>), con una linea di controllo che distingue i due spazi.</li>
    </ul>
    <p>I RISC adottano quasi sempre il memory-mapped, coerentemente con il modello load/store.</p>

    <h4>Tre modi di trasferire</h4>
    <ol>
      <li><b>I/O programmato (polling)</b>: il processore interroga ciclicamente il bit di stato
      finché il dispositivo non è pronto, poi trasferisce la parola. Semplicissimo, ma il
      processore <b>brucia</b> tutto il tempo dell'attesa in un ciclo vuoto.</li>
      <li><b>Guidato da interruzioni</b>: il processore fa altro; è il dispositivo a chiamare
      quando è pronto. Si paga il costo del cambio di contesto, ma non si spreca attesa.</li>
      <li><b>DMA</b>: per blocchi grandi anche un'interruzione per parola sarebbe troppo. Un
      controllore dedicato trasferisce <b>l'intero blocco</b> fra periferica e memoria da solo, e
      manda <b>una sola</b> interruzione alla fine.</li>
    </ol>

    <h4>DMA in dettaglio</h4>
    <p>Il processore programma il controllore scrivendone i registri — indirizzo di partenza in
    memoria, numero di parole, direzione — e poi lo lascia lavorare. Il controllore diventa a sua
    volta <b>padrone del bus</b> per il tempo necessario: quando ne ha bisogno lo richiede, e il
    processore glielo cede. Sottraendo cicli di bus alla CPU si parla di <i>cycle stealing</i>;
    trasferendo un blocco intero in un colpo solo, di modalità <i>burst</i>.</p>
    <p>Effetto collaterale importante: se il DMA scrive in memoria, la copia che la <b>cache</b>
    tiene di quei dati diventa obsoleta. È il problema della coerenza, che va gestito
    invalidando le linee interessate.</p>

    <h4>Handshake</h4>
    <p>Due dispositivi a velocità diverse si sincronizzano con uno scambio di segnali: chi manda
    alza «dato valido», chi riceve risponde «preso», e solo allora il primo abbassa. Il
    trasferimento procede al passo del <b>più lento</b> dei due, senza bisogno di un clock comune:
    è la differenza fra bus <b>asincrono</b> (a handshake) e <b>sincrono</b> (tutto scandito da un
    clock, più veloce ma vincolato dai tempi del dispositivo peggiore).</p>

    <h4>Il bus</h4>
    <p>Un bus trasporta <b>dati, indirizzi e segnali di controllo</b>. Poiché più dispositivi lo
    condividono, serve l'<b>arbitraggio</b>: un meccanismo che stabilisca chi ha diritto di
    parlare quando due lo chiedono insieme. Le uscite dei dispositivi sono <b>tri-state</b>,
    così chi non parla si scollega elettricamente.</p>
    <p>Un <b>buffer</b> interposto compensa la differenza di ritmo fra due dispositivi,
    accumulando i dati in attesa che il più lento li consumi.</p>

    <h4>Seriale contro parallelo</h4>
    <p>Il parallelo manda più bit insieme su fili distinti: veloce sulle distanze brevi, ma i fili
    costano e i segnali arrivano leggermente sfasati (<i>skew</i>), il che ne limita la lunghezza e
    la frequenza. Il seriale manda un bit per volta: meno fili, meno interferenze, frequenze molto
    più alte. Per questo gli standard moderni sono seriali — <b>USB</b>, <b>PCI Express</b> —
    mentre il parallelo è rimasto dentro il chip.</p>

    <h4>Nei sistemi embedded</h4>
    <p>Gli stessi meccanismi con periferiche minuscole: un <b>timer</b> con i suoi registri di
    conteggio e di stato, che genera un'interruzione periodica ed è la base della multiprogrammazione;
    un <b>display a sette segmenti</b>, dove una rete combinatoria traduce la cifra binaria
    nell'accensione dei segmenti — un classico esercizio di sintesi con tabella di verità.</p>`,
};
