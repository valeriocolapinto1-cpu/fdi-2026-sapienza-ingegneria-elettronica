import type { Topic } from '../types';
import { ovl } from './_ovl';

export const karnaugh: Topic = {
    id: 'karnaugh',
    title: 'Sintesi & mappe di Karnaugh',
    blurb: 'Dalla tabella di verità al circuito minimo. Esce quasi sempre.',
    ref: 'Hamacher — Appendice A',
    trapIds: ['trap-and-assoc'],
    body: `
    <h4>Idea</h4>
    <p>La mappa dispone i mintermini in celle adiacenti secondo il <b>codice Gray</b>: fra due celle vicine cambia <b>una sola variabile</b>. Raggruppando gli <code>1</code> in blocchi di dimensione potenza di 2 si eliminano le variabili che cambiano dentro il gruppo, e restano solo quelle costanti.</p>

    <h4>Come si dispone la mappa</h4>
    <p>L'ordine delle colonne <b>non</b> è 00, 01, 10, 11 ma <b>00, 01, 11, 10</b>: è questa la sequenza in cui cambia un bit alla volta. A 4 variabili si applica lo stesso ordine anche alle righe:</p>
    <pre>        CD
       00  01  11  10
AB 00 | m0  m1  m3  m2
   01 | m4  m5  m7  m6
   11 | m12 m13 m15 m14
   10 | m8  m9  m11 m10</pre>
    <p>Sbagliare l'ordine è l'errore più comune: la mappa smette di essere adiacente e i raggruppamenti risultano invalidi.</p>

    <h4>Regole di raggruppamento</h4>
    <ul>
      <li>I gruppi hanno dimensione 1, 2, 4, 8… mai 3 o 6.</li>
      <li>Si fanno <b>più grandi possibile</b>: un gruppo di 2ᵏ celle elimina k variabili, quindi ogni raddoppio accorcia il termine di un letterale.</li>
      <li>I gruppi possono <b>sovrapporsi</b>: una cella già coperta può entrare in un altro gruppo se questo permette di allargarlo.</li>
      <li>L'adiacenza è <b>circolare</b>: prima e ultima colonna sono vicine, così come prima e ultima riga (wrap-around). I quattro angoli di una mappa a 4 variabili formano un gruppo valido.</li>
      <li>Ogni <code>1</code> deve finire in almeno un gruppo, e non si devono coprire zeri.</li>
    </ul>

    <h4>Implicanti primi ed essenziali</h4>
    <p>Un <b>implicante</b> è un gruppo valido; è <b>primo</b> se non può essere ingrandito ulteriormente. È <b>essenziale</b> se copre almeno un <code>1</code> che nessun altro implicante primo copre: gli essenziali vanno presi per forza. Si completa poi la copertura con il minor numero di implicanti primi rimanenti.</p>

    <h4>Esempio svolto</h4>
    <p>Sia <code>Y(A,B,C) = 1</code> per i mintermini 1, 3, 5, 7 — cioè ogni volta che <code>C = 1</code>, indipendentemente da A e B. Il gruppo di 4 celle elimina due variabili e la SOP minima è semplicemente:</p>
    <pre>Y = C          (1 termine, 1 letterale)</pre>
    <p>Scrivere <code>Y = ${ovl('A')}·C + A·C</code> è <b>corretto ma non minimo</b>: l'assorbimento lo riduce a <code>C</code>, e all'esame la non-minimalità viene penalizzata.</p>

    <h4>Le indifferenze (x)</h4>
    <p>Sono combinazioni che non si presentano mai, o il cui valore d'uscita è irrilevante. Si possono prendere <b>come 1 quando aiutano ad allargare un gruppo</b>, oppure lasciare a 0 quando non servono: si valutano <b>una per una</b>, non tutte insieme, e non vanno mai coperte da sole (un gruppo di sole indifferenze è inutile).</p>

    <h4>POS dalla mappa</h4>
    <p>Raggruppando gli <b>zeri</b> invece degli uni si ottiene ${ovl('Y')}; negando con De Morgan si ricava la forma POS. Talvolta è più corta della SOP: se la mappa ha pochi zeri, conviene provarla.</p>

    <h4>Dal risultato al circuito</h4>
    <p>Ogni termine prodotto diventa una porta AND, la somma finale una porta OR, le variabili negate degli invertitori. Nel disegno <b>scomponi in porte a 2 ingressi</b>: un prodotto di tre letterali si realizza con due AND in cascata.</p>
    <p>Allenati nel Simulatore → drill «Reti combinatorie»: la soluzione mostrata è calcolata da un minimizzatore esatto, quindi è sempre davvero minima.</p>`,
  };
