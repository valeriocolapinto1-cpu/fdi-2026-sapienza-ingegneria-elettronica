import type { JSX } from 'preact';
import { DatapathHero } from '~/ui/components/DatapathHero';
import { hrefFor } from '~/lib/router';

export function Dashboard(): JSX.Element {
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

      <h2 class="sec">Come è fatto l'esame reale</h2>
      <div class="panel">
        <p class="lead" style="max-width:none">
          Dal regolamento del docente e dagli appelli 2024–2025: prova scritta in aula,{' '}
          <b>1 ora</b>, solo documento e penna — nessun appunto. Struttura tipica:{' '}
          <b>~9 crocette</b> (teoria, complemento a 2, riconoscimento porte, snippet assembly),{' '}
          <b>1 sintesi di rete combinatoria</b> con Karnaugh + disegno del circuito,{' '}
          <b>1 esercizio assembly</b>, <b>1 domanda aperta</b>. Si supera con <b>≥18/30</b>; lode
          ai brillanti. Le figure da completare provengono dalle tavole di Hamacher.
        </p>
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
