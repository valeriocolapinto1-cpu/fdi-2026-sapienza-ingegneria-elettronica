import type { Topic } from '../types';

export const ieee: Topic = {
    id: 'ieee',
    title: 'Virgola mobile IEEE 754',
    blurb: 'Segno, esponente polarizzato, mantissa, codifica e valori speciali.',
    ref: 'Hamacher cap. 1',
    trapIds: [],
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
    <p>Lo standard si chiama <b>IEEE 754</b>. Due conseguenze pratiche: l'addizione in virgola mobile <b>non è associativa</b>, perché ogni passaggio arrotonda; e molti decimali «semplici» come 0,1 non hanno rappresentazione binaria finita, quindi il confronto per uguaglianza fra float è inaffidabile.</p>`,
  };
