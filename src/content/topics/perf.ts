import type { Topic } from '../types';

export const perf: Topic = {
  id: 'perf',
  title: 'Prestazioni & parallelismo',
  blurb: 'Equazione del tempo di CPU, legge di Amdahl, multicore e coerenza.',
  ref: 'Hamacher cap. 1 e 12',
  trapIds: ['trap-ram'],
  prereq: ['pipe', 'mem'],
  summary: [
    'L’equazione da sapere a memoria: <b>T = (N × S) / R</b> — istruzioni eseguite × cicli per istruzione, diviso la frequenza di clock.',
    'I tre fattori <b>non sono indipendenti</b>: ridurre N con istruzioni più complesse (CISC) di solito alza S; alzare R accorcia il periodo e obbliga a pipeline più profonde.',
    'La <b>frequenza di clock non misura le prestazioni</b>: due processori a pari frequenza possono differire di un fattore due a causa di S.',
    'Legge di <b>Amdahl</b>: se una frazione <i>f</i> del tempo è migliorata di un fattore <i>k</i>, il guadagno globale è <b>1 / ((1 − f) + f/k)</b>. La parte non migliorata mette un tetto invalicabile.',
    'Si confrontano macchine con i <b>benchmark</b> (SPEC) e la <b>media geometrica</b>, non con i MIPS: i MIPS dipendono dal repertorio e dal programma.',
    'Il parallelismo ha tre livelli: fra <b>istruzioni</b> (pipeline, superscalare), fra <b>dati</b> (SIMD), fra <b>processi</b> (multicore) — e i core condividono la memoria, da cui il problema della <b>coerenza delle cache</b>.',
  ],
  body: `
    <h4>Che cosa vuol dire «veloce»</h4>
    <p>Il tempo di esecuzione di un programma è il solo indicatore che conti davvero, e si scompone in tre fattori:</p>
    <pre>T = (N × S) / R

N = numero di istruzioni eseguite      (repertorio, compilatore)
S = cicli di clock per istruzione      (organizzazione: pipeline, cache)
R = frequenza di clock                 (tecnologia)</pre>
    <p>Ogni miglioramento agisce su uno dei tre. Il punto è che <b>non sono indipendenti</b>: un repertorio che riduce N con istruzioni più complesse tende ad aumentare S; alzare R accorcia il periodo e costringe a spezzare il lavoro in più stadi, il che aumenta gli stalli. Per questo la sola frequenza non dice nulla: due processori a 3 GHz possono differire del doppio.</p>

    <h4>Un esempio numerico</h4>
    <p>Un programma esegue 10⁹ istruzioni su una macchina a 2 GHz con S = 1,5:</p>
    <pre>T = (10⁹ × 1,5) / (2 × 10⁹) = 0,75 s</pre>
    <p>Se una cache migliore porta S a 1,2, il tempo scende a 0,6 s: il <b>20 %</b> in meno. Se invece si alza il clock a 2,5 GHz lasciando S = 1,5 si arriva a 0,6 s lo stesso — ma la seconda strada costa in consumo e dissipazione, e la prima no. È il tipo di confronto che l'esame chiede di saper impostare.</p>

    <h4>La legge di Amdahl</h4>
    <p>Se si migliora di un fattore <i>k</i> una parte che occupa la frazione <i>f</i> del tempo totale, il guadagno complessivo è</p>
    <pre>speedup = 1 / ( (1 − f) + f/k )</pre>
    <p>Il termine <code>(1 − f)</code> non si tocca: è il <b>tetto</b>. Se il 40 % del tempo se ne va in una parte che non si può parallelizzare, anche rendendo il resto infinitamente veloce non si va oltre 1/0,4 = <b>2,5×</b>. Da qui la morale operativa: ha senso ottimizzare solo ciò che pesa, e prima di ottimizzare bisogna <b>misurare</b>.</p>
    <p>La stessa legge spiega perché raddoppiare i core raramente dimezza il tempo: la parte sequenziale del programma, più la sincronizzazione, restano.</p>

    <h4>Misurare: benchmark, non MIPS</h4>
    <p>I <b>MIPS</b> (milioni di istruzioni al secondo) sono una misura ingannevole: dipendono dal repertorio — un'istruzione CISC fa il lavoro di tre RISC — e dal programma. Anche i <b>FLOPS</b> dicono poco fuori dal calcolo numerico.</p>
    <p>Si usano allora i <b>benchmark</b>: programmi reali, eseguiti su una macchina di riferimento, con il risultato espresso come rapporto fra i tempi. Le suite SPEC ne raccolgono decine e riassumono i punteggi con la <b>media geometrica</b>, non con quella aritmetica: la media geometrica di rapporti non dipende da quale macchina si sceglie come riferimento, mentre quella aritmetica sì.</p>

    <h4>Tre livelli di parallelismo</h4>
    <ul>
      <li><b>Fra istruzioni</b> — pipeline, esecuzione superscalare, riordino: si sovrappongono istruzioni dello stesso flusso. È il livello del capitolo sulla pipeline.</li>
      <li><b>Fra dati</b> — una sola istruzione opera su un vettore di valori (<b>SIMD</b>): tipico di grafica e segnali.</li>
      <li><b>Fra processi</b> — più <b>core</b> eseguono flussi diversi. È la strada presa quando alzare la frequenza è diventato insostenibile per il consumo.</li>
    </ul>
    <p>Il consumo dinamico cresce con f·C·V²: raddoppiare la frequenza costa più che raddoppiare i core, ed è questa la ragione fisica del passaggio al multicore, non una moda commerciale.</p>

    <h4>Coerenza delle cache</h4>
    <p>Se ogni core ha la sua cache e tutti condividono la memoria, la stessa variabile può esistere in più copie. Se un core la modifica, gli altri devono accorgersene: è il problema della <b>coerenza</b>. I protocolli di <i>snooping</i> risolvono facendo sorvegliare il bus a ogni cache: quando qualcuno scrive un blocco, le altre copie vengono invalidate.</p>
    <p>Lo stesso problema si presenta con il <b>DMA</b>, che scrive in memoria alle spalle del processore: il blocco corrispondente in cache diventa obsoleto e va invalidato.</p>

    <h4>Che cosa chiedono all’esame</h4>
    <p>Quasi sempre l'equazione <code>T = (N × S) / R</code> applicata a numeri, oppure Amdahl su un caso concreto, oppure la domanda-trappola «un processore a frequenza più alta è più veloce?». La risposta giusta cita tutti e tre i fattori e nota che il confronto ha senso solo <b>a parità di programma</b>.</p>
    <h4>Errori tipici</h4>
    <ul>
      <li>Confrontare due macchine con la frequenza di clock, o con i MIPS: contano tutti e tre i fattori, e solo <b>a parità di programma</b>.</li>
      <li>Applicare Amdahl al fattore di miglioramento invece che alla <b>frazione di tempo</b>: <i>f</i> è la quota di tempo occupata dalla parte migliorata, non la sua dimensione nel codice.</li>
      <li>Riassumere punteggi di benchmark con la media aritmetica: sono rapporti, e la media giusta è quella <b>geometrica</b>.</li>
      <li>Dimenticare che nel multicore la parte sequenziale e la sincronizzazione non spariscono: il numero di core non è lo speedup.</li>
    </ul>`,
  checks: [
    {
      q: 'Un processore a 3 GHz è più veloce di uno a 2,5 GHz?',
      a: 'Non si può dire. Il tempo è <b>(N × S) / R</b>: la frequenza è solo uno dei tre fattori. Se il secondo esegue meno istruzioni o ha un numero di cicli per istruzione più basso — cache migliore, pipeline più efficace — può risultare più veloce sullo stesso programma.',
    },
    {
      q: 'Il 30 % del tempo di un programma è speso in una parte che rendi 10 volte più veloce. Quanto guadagni in tutto?',
      a: 'speedup = 1 / (0,7 + 0,3/10) = 1 / 0,73 ≈ <b>1,37×</b>, cioè circa il 27 % di tempo in meno. Il 70 % non toccato domina il risultato: è esattamente il punto della legge di Amdahl.',
    },
    {
      q: 'Perché le suite di benchmark riassumono i risultati con la media geometrica?',
      a: 'Perché i punteggi sono <b>rapporti</b> rispetto a una macchina di riferimento: la media geometrica di rapporti dà lo stesso ordinamento qualunque sia il riferimento scelto, mentre la media aritmetica cambia risultato al cambiare della macchina di base.',
    },
  ],
  exercises: [
    {
      id: 'ex-perf-1',
      level: 'base',
      q: 'Un programma esegue <b>2 × 10⁹</b> istruzioni con un numero medio di cicli per istruzione pari a <b>1,8</b>, su un processore a <b>3 GHz</b>. Quanto dura?',
      hint: 'Applica direttamente l’equazione delle prestazioni, badando alle unità di misura.',
      solution: `<pre>T = (N × S) / R
  = (2×10⁹ × 1,8) / (3×10⁹ Hz)
  = 3,6×10⁹ cicli / 3×10⁹ cicli al secondo
  = <b>1,2 s</b></pre><p>Da qui si legge subito quanto vale ogni miglioramento. Portare S da 1,8 a 1,5 (cache migliore) darebbe 1,0 s; portare la frequenza da 3 a 3,6 GHz darebbe la stessa cosa. Le due strade sono equivalenti sul risultato ma non sul costo: la prima è organizzazione, la seconda è consumo e calore.</p>`,
    },
    {
      id: 'ex-perf-2',
      level: 'base',
      q: 'La macchina A ha clock 2,5 GHz e S = 1,2. La macchina B ha clock 3 GHz e S = 1,8. Sullo stesso programma, quale è più veloce e di quanto?',
      hint: 'A parità di programma N è lo stesso, quindi si può confrontare direttamente S/R.',
      solution: `<pre>T_A = N × 1,2 / 2,5×10⁹ = N × 0,48 ns
T_B = N × 1,8 / 3,0×10⁹ = N × 0,60 ns

T_B / T_A = 0,60 / 0,48 = 1,25</pre><p>La macchina <b>A è il 25 % più veloce</b>, pur avendo la frequenza più bassa: il suo vantaggio su S (1,2 contro 1,8) più che compensa i 500 MHz in meno.</p><p>È la risposta alla domanda-trappola «un processore a frequenza più alta è più veloce?». No: la frequenza è un fattore su tre, e da sola non dice niente. Il confronto ha senso solo <b>a parità di programma</b>, perché anche N cambia da macchina a macchina.</p>`,
    },
    {
      id: 'ex-perf-3',
      level: 'esame',
      q: 'Un programma spende il <b>25 %</b> del tempo in una funzione che riscrivi rendendola <b>8 volte</b> più veloce. Qual è il guadagno complessivo? E se la rendessi infinitamente veloce?',
      hint: 'Legge di Amdahl. Attenzione: <i>f</i> è la frazione di <b>tempo</b> occupata dalla parte migliorata, non la sua dimensione nel codice.',
      solution: `<pre>speedup = 1 / ( (1 − f) + f/k )
        = 1 / ( 0,75 + 0,25/8 )
        = 1 / ( 0,75 + 0,03125 )
        = 1 / 0,78125 = <b>1,28×</b>

limite con k → ∞:
        = 1 / 0,75 = <b>1,33×</b></pre><p>Otto volte più veloce su un quarto del tempo produce appena il 28 % di guadagno; e anche azzerando del tutto quella parte non si supera il 33 %. Il collo di bottiglia è il 75 % non toccato.</p><p>Conseguenza operativa: <b>misurare prima di ottimizzare</b>. Investire settimane su una funzione che pesa il 25 % ha un tetto del 33 %; la stessa fatica su una che pesa il 70 % ne vale molto di più. È il motivo per cui i profiler esistono.</p>`,
    },
    {
      id: 'ex-perf-4',
      level: 'esame',
      q: 'Un programma è parallelizzabile all’<b>80 %</b>. Quanti core servono per dimezzare il tempo di esecuzione? E qual è il massimo guadagno raggiungibile con infiniti core?',
      hint: 'Amdahl con k = numero di core sulla parte parallela. Imposta lo speedup a 2 e risolvi.',
      solution: `<pre>speedup = 1 / ( 0,20 + 0,80/k ) = 2

0,20 + 0,80/k = 0,5
0,80/k = 0,3
k = 0,80 / 0,3 ≈ <b>2,7 → 3 core</b>

limite con k → ∞:  1 / 0,20 = <b>5×</b></pre><p>Tre core bastano per raddoppiare la velocità, ma per triplicarla ne servirebbero 8, e oltre 5× non si va <b>mai</b>, nemmeno con mille core. Il 20 % sequenziale è un muro.</p><p>E il conto è ancora ottimistico: non tiene conto del costo di <b>sincronizzazione</b>, che cresce con il numero di core e a un certo punto può far <i>peggiorare</i> le prestazioni aggiungendo processori. È la ragione per cui il parallelismo non è una soluzione universale.</p>`,
    },
    {
      id: 'ex-perf-5',
      level: 'esame',
      q: 'Due benchmark: sul primo la macchina X è <b>10 volte</b> più veloce del riferimento, sul secondo è <b>0,1 volte</b> (cioè dieci volte più lenta). Calcola il punteggio con la media <b>aritmetica</b> e con la <b>geometrica</b>, e di’ quale è corretta.',
      hint: 'La media giusta è quella che non cambia se si sceglie una macchina di riferimento diversa. Prova a immaginare di invertire i ruoli.',
      solution: `<pre>media aritmetica = (10 + 0,1) / 2 = <b>5,05</b>
media geometrica = √(10 × 0,1) = √1 = <b>1,0</b></pre><p>L’aritmetica dice che X è cinque volte più veloce del riferimento: assurdo, visto che su un benchmark vince di dieci e sull’altro perde di dieci. La geometrica dice <b>1,0</b>, cioè pari — che è la lettura sensata.</p><p>Il motivo formale: i punteggi sono <b>rapporti</b>. La media geometrica di rapporti gode della proprietà che, invertendo il riferimento, il risultato si inverte coerentemente e l’<b>ordinamento fra le macchine non cambia</b>. La media aritmetica no: cambiando macchina di riferimento può cambiare persino chi vince, il che la rende inutilizzabile per un confronto.</p><p>È per questo che le suite SPEC pubblicano medie geometriche, e la ragione per cui un punteggio sintetico va sempre letto sapendo <b>come</b> è stato aggregato.</p>`,
    },
  ],
};
