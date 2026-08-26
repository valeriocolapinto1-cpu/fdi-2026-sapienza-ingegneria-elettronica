import type { JSX } from 'preact';
import { topics } from '~/content';
import { hrefFor } from '~/lib/router';
import { computeStats, useProgress } from '~/store/progress';
import { storage } from '~/store/storage';
import { DatapathHero } from '~/ui/components/DatapathHero';
import { TopicCard } from './Study';

/**
 * I dodici quesiti della prova reale, nell'ordine in cui escono.
 *
 * Stavano in un paragrafo con dodici grassetti dentro: l'informazione c'era ma
 * andava letta tutta per contare. Qui si conta con l'occhio.
 */
const EXAM_BREAKDOWN = [
  { count: 4, label: 'crocette' },
  { count: 2, label: 'schemi da completare' },
  { count: 2, label: 'tabella di verità → espressione' },
  { count: 1, label: 'sintesi di rete con Karnaugh' },
  { count: 2, label: 'domande aperte' },
  { count: 1, label: 'programma assembly' },
] as const;

/**
 * Riquadro di statistica. Con `href` diventa un collegamento vero: il
 * contatore dei moduli studiati porta alla carriera, che prima era un bottone
 * spaiato su una riga tutta sua.
 */
function Stat({
  value,
  unit,
  label,
  href,
}: {
  value: string;
  unit?: string;
  label: string;
  href?: string;
}): JSX.Element {
  const inner = (
    <>
      <div class={`n${value === '—' ? ' empty' : ''}`}>
        {value}
        {unit && <span class="u">{unit}</span>}
      </div>
      <div class="l">{label}</div>
    </>
  );

  return href ? (
    <a class="stat link" href={href}>
      {inner}
    </a>
  ) : (
    <div class="stat">{inner}</div>
  );
}

export function Dashboard(): JSX.Element {
  const progress = useProgress();
  const stats = computeStats(progress);

  return (
    <section class="view">
      <div class="hero">
        <DatapathHero />
        <div class="hero-grid">
          <div class="hero-body">
            <span class="chip">
              <span class="dot" aria-hidden="true" />
              modulo AE · 6 CFU · prova scritta 1h
            </span>
            <h1 class="h" style="margin-top:14px">
              Allena l'esame,
              <br />
              non solo la teoria.
            </h1>
            <p class="lead">
              Genera prove nel formato della scritta — 12 quesiti, voto su 30 — con complemento
              a 2, sintesi di reti combinatorie via Karnaugh e assembly, ogni item ancorato a un
              capitolo di Hamacher.
            </p>
            <div class="btn-row">
              <a class="btn primary" href={hrefFor('exam', 'full')}>
                ▶ Genera esame completo
              </a>
              <a class="btn ghost" href={hrefFor('study')}>
                Apri i moduli di studio
              </a>
            </div>
          </div>

          <aside class="hero-card">
            <p class="hero-card-t">Il formato che alleni</p>
            <ul class="qbreak">
              {EXAM_BREAKDOWN.map((row) => (
                <li key={row.label}>
                  <span class="qb-n">{row.count}</span>
                  <span>{row.label}</span>
                </li>
              ))}
            </ul>
            <p class="qb-foot">
              <b>12</b> quesiti · <b>1</b> ora · si passa da <b>18/30</b>
              {/* La scomposizione è la cosa più «ufficiale» che il sito mostra,
                  ed è la meno verificata: il chiarimento sta qui, addosso al
                  numero, non tre schermate più in basso. */}
              <span class="qb-warn">ricostruzione da appunti, non una fonte del corso</span>
            </p>
          </aside>
        </div>
      </div>

      <div class="stats">
        <Stat value={String(stats.examsTaken)} label="Esami svolti" />
        <Stat
          value={stats.best === null ? '—' : String(stats.best)}
          unit={stats.best === null ? undefined : '/30'}
          label="Miglior voto"
        />
        <Stat
          value={stats.average === null ? '—' : String(stats.average)}
          unit={stats.average === null ? undefined : '/30'}
          label="Media"
        />
        <Stat
          value={String(stats.studiedCount)}
          unit={`/${topics.length}`}
          label="Moduli studiati ▸"
          href={hrefFor('carriera')}
        />
      </div>

      {!storage.persistent && (
        <div class="disclaim">
          ⚠︎ Lo spazio di archiviazione del browser non è disponibile (navigazione privata o
          cookie bloccati): l'app funziona, ma statistiche e progressi non sopravvivono alla
          chiusura della scheda.
        </div>
      )}

      <h2 class="sec">Come dovrebbe essere fatta la prova</h2>
      <div class="panel narrow">
        <p class="lead">
          <b>Attenzione a come leggi questa pagina.</b> Quella qui sopra è una{' '}
          <b>ricostruzione</b> messa insieme da appunti di studenti: non viene da una fonte del
          corso e nessuno l'ha confermata. Serve ad allenarsi su un formato plausibile, non a
          sapere che cosa troverai davvero sul foglio.
        </p>
        <p class="lead" style="margin-top:10px">
          Secondo quegli appunti la prova è scritta, dura <b>un'ora</b> e non ammette materiale
          di consultazione. I <b>2,5 punti</b> per quesito sono invece una scelta{' '}
          <em>di questo sito</em>: i pesi reali non li conosciamo, e dividere trenta per dodici
          era l'ipotesi più onesta.{' '}
          <a href={hrefFor('ref')}>Le regole vere stanno sulla pagina del corso</a>: prima
          dell'appello controlla lì, e se dice altro vale quello che dice lei.
        </p>
        <p class="lead" style="margin-top:10px">
          Gli schemi da completare sono figure del tipo di quelle di Hamacher: è la parte che si
          prepara disegnando, non rileggendo. Qui li trovi{' '}
          <a href={hrefFor('ref')}>ridisegnati da zero</a> e da{' '}
          <a href={hrefFor('train')}>completare a vuoto</a>.
        </p>
      </div>

      <h2 class="sec">Riprendi da dove eri</h2>
      <div class="cards">
        {topics.slice(0, 4).map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} index={index} />
        ))}
      </div>

      <div class="disclaim">
        ⚠︎ <b>Strumento di studio non ufficiale</b>, scritto da uno studente e{' '}
        <b>non affiliato alla Sapienza</b>, al corso o a chi lo tiene: nessuno di loro l'ha
        rivisto o approvato. È costruito su appunti fra studenti, quindi può contenere errori e
        parti sorpassate — programma, regole e date valgono solo se le leggi{' '}
        <a href={hrefFor('ref')}>sulle pagine ufficiali del corso</a>.
        <br />
        Le domande sono <b>inventate qui</b>, nello <em>stile</em> della prova: non sono, e non
        riproducono, prove d'esame reali. I riferimenti «Hamacher» sono rimandi a capitoli e
        figure del testo, non citazioni: gli schemi del sito sono ridisegnati da zero. Per i
        contenuti, il libro.
        <br />
        Nessun account e nessun server: quello che fai resta nel tuo browser e non viene inviato
        a nessuno.
      </div>
    </section>
  );
}
