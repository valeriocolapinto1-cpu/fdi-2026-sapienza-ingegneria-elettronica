import type { Topic } from '../types';
import { ovl } from './_ovl';

export const karnaugh: Topic = {
    id: 'karnaugh',
    title: 'Sintesi & mappe di Karnaugh',
    blurb: 'Dalla tabella di verità al circuito minimo. Esce quasi sempre.',
    ref: 'Hamacher — Appendice A',
    trapIds: ['trap-and-assoc'],
    prereq: ['bool'],
    summary: [
      'Le colonne vanno in ordine <b>Gray</b> — 00, 01, 11, 10 — perché fra celle vicine deve cambiare un solo bit. Sbagliare l\'ordine invalida tutti i raggruppamenti.',
      'Gruppi di 1, 2, 4, 8 celle: <b>mai 3</b>. Ogni raddoppio elimina una variabile, quindi accorcia il termine di un letterale.',
      'Gruppi il più grandi possibile, <b>sovrapponibili</b>, con adiacenza <b>circolare</b>: bordi opposti e i quattro angoli sono vicini.',
      'Implicante <b>primo</b> = gruppo non allargabile. <b>Essenziale</b> = copre un 1 che nessun altro primo copre: quelli vanno presi per forza.',
      'Le <b>indifferenze</b> si prendono a 1 solo se allargano un gruppo, valutandole una per una.',
    ],
    checks: [
      {
        q: 'Perché un gruppo di 3 celle non è valido?',
        a: 'Perché la semplificazione funziona solo se il gruppo è un sottocubo di 2ᵏ celle: allora esattamente k variabili cambiano e spariscono. Con 3 celle non esiste nessuna variabile che cambi in tutte le combinazioni, quindi il termine non si semplifica.',
      },
      {
        q: 'Che differenza c\'è fra una SOP corretta e una SOP minima?',
        a: 'Corretta = copre esattamente gli stessi mintermini della funzione. Minima = lo fa con il minor numero di termini e, a parità, di letterali. All\'esame una risposta corretta ma non minima perde punti.',
      },
      {
        q: 'Quando conviene raggruppare gli zeri invece degli uni?',
        a: 'Quando gli zeri sono pochi: raggruppandoli si ottiene la SOP di Ȳ e, negando con De Morgan, una POS spesso più corta della SOP.',
      },
    ],
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
    <p>Allenati nel Simulatore → drill «Reti combinatorie»: la soluzione mostrata è calcolata da un minimizzatore esatto, quindi è sempre davvero minima.</p>
    <h4>Errori tipici</h4>
    <ul>
      <li>Scrivere le colonne in ordine 00, 01, 10, 11: la mappa perde l'adiacenza e <b>tutti</b> i raggruppamenti diventano sbagliati.</li>
      <li>Fermarsi a una copertura corretta ma non minima, per non aver visto un gruppo più grande o l'adiacenza ai bordi.</li>
      <li>Coprire un gruppo di sole indifferenze: non serve a nulla, perché nessun 1 viene coperto.</li>
      <li>Dimenticare gli implicanti <b>essenziali</b>: vanno presi per primi, e spesso da soli chiudono quasi tutta la copertura.</li>
    </ul>`,
  };
