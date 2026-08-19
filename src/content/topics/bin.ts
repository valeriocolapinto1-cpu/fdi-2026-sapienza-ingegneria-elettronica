import type { Topic } from '../types';

export const bin: Topic = {
    id: 'bin',
    title: 'Numeri binari & complemento a 2',
    blurb: "Basi, rappresentazioni con segno, range, overflow. La parte più «spremuta» all'esame.",
    ref: 'Hamacher cap. 1',
    trapIds: ['trap-ram'],
    body: `
    <h4>Basi e conversioni</h4>
    <p>Un numero in base <code>b</code> è una somma di cifre pesate: <code>1011₂ = 1·2³ + 0·2² + 1·2¹ + 1·2⁰ = 11</code>. Per convertire da decimale a binario si divide ripetutamente per 2 e si leggono i resti <b>dal basso verso l'alto</b>.</p>
    <p>Esadecimale e ottale servono solo ad accorciare la scrittura: una cifra hex vale <b>4 bit</b>, una ottale <b>3 bit</b>. Si converte raggruppando, senza passare dal decimale:</p>
    <pre>1011 0110₂  →  B    6    →  0xB6
   ↑    ↑        11   6</pre>
    <p>Da decimale a esadecimale conviene dividere per 16: <code>182 = 11·16 + 6 → B6</code>.</p>

    <h4>Che cosa rende «posizionale» una notazione</h4>
    <p>In una notazione posizionale il valore di una cifra dipende da <b>dove</b> sta: ogni
    posizione pesa una potenza della base. Servono due ingredienti, e solo due:</p>
    <ul>
      <li><b>b simboli</b> distinti per le cifre, da 0 a b−1;</li>
      <li>uno <b>zero</b>, per dire «questa posizione è vuota» — senza, non si distingue 12 da 102.</li>
    </ul>
    <p>Cambiare base significa cambiare quanti oggetti servono in una posizione prima di
    «riportare» a quella successiva. In base 10 si riporta a dieci, in base 2 a due, in base 20 a
    venti. La regola di conversione è sempre la stessa: <b>divisioni successive per la base</b>,
    leggendo i resti dal basso.</p>
    <p>Un sistema che usa gruppi di oggetti — sassolini su un abaco, punti e barre come nella
    numerazione Maya, che è <b>vigesimale</b> (base 20) — si adatta a un'altra base semplicemente
    ridefinendo <i>quando</i> un gruppo si converte in un simbolo di ordine superiore. Per passare
    a base 8 servono otto simboli e il riporto scatta a otto; per base 16 ne servono sedici e il
    riporto scatta a sedici. Il meccanismo posizionale non cambia: cambia solo la soglia di
    raggruppamento, e quanti simboli distinti bisogna inventare.</p>

    <h4>Rappresentazioni con segno</h4>
    <p>Con N bit si possono codificare 2ᴺ configurazioni: la domanda è come spenderle fra positivi e negativi.</p>
    <ul>
      <li><b>Modulo e segno</b>: il bit più significativo è il segno, il resto è il valore assoluto. Intervallo simmetrico, ma <b>due</b> codifiche dello zero (+0 e −0) e l'aritmetica richiede di confrontare i segni.</li>
      <li><b>Complemento a 1</b>: il negativo si ottiene invertendo tutti i bit. Ancora <b>due</b> zeri, e la somma richiede il riporto circolare.</li>
      <li><b>Complemento a 2</b>: il negativo si ottiene invertendo i bit e sommando 1. <b>Una sola</b> codifica dello zero e intervallo asimmetrico.</li>
    </ul>

    <h4>Perché all'esame si usa il complemento a 2</h4>
    <p>Non è una convenzione arbitraria: in CP2 la <b>sottrazione diventa una somma</b>, perché <code>A − B = A + (−B)</code> e il negativo è ottenibile con un invertitore e un riporto entrante. Serve quindi <b>un solo sommatore</b> per entrambe le operazioni, e non c'è nessun caso speciale da trattare sui segni.</p>
    <p>Il bit più significativo ha peso <b>negativo</b>: su 4 bit, <code>1011₂ = −8 + 0 + 2 + 1 = −5</code>. È il modo più rapido per leggere un CP2 senza fare l'inversione.</p>

    <h4>Range</h4>
    <ul>
      <li>Senza segno: da <code>0</code> a <code>2ᴺ−1</code> (con 8 bit → 0…255).</li>
      <li>CP2: da <code>−2ᴺ⁻¹</code> a <code>+2ᴺ⁻¹−1</code> (con 8 bit → −128…+127).</li>
      <li>CP1 e modulo-e-segno: da <code>−(2ᴺ⁻¹−1)</code> a <code>+2ᴺ⁻¹−1</code>, simmetrico.</li>
    </ul>
    <p>L'asimmetria del CP2 è la ragione per cui <code>−128</code> esiste su 8 bit ma <code>+128</code> no: il suo opposto non è rappresentabile, e invertire-e-sommare-1 su <code>10000000</code> restituisce sé stesso.</p>

    <h4>Estensione del segno</h4>
    <p>Per portare un CP2 da N a M bit (M &gt; N) si <b>replica il bit di segno</b> a sinistra, non si riempie di zeri: <code>1011</code> (−5 su 4 bit) diventa <code>11111011</code> su 8 bit. Riempire di zeri darebbe 251.</p>

    <h4>Overflow — e perché non è il riporto uscente</h4>
    <p>Si ha overflow quando il risultato esce dall'intervallo rappresentabile. Due regole equivalenti:</p>
    <ul>
      <li><b>Per segni</b>: sommando due operandi <b>concordi</b> si ottiene un risultato di segno opposto. Sommando due discordi l'overflow è impossibile. Nella sottrazione il caso a rischio è quello fra operandi <b>discordi</b>.</li>
      <li><b>In hardware</b>: <code>overflow = C<sub>in</sub> ⊕ C<sub>out</sub></code> sul bit di segno, cioè lo XOR fra il riporto che entra nel bit più significativo e quello che ne esce.</li>
    </ul>
    <p>Il <b>riporto uscente da solo non significa nulla</b> in CP2. Due controesempi da tenere a mente:</p>
    <pre>4 bit:  −1 + 1  →  1111 + 0001 = 0000   carry=1  overflow=0
4 bit:   4 + 4  →  0100 + 0100 = 1000   carry=0  overflow=1</pre>
    <p>Il carry out segnala overflow solo nell'aritmetica <b>senza segno</b>. Confonderli è una perdita di punti classica: nello Strumento «Sommatore binario» i due flag sono mostrati separati apposta.</p>

    <h4>Shift</h4>
    <p>Shift a sinistra di k posizioni ≈ moltiplicazione per 2ᵏ; shift a destra ≈ divisione intera per 2ᵏ. Attenzione al tipo di shift a destra:</p>
    <ul>
      <li><b>Logico</b>: entra 0 da sinistra. Corretto per i numeri senza segno.</li>
      <li><b>Aritmetico</b>: replica il bit di segno. Necessario in CP2, altrimenti un negativo diventa positivo.</li>
    </ul>
    <p>Eliminare il bit meno significativo di un intero senza segno equivale a dividerlo per 2.</p>`,
  };
