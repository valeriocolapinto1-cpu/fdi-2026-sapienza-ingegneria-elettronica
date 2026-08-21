import type { Topic } from '../types';

export const ieee: Topic = {
    id: 'ieee',
    title: 'Virgola mobile IEEE 754',
    blurb: 'Segno, esponente polarizzato, mantissa, codifica e valori speciali.',
    ref: 'Hamacher cap. 1',
    trapIds: [],
    prereq: ['bin'],
    summary: [
      'Singola precisione (32 bit): <b>1 segno + 8 esponente + 23 mantissa</b>. Doppia (64 bit): 1 + 11 + 52.',
      'Il valore è <b>(−1)<sup>s</sup> × 1,M × 2<sup>E−bias</sup></b>: l\'1 davanti alla virgola è <b>implicito</b> e non si memorizza, così si guadagna un bit di precisione.',
      'Il <b>bias</b> (127 e 1023) serve a rendere l\'esponente un numero senza segno: due float positivi si confrontano leggendo i bit come interi.',
      'Esponente tutto a 0 → zero e denormalizzati. Tutto a 1 → infinito (mantissa nulla) o <b>NaN</b> (mantissa diversa da zero).',
      'La precisione è <b>relativa</b>: pochi decimali sono rappresentabili esattamente, e confrontare due float con «=» è quasi sempre un errore.',
    ],
    checks: [
      {
        q: 'Scrivi −6,5 in singola precisione.',
        a: '6,5 = 110,1₂ = 1,101 × 2². Segno s = 1; esponente E = 2 + 127 = 129 = 1000 0001; mantissa 101 seguita da zeri. Bit: <code>1 10000001 10100000000000000000000</code> = <code>C0D00000</code>₁₆.',
      },
      {
        q: 'Perché l\'esponente è in eccesso e non in complemento a 2?',
        a: 'Perché così l\'ordine dei pattern di bit coincide con l\'ordine dei valori: due float positivi si confrontano come se fossero interi senza segno, senza circuiti dedicati al segno dell\'esponente.',
      },
      {
        q: 'Che cosa distingue infinito da NaN?',
        a: 'Entrambi hanno l\'esponente tutto a 1. L\'<b>infinito</b> ha mantissa nulla ed è il risultato di un overflow o di una divisione per zero; il <b>NaN</b> ha mantissa diversa da zero e nasce da operazioni indefinite come 0/0 o ∞ − ∞.',
      },
    ],
    body: `
    <h4>Perché serve</h4>
    <p>Con la virgola fissa il numero di cifre decimali è deciso una volta per tutte e l'intervallo è angusto. La virgola mobile spende i bit su una <b>notazione scientifica binaria</b>, <code>± mantissa × 2^esponente</code>, ottenendo un intervallo enormemente più ampio a parità di bit — al prezzo di una precisione <b>relativa</b> anziché assoluta.</p>

    <h4>Singola precisione (32 bit)</h4>
    <pre>| S |   E (8 bit)  |        M (23 bit)        |
  1        8                    23</pre>
    <ul>
      <li><b>S</b>: segno, 0 positivo e 1 negativo.</li>
      <li><b>E</b>: esponente <b>polarizzato</b> con bias <b>127</b>: si memorizza <code>E = esponente reale + 127</code>. Serve a rappresentare esponenti negativi senza un secondo bit di segno, e permette di confrontare i float come se fossero interi.</li>
      <li><b>M</b>: mantissa, la parte dopo la virgola. Il <b>bit implicito</b> «1.» non si memorizza: normalizzando, la cifra prima della virgola è sempre 1, quindi si guadagna un bit gratis.</li>
    </ul>
    <p>Valore = <code>(−1)ˢ · 1.M · 2^(E−127)</code></p>

    <h4>Codificare un numero — esempio</h4>
    <p>Si voglia rappresentare <code>−6,5</code>:</p>
    <ol>
      <li>In binario: <code>6,5 = 110,1₂</code></li>
      <li>Normalizzo: <code>110,1 = 1,101 × 2²</code> → mantissa <code>101</code>, esponente reale <code>2</code></li>
      <li>Polarizzo: <code>E = 2 + 127 = 129 = 10000001₂</code></li>
      <li>Segno: negativo → <code>S = 1</code></li>
    </ol>
    <pre>1 10000001 10100000000000000000000</pre>
    <p>Per <b>decodificare</b> si procede a ritroso: si sottrae il bias dall'esponente, si rimette l'1 implicito davanti alla mantissa e si sposta la virgola.</p>

    <h4>Doppia precisione (64 bit)</h4>
    <p>1 bit di segno, <b>11</b> di esponente con bias <b>1023</b>, <b>52</b> di mantissa. Stessa logica, più intervallo e più precisione.</p>

    <h4>Valori speciali</h4>
    <p>Due configurazioni dell'esponente sono riservate:</p>
    <ul>
      <li><code>E = 0</code> con mantissa nulla → <b>zero</b> (con segno: esistono +0 e −0).</li>
      <li><code>E = 0</code> con mantissa non nulla → numeri <b>denormalizzati</b>, senza bit implicito: riempiono il vuoto attorno allo zero.</li>
      <li><code>E = 255</code> (tutti 1) con mantissa nulla → <b>infinito</b>, con segno.</li>
      <li><code>E = 255</code> con mantissa non nulla → <b>NaN</b>, risultato di operazioni indefinite come 0/0.</li>
    </ul>

    <h4>Da ricordare</h4>
    <p>Lo standard si chiama <b>IEEE 754</b>. Due conseguenze pratiche: l'addizione in virgola mobile <b>non è associativa</b>, perché ogni passaggio arrotonda; e molti decimali «semplici» come 0,1 non hanno rappresentazione binaria finita, quindi il confronto per uguaglianza fra float è inaffidabile.</p>
    <h4>Errori tipici</h4>
    <ul>
      <li>Memorizzare anche l'1 davanti alla virgola: è <b>implicito</b>, nella mantissa vanno solo le cifre dopo.</li>
      <li>Sottrarre il bias invece di sommarlo in fase di <b>codifica</b>: si somma quando si scrive, si sottrae quando si legge.</li>
      <li>Normalizzare male: la forma è sempre <code>1,xxx × 2ᵉ</code>, con una sola cifra diversa da zero davanti alla virgola.</li>
      <li>Trattare esponente tutto a 0 o tutto a 1 come numeri normali: sono i casi speciali (zero, denormalizzati, infinito, NaN).</li>
    </ul>`,
    exercises: [
      {
        id: 'ex-ieee-1',
        level: 'base',
        q: 'Rappresenta <b>−12,375</b> in singola precisione IEEE 754 e scrivi il risultato in esadecimale.',
        hint: 'Converti separatamente parte intera e parte frazionaria, normalizza in 1,xxx × 2ᵉ, poi somma il bias all’esponente.',
        solution: `<pre>12      = 1100₂
0,375   = 0,011₂        (0,25 + 0,125)
12,375  = 1100,011₂

normalizzo:  1100,011 = 1,100011 × 2³

segno     s = 1                     (negativo)
esponente E = 3 + 127 = 130 = 1000 0010
mantissa  M = 100011 + zeri          (l'1 iniziale NON si scrive)

1 10000010 10001100000000000000000
= 1100 0001 0100 0110 0000 0000 0000 0000
= <b>0xC1460000</b></pre><p>I due errori da evitare: mettere l’1 iniziale dentro la mantissa (è implicito, si guadagna un bit di precisione) e <b>sottrarre</b> il bias invece di sommarlo — si somma quando si codifica, si sottrae quando si decodifica.</p>`,
      },
      {
        id: 'ex-ieee-2',
        level: 'base',
        q: 'Che numero decimale rappresenta la configurazione <code>0x41200000</code> in singola precisione?',
        hint: 'Scomponi i 32 bit nei tre campi, togli il bias dall’esponente e rimetti l’1 implicito davanti alla mantissa.',
        solution: `<pre>0x41200000 = 0100 0001 0010 0000 0000 0000 0000 0000

segno     = 0                    → positivo
esponente = 1000 0010 = 130      → e = 130 − 127 = 3
mantissa  = 010 0000…            → 1,01₂ con l'1 implicito

valore = 1,01₂ × 2³ = 1010₂ = <b>10,0</b></pre><p>Il procedimento è esattamente l’inverso della codifica: separa, sottrai il bias, ricostruisci. Un controllo utile: l’esponente 130 è poco sopra 127, quindi il numero è dell’ordine delle unità o delle decine — se fosse venuto 10 000 ci sarebbe stato un errore da qualche parte.</p>`,
      },
      {
        id: 'ex-ieee-3',
        level: 'esame',
        q: 'Che cosa rappresentano queste configurazioni a 32 bit? <code>0x00000000</code> · <code>0x80000000</code> · <code>0x7F800000</code> · <code>0xFF800000</code> · <code>0x7FC00000</code>',
        hint: 'Guarda prima l’esponente: se è tutto 0 o tutto 1 non sei nel caso normale, e la mantissa dice quale caso speciale è.',
        solution: `<pre>0x00000000  s=0  E=00000000  M=0   →  <b>+0</b>
0x80000000  s=1  E=00000000  M=0   →  <b>−0</b>
0x7F800000  s=0  E=11111111  M=0   →  <b>+∞</b>
0xFF800000  s=1  E=11111111  M=0   →  <b>−∞</b>
0x7FC00000  s=0  E=11111111  M≠0   →  <b>NaN</b></pre><p>La regola: esponente <b>tutto a 0</b> significa zero (mantissa nulla) oppure numero <b>denormalizzato</b> (mantissa diversa da zero, e allora l’1 implicito non c’è); esponente <b>tutto a 1</b> significa infinito (mantissa nulla) oppure <b>NaN</b> (mantissa diversa da zero).</p><p>Curiosità che l’esame chiede volentieri: esistono <b>due zeri</b>, +0 e −0, e si comportano come uguali nei confronti ma sono distinguibili nei bit. Il NaN invece non è uguale nemmeno a se stesso: <code>x ≠ x</code> è il modo canonico per riconoscerlo.</p>`,
      },
      {
        id: 'ex-ieee-4',
        level: 'esame',
        q: 'Perché <code>0,1</code> non è rappresentabile esattamente in IEEE 754, mentre <code>0,5</code> e <code>0,25</code> sì? Che cosa comporta in pratica?',
        hint: 'Un numero è rappresentabile con un numero finito di cifre binarie solo se il suo denominatore, ridotto ai minimi termini, è una potenza di 2.',
        solution: `<pre>0,5  = 1/2   = 2⁻¹        → 0,1₂         esatto
0,25 = 1/4   = 2⁻²        → 0,01₂        esatto
0,1  = 1/10  = 1/(2 × 5)  → il fattore 5 non è una potenza di 2</pre><p>In binario 0,1 diventa <b>periodico</b>:</p><pre>0,1₁₀ = 0,0001100110011001100110011…₂   (il gruppo 0011 si ripete)</pre><p>La mantissa ha 23 bit, quindi la sequenza viene troncata e arrotondata: il valore memorizzato è leggermente diverso da 0,1 (circa 0,100000001490116…).</p><p>Conseguenze pratiche. Sommando dieci volte 0,1 <b>non</b> si ottiene esattamente 1, quindi confrontare due float con l’uguaglianza è quasi sempre sbagliato: si confronta la differenza con una tolleranza. E gli importi di denaro non si tengono in virgola mobile ma in interi (centesimi), proprio perché 0,10 non è rappresentabile.</p>`,
      },
      {
        id: 'ex-ieee-5',
        level: 'esame',
        q: 'Verifica che due numeri in virgola mobile <b>positivi</b> si possano confrontare leggendo i loro bit come se fossero interi senza segno, usando 1,0 (<code>0x3F800000</code>) e 2,0 (<code>0x40000000</code>). La proprietà vale anche per i negativi?',
        hint: 'Guarda l’ordine dei campi dentro la parola: segno, poi esponente, poi mantissa. Chiediti perché è proprio quello.',
        solution: `<pre>1,0 = 0x3F800000  →  come intero: 1 065 353 216
2,0 = 0x40000000  →  come intero: 1 073 741 824

1 065 353 216 &lt; 1 073 741 824   ✓  e infatti 1,0 &lt; 2,0</pre><p>Funziona per tre ragioni combinate: l’<b>esponente sta prima</b> della mantissa, quindi domina il confronto come deve; l’esponente è in <b>eccesso</b> (bias) e non in complemento a 2, quindi è un numero senza segno crescente; e la mantissa, essendo dopo, decide solo a parità di esponente.</p><p>Per i <b>negativi</b> la proprietà si rompe: il bit di segno a 1 rende l’intero corrispondente più grande, quindi −2,0 risulterebbe «maggiore» di +1,0, e fra due negativi l’ordine si <b>inverte</b> (−1,0 ha bit minori di −2,0 letti come interi… anzi maggiori, perché al crescere del modulo cresce l’esponente).</p><p>È il motivo per cui l’hardware di confronto in virgola mobile tratta il segno a parte: la scorciatoia vale solo nel semiasse positivo, ed è comunque una proprietà che il formato IEEE 754 ha ottenuto <b>per progetto</b>, non per caso.</p>`,
      },
    ],
  };
