import type { Topic } from '../types';

export const tech: Topic = {
  id: 'tech',
  title: 'Tempi, tecnologia & dispositivi programmabili',
  blurb: 'Ritardo di propagazione, cammino critico, fan-in/fan-out, CMOS, PLA e FPGA.',
  ref: 'Hamacher — Appendice A',
  trapIds: [],
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
    efficiente, uno programmabile è disponibile subito e si corregge senza rifare il chip.</p>`,
};
