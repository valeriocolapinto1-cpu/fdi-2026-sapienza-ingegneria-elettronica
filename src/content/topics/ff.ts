import type { Topic } from '../types';

export const ff: Topic = {
    id: 'ff',
    title: 'Circuiti sequenziali & flip-flop',
    blurb: 'Latch, flip-flop D/JK/T, master-slave, registri e contatori.',
    ref: 'Hamacher — Appendice A',
    trapIds: [],
    body: `
    <h4>Combinatorio vs sequenziale</h4>
    <p>In una rete <b>combinatoria</b> l'uscita dipende solo dagli ingressi attuali. In una rete <b>sequenziale</b> dipende anche dallo <b>stato</b>, cioè dalla storia passata: serve un elemento di memoria, ottenuto con la <b>retroazione</b> (l'uscita rientra come ingresso).</p>

    <h4>Il latch SR</h4>
    <p>Due porte NOR retroazionate incrociate. Con <code>S=1, R=0</code> l'uscita va a 1 (set); con <code>S=0, R=1</code> va a 0 (reset); con <code>S=R=0</code> <b>mantiene</b> lo stato precedente — è la memoria. La combinazione <code>S=R=1</code> è <b>proibita</b>: forza entrambe le uscite allo stesso valore e, al rilascio, lo stato finale è imprevedibile (dipende da quale porta commuta prima).</p>

    <h4>Il latch D e il problema della trasparenza</h4>
    <p>Il latch D elimina lo stato proibito generando <code>R</code> come negazione di <code>S</code>: c'è un solo ingresso dato. Con un segnale di abilitazione (<b>gated latch</b>) il dato passa solo quando il clock è alto — ma finché resta alto il latch è <b>trasparente</b>: ogni variazione dell'ingresso attraversa il dispositivo. In una rete retroazionata questo provoca corse e stati instabili.</p>

    <h4>Flip-flop: il fronte, non il livello</h4>
    <p>Un <b>flip-flop</b> è un elemento bistabile che memorizza <b>1 bit</b> e commuta solo sul <b>fronte</b> del clock (edge-triggered), non sul livello. L'istante di campionamento è quindi puntuale e prevedibile.</p>
    <ul>
      <li><b>Sincroni</b>: cambiano stato solo al fronte di clock.</li>
      <li><b>Asincroni</b>: reagiscono immediatamente agli ingressi, senza clock. Tipici gli ingressi di preset/clear, che agiscono comunque.</li>
    </ul>

    <h4>Master-slave</h4>
    <p>Due latch D in serie con clock opposti: il <b>master</b> campiona l'ingresso mentre il clock è alto, lo <b>slave</b> ne trasferisce il valore in uscita quando il clock commuta. Poiché i due stadi <b>non sono mai trasparenti contemporaneamente</b>, l'ingresso non può attraversare il dispositivo nello stesso ciclo: si evitano le corse e l'uscita cambia in un solo istante ben definito.</p>

    <h4>I tipi che escono all'esame</h4>
    <ul>
      <li><b>D</b>: <code>Q⁺ = D</code>. È il registro elementare.</li>
      <li><b>JK</b>: <code>J=K=0</code> mantiene, <code>J=1,K=0</code> set, <code>J=0,K=1</code> reset, <code>J=K=1</code> <b>commuta</b> (toggle). Non ha combinazioni proibite.</li>
      <li><b>T</b>: <code>T=0</code> mantiene, <code>T=1</code> commuta. È un JK con gli ingressi uniti; è il mattone dei contatori.</li>
    </ul>

    <h4>Registri e contatori</h4>
    <p>N flip-flop D in parallelo sullo stesso clock formano un <b>registro</b> a N bit. Collegandoli in cascata, con l'uscita di uno nell'ingresso del successivo, si ottiene un <b>registro a scorrimento</b> (shift register), usato per moltiplicare/dividere per 2 e per la conversione serie-parallelo.</p>
    <p>Un <b>contatore</b> si costruisce con flip-flop T. Nella versione <b>asincrona</b> (ripple) il clock di ogni stadio è l'uscita del precedente: semplice, ma i ritardi si accumulano e le uscite non cambiano tutte insieme. Nella versione <b>sincrona</b> tutti condividono lo stesso clock e la logica combinatoria decide chi commuta: più veloce e senza stati spuri.</p>

    <h4>Varianti che escono all'esame</h4>
    <ul>
      <li><b>Latch SR con NAND</b>: stessa struttura del NOR ma con la logica invertita — gli
      ingressi sono attivi <b>bassi</b> e la combinazione proibita è <code>S=R=0</code>.</li>
      <li><b>Registro a scorrimento ad accesso parallelo</b>: oltre a scorrere, può essere
      caricato in un colpo solo su tutti i bit. Un multiplexer davanti a ogni flip-flop sceglie
      fra «prendi dal vicino» (scorrimento) e «prendi dall'ingresso parallelo» (caricamento).
      È il ponte fra formato seriale e parallelo.</li>
      <li><b>Contatore su/giù</b>: la logica combinatoria fra gli stadi viene commutata da una
      linea di direzione, così lo stesso circuito conta in avanti o all'indietro.</li>
    </ul>

    <h4>Tempi</h4>
    <p>Il dato deve essere stabile un po' <b>prima</b> del fronte (<i>setup time</i>) e restare stabile un po' <b>dopo</b> (<i>hold time</i>). Il periodo minimo di clock è vincolato dal ritardo di propagazione più lungo fra due registri, più il setup.</p>`,
  };
