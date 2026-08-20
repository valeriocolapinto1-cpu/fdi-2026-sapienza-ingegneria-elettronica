import type { Topic } from '../types';

export const vm: Topic = {
    id: 'vm',
    title: 'Memoria virtuale & TLB',
    blurb: 'Spazio logico e fisico, paginazione, page fault, traduzione degli indirizzi.',
    ref: 'Hamacher cap. 8',
    trapIds: ['trap-ram'],
    prereq: ['mem'],
    diagramIds: ['memoria-virtuale-tlb'],
    summary: [
      'La memoria virtuale separa gli indirizzi che il programma usa da quelli fisici: ogni processo vede il proprio spazio, e i processi sono isolati fra loro.',
      '<b>Paginazione</b>: pagine (virtuali) e frame (fisici) della <b>stessa</b> dimensione. Nella traduzione l\'<b>offset non cambia</b>.',
      'La <b>tabella delle pagine</b> mappa numero di pagina → numero di frame, con i bit di validità, protezione, modificato e uso.',
      '<b>Page fault</b>: la pagina non è in memoria. È un\'eccezione gestita dal sistema operativo, che carica la pagina da disco — non è un errore del programma.',
      'Il <b>TLB</b> è una cache delle traduzioni: senza, ogni accesso in memoria ne costerebbe due (prima la tabella, poi il dato).',
    ],
    checks: [
      {
        q: 'Pagine da 4 KiB e indirizzo virtuale a 32 bit: quanti bit di offset, e quante pagine?',
        a: 'Offset <b>12 bit</b>, perché 4096 = 2¹². Restano 20 bit per il numero di pagina, quindi <b>2²⁰ = 1 048 576</b> pagine.',
      },
      {
        q: 'Perché nella traduzione l\'offset resta identico?',
        a: 'Perché pagina e frame hanno la stessa dimensione: la traduzione cambia <b>quale blocco</b> si sta guardando, non la posizione dentro il blocco. Si traduce solo la parte alta dell\'indirizzo.',
      },
      {
        q: 'TLB miss e page fault sono la stessa cosa?',
        a: 'No. Il <b>TLB miss</b> dice solo che la traduzione non era nella cache delle traduzioni: la pagina può benissimo essere in memoria, e si va a leggere la tabella. Il <b>page fault</b> dice che la pagina non è in memoria fisica e va caricata da disco: costa milioni di volte di più.',
      },
    ],
    body: `
    <h4>Il problema</h4>
    <p>I programmi possono essere più grandi della memoria fisica, e più programmi devono coesistere senza pestarsi i piedi. La <b>memoria virtuale</b> risolve entrambe le cose: ogni processo lavora su uno spazio di indirizzi <b>logico</b> tutto suo, che il sistema mappa sulla memoria <b>fisica</b> disponibile, appoggiandosi al disco per ciò che non ci sta.</p>

    <h4>Paginazione</h4>
    <p>Lo spazio logico è diviso in <b>pagine</b> di dimensione fissa, la memoria fisica in <b>frame</b> della stessa dimensione. Una pagina qualsiasi può stare in un frame qualsiasi: non serve contiguità, quindi non c'è frammentazione esterna.</p>
    <p>L'indirizzo virtuale si spezza in due campi:</p>
    <pre>| numero di pagina | offset nella pagina |
        ↓ tradotto           ↓ invariato
| numero di frame  | offset nella pagina |</pre>
    <p>L'offset non viene toccato: pagina e frame hanno la stessa dimensione, quindi cambia solo la parte alta dell'indirizzo.</p>

    <h4>La tabella delle pagine</h4>
    <p>Contiene, per ogni pagina, il frame che la ospita più alcuni bit di controllo: <b>valid</b> (la pagina è in memoria?), <b>dirty</b> (è stata modificata?), <b>bit di protezione</b> (lettura/scrittura/esecuzione), bit di riferimento per le politiche di sostituzione. Ogni processo ha la propria tabella: è così che si ottiene l'<b>isolamento</b> fra processi, e condividendo deliberatamente alcune voci si ottiene la <b>condivisione</b> di codice o dati.</p>

    <h4>Page fault</h4>
    <p>Se il bit valid è 0 la pagina non è in memoria: si solleva un'<b>eccezione</b> di page fault. Il sistema operativo sceglie una vittima (tipicamente con criteri LRU), la riscrive su disco <b>solo se</b> è dirty, carica la pagina richiesta e fa <b>rieseguire</b> l'istruzione interrotta. Il costo è quello di un accesso a disco: milioni di cicli, ordini di grandezza più di un cache miss. Per questo la sostituzione si può permettere algoritmi sofisticati in software.</p>

    <h4>Il TLB</h4>
    <p>La tabella delle pagine sta in memoria: tradurre un indirizzo richiederebbe un accesso in più <b>per ogni</b> accesso: si raddoppierebbe il costo di tutto. Il <b>TLB</b> (Translation Lookaside Buffer) è una piccola cache completamente o set-associativa delle traduzioni usate di recente.</p>
    <ol>
      <li>Il processore emette un indirizzo virtuale.</li>
      <li>Si cerca il numero di pagina nel TLB. <b>TLB hit</b> → il frame è immediato.</li>
      <li><b>TLB miss</b> → si legge la tabella delle pagine in memoria e si aggiorna il TLB.</li>
      <li>Se anche la tabella dice «non valida» → page fault.</li>
    </ol>
    <p>Funziona per la stessa ragione della cache: la <b>località</b>. Un programma insiste su poche pagine per volta, quindi anche un TLB di poche decine di voci raggiunge percentuali di successo altissime.</p>

    <h4>Rapporto con la cache</h4>
    <p>Sono due meccanismi distinti che si sommano: il TLB accelera la <b>traduzione</b> degli indirizzi, la cache accelera l'<b>accesso ai dati</b>. Un accesso può quindi fare TLB hit e cache miss, o viceversa. Da tenere separati anche a parole: la cache sta fra CPU e memoria principale, la memoria virtuale fra memoria principale e disco.</p>
    <h4>Esempio svolto</h4>
    <p><b>Traduci l'indirizzo virtuale <code>0x00403ABC</code>,</b> con pagine da 4 KiB, e sapendo che la pagina cercata sta nel frame <code>0x25</code>.</p>
    <pre>pagine da 4 KiB = 2¹² byte      →  offset = 12 bit = 3 cifre esadecimali

0x00403ABC  =  0x00403 | ABC
               ↑ pagina  ↑ offset

pagina 0x00403  →  tabella delle pagine  →  frame 0x25

indirizzo fisico = frame · 4096 + offset
                 = 0x25 &lt;&lt; 12  |  0xABC
                 = <b>0x00025ABC</b></pre>
    <p>Le ultime tre cifre esadecimali <b>non cambiano</b>: sono l'offset, e la traduzione tocca solo la parte alta. È il controllo immediato per capire se l'esercizio è stato svolto bene.</p>
    <p><b>Quanti accessi in memoria costa?</b> Senza TLB: uno per leggere la tabella delle pagine, uno per il dato — il doppio del necessario. Con un TLB che va a segno nel 99 % dei casi, il costo medio torna praticamente a un accesso solo.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Tradurre <b>anche</b> l'offset: pagina e frame hanno la stessa dimensione, quindi la posizione interna resta identica.</li>
      <li>Confondere TLB miss e page fault: il primo costa un accesso in più, il secondo un accesso al <b>disco</b>, cioè milioni di volte tanto.</li>
      <li>Dimenticare che la tabella delle pagine sta in memoria: è la ragione per cui il TLB esiste.</li>
    </ul>`,
  };
