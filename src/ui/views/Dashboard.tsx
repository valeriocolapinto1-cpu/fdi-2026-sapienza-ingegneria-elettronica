import type { JSX } from 'preact';
import { topics } from '~/content';
import { hrefFor } from '~/lib/router';
import { computeStats, useProgress } from '~/store/progress';
import { storage } from '~/store/storage';
import { DatapathHero } from '~/ui/components/DatapathHero';
import { TopicCard } from './Study';

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}): JSX.Element {
  return (
    <div class="stat">
      <div class="n">
        {value}
        {unit && <span class="u">{unit}</span>}
      </div>
      <div class="l">{label}</div>
    </div>
  );
}

export function Dashboard(): JSX.Element {
  const progress = useProgress();
  const stats = computeStats(progress);

  return (
    <section class="view">
      <div class="hero">
        <DatapathHero />
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
          label="Moduli letti"
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
      <div class="panel">
        <p class="lead" style="max-width:none">
          Dal regolamento del docente e dagli appelli 2024–2025: prova scritta in aula,{' '}
          <b>1 ora</b>, solo documento e penna — nessun appunto. Dodici quesiti:{' '}
          <b>4 crocette</b>, <b>2 «completare l’immagine»</b> (uno schema con le etichette da
          collocare — ci sono sempre), <b>2 «dalla tabella di verità all’espressione logica»</b>,{' '}
          <b>1 sintesi di rete combinatoria</b> con Karnaugh e disegno del circuito,{' '}
          <b>2 domande aperte</b> e <b>1 programma assembly</b>. Si supera con <b>≥18/30</b>;
          lode ai brillanti. Gli schemi da completare sono quelli delle figure di Hamacher.
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
