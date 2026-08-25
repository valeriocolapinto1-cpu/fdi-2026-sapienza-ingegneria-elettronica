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
              Genera prove nel formato del prof. Napoli — 12 quesiti, voto su 30 con lode — con
              complemento a 2, sintesi di reti combinatorie via Karnaugh e assembly, ogni item
              ancorato a un capitolo di Hamacher.
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
            <p class="hero-card-t">La prova, quesito per quesito</p>
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

      <h2 class="sec">Come è fatto l'esame reale</h2>
      <div class="panel narrow">
        <p class="lead">
          Dal regolamento del docente e dagli appelli 2024–2025: prova scritta in aula,{' '}
          <b>un'ora</b>, solo documento e penna — nessun appunto. La scomposizione dei dodici
          quesiti è quella qui sopra e vale a punteggio uguale: <b>2,5 punti</b> l'uno. Si supera
          con <b>18/30</b>, la lode ai brillanti.
        </p>
        <p class="lead" style="margin-top:10px">
          I due «completare l'immagine» ci sono <b>sempre</b>, e sono schemi delle figure di
          Hamacher: sono la parte che si prepara disegnando, non rileggendo. Qui trovi gli stessi
          schemi <a href={hrefFor('ref')}>ridisegnati</a> e da{' '}
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
        ⚠︎ Strumento di studio non ufficiale, costruito su appunti studenteschi e sul regolamento
        pubblico del docente. Le domande sono nello <em>stile</em> dell'esame ma non sono prove
        reali. Verifica sempre programma e regole aggiornate sul sito del prof. e sul catalogo
        Sapienza. I riferimenti «Hamacher» rimandano ai capitoli/figure del testo — consultalo per
        i contenuti integrali.
      </div>
    </section>
  );
}
