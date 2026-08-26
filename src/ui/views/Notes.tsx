import type { JSX } from 'preact';
import { hrefFor } from '~/lib/router';
import { storage } from '~/store/storage';

const REPO = 'https://github.com/valeriocolapinto1-cpu/fdi-2026-sapienza-ingegneria-elettronica';

/**
 * Note, privacy e licenza.
 *
 * Una pagina sola al posto di «privacy policy» e «termini di servizio», che
 * qui sarebbero due moduli vuoti: non c'è un servizio da regolare, non c'è
 * un account da chiudere, non c'è un dato da chiedere indietro. Quello che
 * serve davvero è dire con precisione che cosa il sito **non** fa — e da chi
 * non è approvato.
 */
export function Notes(): JSX.Element {
  return (
    <section class="view">
      <p class="eyebrow">Trasparenza</p>
      <h1 class="h">Note, privacy e licenza</h1>
      <p class="lead">
        Che cos'è questo sito, che cosa non è, che cosa salva e a chi appartiene quello che ci
        trovi dentro. In breve: è materiale di studio scritto da uno studente, non tocca nessun
        server e non sa chi sei.
      </p>

      <h2 class="sec">Non è un sito ufficiale</h2>
      <div class="panel narrow">
        <p class="lead">
          È scritto da uno studente per prepararsi, e <b>non è affiliato</b> alla Sapienza, al
          corso di Fondamenti di Informatica o a chi lo tiene: nessuno di loro l'ha commissionato,
          rivisto o approvato, e il fatto che ne parli non implica nessun legame.
        </p>
        <p class="lead" style="margin-top:10px">
          I contenuti vengono da appunti fra studenti, quindi <b>possono contenere errori</b> ed
          essere sorpassati da un cambio di programma. Programma, regole della prova, punteggi e
          date valgono solo se li leggi sulle{' '}
          <a href={hrefFor('ref')}>pagine ufficiali del corso</a>. In caso di differenza, ha
          ragione la pagina ufficiale — sempre.
        </p>
        <p class="lead" style="margin-top:10px">
          Le domande del simulatore sono <b>inventate qui</b>, nello stile della prova: non sono
          e non riproducono testi d'esame reali.
        </p>
      </div>

      <h2 class="sec">Che cosa viene salvato</h2>
      <div class="panel narrow">
        <p class="lead">
          <b>Niente esce da questo browser.</b> Non c'è un server a cui mandare qualcosa: il sito
          è fatto di file statici, e tutto quello che fai — le prove svolte, i voti, le spunte
          della carriera — resta nella memoria locale del browser, sul tuo dispositivo.
        </p>
        <ul class="lead" style="margin:10px 0 0;padding-left:20px">
          <li>Nessun account, nessuna registrazione, nessuna email chiesta.</li>
          <li>
            <b>Nessun cookie</b> e nessuna statistica di traffico: non c'è niente da accettare
            perché non c'è niente che ti segua.
          </li>
          <li>
            Nessun servizio esterno a cui il browser si colleghi mentre navighi: anche i
            caratteri tipografici sono ospitati qui, non presi da un CDN.
          </li>
          <li>
            L'unico spazio usato è il <code>localStorage</code> del browser, per i tuoi
            progressi. Lo svuoti dalle impostazioni del browser, oppure{' '}
            <a href={hrefFor('carriera')}>azzerando la carriera</a>.
          </li>
        </ul>
        {!storage.persistent && (
          <p class="fn" style="margin-top:12px">
            In questo momento l'archiviazione locale non è disponibile (navigazione privata o
            cookie bloccati): il sito funziona lo stesso, ma i progressi si perdono chiudendo la
            scheda.
          </p>
        )}
      </div>

      <h2 class="sec">Testi, figure e diritti</h2>
      <div class="panel narrow">
        <p class="lead">
          Le spiegazioni, le domande e gli esercizi sono <b>scritti da zero</b>. I rimandi tipo
          «Hamacher cap. 8» sono riferimenti bibliografici a capitoli e figure del libro di testo,
          non citazioni del suo contenuto: il libro non è riprodotto qui, né in parte.
        </p>
        <p class="lead" style="margin-top:10px">
          I <b>45 schemi</b> del sito sono <b>disegnati da zero</b> in SVG. Hanno la stessa
          struttura logica delle figure del testo — che è informazione tecnica, non espressione
          protetta — ma nessuna immagine del libro è stata copiata o ripubblicata. Il catalogo
          delle altre figure è un elenco di riferimenti per ritrovarle sul libro, non una loro
          riproduzione.
        </p>
        <p class="lead" style="margin-top:10px">
          Se possiedi diritti su qualcosa che compare qui e ritieni che non debba esserci,{' '}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            aprine una segnalazione
          </a>{' '}
          e la tolgo.
        </p>
      </div>

      <h2 class="sec">Hai trovato un errore?</h2>
      <div class="panel narrow">
        <p class="lead">
          Probabile: è materiale di studio, non un libro. Se una risposta è sbagliata, una
          definizione è imprecisa o uno schema non torna, segnalalo — è il modo in cui questo sito
          migliora.
        </p>
        <div class="btn-row" style="margin-top:14px">
          <a
            class="btn primary"
            href={`${REPO}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Segnala un errore ▶
          </a>
          <a class="btn ghost" href={REPO} target="_blank" rel="noopener noreferrer">
            Il codice sorgente
          </a>
        </div>
        <p class="fn" style="margin-top:12px">
          Il sito è aperto: puoi leggere come è fatto, controllare da dove viene ogni domanda e
          proporre correzioni.
        </p>
      </div>
    </section>
  );
}
