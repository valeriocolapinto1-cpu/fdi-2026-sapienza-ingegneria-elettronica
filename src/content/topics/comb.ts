import type { Topic } from '../types';
import { ovl } from './_ovl';

export const comb: Topic = {
  id: 'comb',
  title: 'Reti combinatorie notevoli',
  blurb: 'Decoder, encoder, multiplexer, comparatori, buffer tri-state.',
  ref: 'Hamacher — Appendice A',
  trapIds: ['trap-and-assoc'],
    prereq: ['bool'],
    summary: [
      'I blocchi standard esistono perché certe funzioni ricorrono sempre: sceglere, indirizzare, confrontare.',
      '<b>Decoder</b> n → 2ⁿ: attiva <b>una sola</b> uscita, quella indirizzata. È il selettore di righe di una memoria o di un registro.',
      '<b>MUX</b> 2ⁿ → 1: sceglie un ingresso con n segnali di selezione. Con i selettori collegati alle variabili e le costanti sugli ingressi realizza <b>qualunque</b> funzione di n variabili.',
      '<b>Comparatore</b>: l\'uguaglianza si costruisce con XNOR bit a bit e una AND finale.',
      '<b>Tri-state</b>: la terza condizione è l\'alta impedenza, cioè «staccato». È ciò che permette a più sorgenti di condividere un bus, una sola abilitata per volta.',
    ],
    checks: [
      {
        q: 'Come realizzi Y = A·B + C con un multiplexer a 3 selettori?',
        a: 'Si collegano A, B, C ai tre selettori e su ciascuno degli 8 ingressi dati si mette la costante 0 o 1 pari al valore della funzione per quel mintermine: gli ingressi dati <b>sono</b> la colonna d\'uscita della tabella di verità.',
      },
      {
        q: 'Perché due uscite non tri-state non possono essere collegate allo stesso filo?',
        a: 'Se una impone 0 e l\'altra 1 si crea un percorso diretto fra alimentazione e massa: valore d\'uscita indefinito e corrente elevata. Il tri-state consente a tutte tranne una di «staccarsi».',
      },
      {
        q: 'A che serve l\'ingresso di abilitazione di un decoder?',
        a: 'A spegnere tutte le uscite. Serve per comporre decoder grandi con decoder piccoli: i bit più significativi abilitano il blocco giusto, i meno significativi scelgono la riga.',
      },
    ],
  body: `
    <h4>Perché esistono i blocchi standard</h4>
    <p>Ogni funzione si può sintetizzare da zero con la mappa di Karnaugh, ma alcune ricorrono
    così spesso da avere un nome e un simbolo propri. Riconoscerle fa risparmiare tempo: invece di
    minimizzare una tabella a 4 variabili si dice «è un multiplexer» e si passa oltre.</p>

    <h4>Decodificatore (decoder)</h4>
    <p>Ha <b>n ingressi</b> e <b>2ⁿ uscite</b>, e attiva <b>una sola</b> uscita per volta: quella
    il cui indice corrisponde al numero binario presentato in ingresso.</p>
    <pre>x₁ x₀ │ y₃ y₂ y₁ y₀
 0  0 │  0  0  0  1
 0  1 │  0  0  1  0
 1  0 │  0  1  0  0
 1  1 │  1  0  0  0</pre>
    <p>Ogni uscita è il <b>mintermine</b> corrispondente: <code>y₀ = ${ovl('x₁')}·${ovl('x₀')}</code>,
    <code>y₁ = ${ovl('x₁')}·x₀</code> e così via. Serve a selezionare una fra molte cose: un chip
    di memoria dato l'indirizzo, un registro dato il suo numero, una cifra di un display.</p>
    <p>Quasi sempre ha un ingresso di <b>abilitazione</b> (enable): se è a 0 tutte le uscite
    restano spente, il che permette di comporre decoder piccoli per farne uno grande.</p>

    <h4>Codificatore (encoder)</h4>
    <p>L'operazione inversa: 2ⁿ ingressi, n uscite, restituisce l'<b>indice</b> dell'ingresso
    attivo. Il problema è cosa fare se ne sono attivi due: il <b>priority encoder</b> lo risolve
    dando la precedenza all'indice più alto. È il circuito che decide quale richiesta di
    interruzione servire quando ne arrivano più d'una insieme.</p>

    <h4>Multiplexer (MUX)</h4>
    <p>Sceglie <b>uno fra 2ⁿ ingressi dati</b> e lo porta in uscita, in base a n linee di
    selezione. Con due ingressi dati e una selezione:</p>
    <pre>f = ${ovl('s')}·w₀ + s·w₁</pre>
    <p>È l'interruttore programmabile del circuito: dentro il processore serve a scegliere quale
    sorgente presentare alla ALU o quale valore scrivere nel PC. Il <b>demultiplexer</b> fa il
    contrario: instrada un unico ingresso verso l'uscita selezionata.</p>

    <h4>Sintetizzare una funzione qualsiasi con un MUX</h4>
    <p>Un multiplexer a n selezioni realizza <b>qualunque</b> funzione di n variabili: si collegano
    le variabili alle selezioni e si fissa ciascun ingresso dati al valore che la funzione assume
    in quella riga della tabella di verità. Gli ingressi dati sono, letteralmente, la colonna
    delle uscite.</p>
    <p>Con un MUX si può anche coprire una funzione di <b>n+1</b> variabili: si usano n variabili
    per le selezioni e a ogni ingresso dati si collega, invece di una costante, la variabile
    rimanente, il suo complemento, 0 oppure 1.</p>

    <h4>Comparatori</h4>
    <p>L'uguaglianza fra due bit è lo <b>XNOR</b>: vale 1 quando sono uguali. Per confrontare
    parole di n bit si mettono in AND gli XNOR di tutte le posizioni. Per stabilire quale dei due
    è maggiore si procede dal bit più significativo verso il basso, decidendo alla prima posizione
    in cui differiscono. In alternativa si sottrae e si leggono i flag: è ciò che fa l'istruzione
    <code>CMP</code>.</p>

    <h4>Buffer tri-state</h4>
    <p>Una porta normale ha due stati d'uscita, 0 e 1, e li impone sempre. Un <b>buffer
    tri-state</b> ne ha un terzo, l'<b>alta impedenza</b>: quando l'abilitazione è spenta l'uscita
    si <b>scollega</b> elettricamente, come se il filo fosse tagliato.</p>
    <p>Serve a far condividere un <b>bus</b> a più dispositivi. Su un bus a un certo istante deve
    parlare uno solo: tutti gli altri mettono le loro uscite in alta impedenza. Senza tri-state,
    due dispositivi che pilotano lo stesso filo con valori opposti creerebbero un cortocircuito.
    È il motivo per cui, nello schema del processore, i registri si affacciano sul bus interno
    attraverso questi buffer.</p>
    <h4>Esempio svolto</h4>
    <p><b>Realizza la funzione maggioranza (Y = 1 con almeno due ingressi a 1) in due modi.</b></p>
    <p><b>Con un MUX 8→1.</b> I tre ingressi A, B, C vanno ai <b>selettori</b>; sugli otto ingressi dati si mettono le costanti della colonna d'uscita, nell'ordine dei mintermini:</p>
    <pre>selettori: S₂S₁S₀ = A B C
ingressi dati: I₀…I₇ = 0, 0, 0, 1, 0, 1, 1, 1
                      (m0)        (m3)  (m5)(m6)(m7)</pre>
    <p>Nessuna porta logica: la tabella di verità <b>è</b> il cablaggio. È il motivo per cui un MUX a n selettori realizza qualunque funzione di n variabili.</p>
    <p><b>Con un decoder 3→8 e una OR.</b> Il decoder attiva l'uscita corrispondente alla combinazione presente; basta collegare a una OR le uscite dei mintermini a 1:</p>
    <pre>Y = m₃ + m₅ + m₆ + m₇</pre>
    <p>Il decoder genera <b>tutti</b> i mintermini, la OR sceglie quali servono. Con più funzioni delle stesse variabili si riusa lo stesso decoder cambiando solo le OR.</p>

    <h4>Errori tipici</h4>
    <ul>
      <li>Collegare le variabili agli ingressi <b>dati</b> del MUX invece che ai selettori: sono i selettori a scegliere, i dati sono le costanti della tabella.</li>
      <li>Dimenticare l'ordine dei mintermini: I₀ corrisponde a S = 000, I₇ a S = 111.</li>
      <li>Unire due uscite normali sullo stesso filo per «fare l'OR»: serve una porta, o dei buffer tri-state con una sola abilitazione attiva.</li>
    </ul>`,
};
