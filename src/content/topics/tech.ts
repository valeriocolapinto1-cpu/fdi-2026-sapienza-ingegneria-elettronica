import type { Topic } from '../types';

export const tech: Topic = {
  id: 'tech',
  title: 'Tempi, tecnologia & dispositivi programmabili',
  blurb: 'Ritardo di propagazione, cammino critico, fan-in/fan-out, CMOS, PLA e FPGA.',
  ref: 'Hamacher — Appendice A',
  trapIds: [],
    prereq: ['bool'],
    summary: [
      '<b>Ritardo di propagazione</b> t<sub>PD</sub>: tempo fra la variazione dell\'ingresso e quella dell\'uscita, misurato al 50% dell\'escursione.',
      'In cascata i ritardi <b>si sommano</b> lungo il cammino: il più lungo è il <b>cammino critico</b> e fissa la frequenza massima di clock.',
      '<b>Fan-in</b> = quanti ingressi ha una porta. <b>Fan-out</b> = quante porte può pilotare: più carico, più capacità, più ritardo.',
      'Una porta <b>CMOS</b> ha una rete di pull-up a pMOS e una di pull-down a nMOS, complementari: a riposo non c\'è percorso fra alimentazione e massa, quindi il consumo statico è quasi nullo.',
      'Logica programmabile: <b>PLA/PAL</b> (piani AND-OR), <b>CPLD</b> e <b>FPGA</b> (celle e interconnessioni riconfigurabili).',
    ],
    checks: [
      {
        q: 'Perché il cammino critico determina la frequenza di clock?',
        a: 'Perché il periodo deve bastare al segnale per attraversare il percorso combinatorio più lungo e arrivare stabile al flip-flop prima del setup. Se il clock è più veloce, il dato campionato è quello sbagliato.',
      },
      {
        q: 'Un buffer aggiunge ritardo: perché a volte si mette lo stesso?',
        a: 'Per pilotare un fan-out elevato: il buffer isola la capacità di carico e la ripartisce, riducendo il ritardo complessivo del ramo rispetto a una porta debole che carica tutto da sola.',
      },
      {
        q: 'Perché il CMOS consuma quasi solo quando commuta?',
        a: 'Perché a regime una delle due reti è aperta: non esiste un percorso continuo fra alimentazione e massa. La corrente scorre solo mentre le capacità si caricano e si scaricano, quindi il consumo dinamico cresce con la frequenza.',
      },
    ],
  body: `
    <h4>Ritardo di propagazione</h4>
    <p>Una porta logica non commuta all'istante: il segnale impiega un tempo a farsi strada nei
    transistor. Il <b>ritardo di propagazione</b> è l'intervallo fra il momento in cui l'ingresso
    attraversa il 50% dell'escursione e il momento in cui l'uscita fa altrettanto.</p>
    <pre>ingresso   ──────╲__________
                  ╲ 50%
                   │← t_p →│
uscita     ────────────╲______
                        ╲ 50%</pre>
    <p>Da non confondere con il <b>tempo di transizione</b>, che è quanto ci mette il segnale a
    passare dal 10% al 90% del suo valore: quello descrive la <i>pendenza</i> del fronte, il
    ritardo descrive lo <i>spostamento nel tempo</i>.</p>

    <h4>Porte in cascata: il cammino critico</h4>
    <p>È la domanda che esce all'esame. Quando più porte sono in cascata, <b>i ritardi si
    sommano</b>: l'uscita finale è valida solo dopo che il segnale ha attraversato tutta la
    catena. Il ritardo complessivo di una rete combinatoria è quello del suo <b>cammino
    critico</b>, cioè il percorso ingresso→uscita più lento fra tutti.</p>
    <p>Due conseguenze pratiche:</p>
    <ul>
      <li>Il <b>periodo minimo di clock</b> è dettato dal cammino critico fra due registri, più il
      tempo di setup del secondo. Non si può alzare la frequenza oltre quel limite.</li>
      <li>Minimizzare una funzione non serve solo a spendere meno porte: una SOP a due livelli
      (AND poi OR) ha un cammino corto, mentre un'espressione annidata in cinque livelli è
      corrispondentemente più lenta. È un altro motivo per cui la forma minima conta.</li>
    </ul>
    <p>Un ripple-carry a n bit è lento proprio per questo: il riporto attraversa n stadi in fila.</p>

    <h4>Fan-in e fan-out</h4>
    <ul>
      <li><b>Fan-in</b>: quanti ingressi ha una porta. Non può crescere a piacere — più ingressi
      significano transistor in serie, quindi porta più lenta. È la ragione tecnica per cui le
      porte a molti ingressi si realizzano come alberi di porte a 2 ingressi.</li>
      <li><b>Fan-out</b>: quante altre porte può pilotare un'uscita. Superato il limite la
      commutazione rallenta e i livelli logici si degradano; si rimedia inserendo dei buffer.</li>
    </ul>

    <h4>Come è fatta una porta: CMOS</h4>
    <p>La tecnologia dominante usa coppie complementari di transistor: i <b>PMOS</b> conducono
    quando l'ingresso è basso, gli <b>NMOS</b> quando è alto. In un inverter CMOS il PMOS collega
    l'uscita all'alimentazione e l'NMOS a massa: qualunque sia l'ingresso, <b>uno solo dei due
    conduce</b>.</p>
    <p>Il vantaggio è il consumo: a riposo non c'è cammino diretto fra alimentazione e massa,
    quindi la corrente scorre quasi solo <b>durante</b> le commutazioni. È il motivo per cui il
    consumo di un circuito digitale cresce con la frequenza di clock.</p>
    <p>La caratteristica di trasferimento è ripida attorno alla soglia: piccole variazioni
    d'ingresso a metà scala producono grandi variazioni d'uscita. È questa non-linearità a
    rigenerare i livelli logici e a impedire che il rumore si accumuli lungo la catena.</p>

    <h4>Dispositivi logici programmabili</h4>
    <p>Invece di fabbricare un chip su misura si può usare un dispositivo generico e configurarlo:</p>
    <ul>
      <li><b>PLA</b> (Programmable Logic Array): una matrice di AND seguita da una matrice di OR,
      entrambe programmabili. È la struttura della somma di prodotti resa hardware: ogni riga
      della matrice AND è un termine prodotto, la matrice OR li somma.</li>
      <li><b>PAL</b>: come la PLA ma con la matrice OR fissa — meno flessibile, più economica e
      veloce.</li>
      <li><b>CPLD</b>: più blocchi tipo PAL su un unico chip, uniti da una rete di interconnessione
      programmabile.</li>
      <li><b>FPGA</b>: una scacchiera di piccoli <b>blocchi logici</b> (tipicamente tabelle di
      verità memorizzate, dette look-up table, più un flip-flop) immersi in una rete di
      collegamenti programmabili, con blocchi di I/O sul bordo. Permette di realizzare reti
      complesse, sequenziali comprese, e di riconfigurarle.</li>
    </ul>
    <p>Il compromesso di fondo è sempre lo stesso: un circuito dedicato è più veloce e più
    efficiente, uno programmabile è disponibile subito e si corregge senza rifare il chip.</p>
    <h4>Esempio svolto</h4>
    <p><b>Qual è la frequenza massima di questo stadio?</b> Fra due registri c'è una rete combinatoria il cui cammino più lungo attraversa quattro porte da 2 ns ciascuna; il flip-flop ha tempo di propagazione 1 ns e tempo di setup 1 ns.</p>
    <pre>periodo minimo = t_propagazione + t_cammino_critico + t_setup
               = 1 ns + (4 × 2 ns) + 1 ns
               = 10 ns

f_max = 1 / 10 ns = <b>100 MHz</b></pre>
    <p>Ora si spezza la rete in due stadi da due porte, mettendo in mezzo un registro:</p>
    <pre>periodo = 1 + (2 × 2) + 1 = 6 ns   →   f_max ≈ 167 MHz</pre>
    <p>La frequenza sale del 67 %, non del 100 %: i tempi del flip-flop restano e ora si pagano due volte. È il limite che spiega perché non conviene spingere una pipeline oltre un certo numero di stadi.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Sommare i ritardi di rami <b>paralleli</b>: il ritardo della rete è quello del cammino più lungo, non la somma di tutti.</li>
      <li>Confondere il ritardo di propagazione (fra i 50 % di ingresso e uscita) con il tempo di <b>transizione</b> (dal 10 % al 90 % dell'uscita).</li>
      <li>Dimenticare setup e propagazione del flip-flop nel calcolo del periodo: il combinatorio non è tutto il tempo disponibile.</li>
    </ul>`,
};
