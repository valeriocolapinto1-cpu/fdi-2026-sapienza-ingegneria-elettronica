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
  };
