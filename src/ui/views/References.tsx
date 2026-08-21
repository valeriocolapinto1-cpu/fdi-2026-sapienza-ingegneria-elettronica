import type { JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { figures, links, traps } from '~/content';
import { FIGURE_AREAS } from '~/content/figures';
import { diagramById } from '~/content/diagrams';
import type { Figure } from '~/content/types';
import { hrefFor } from '~/lib/router';
import { DiagramFigure } from '~/ui/components/DiagramFigure';
import { TrapNote } from '~/ui/components/TrapNote';

/** Una figura del catalogo: schema ridisegnato se c'è, altrimenti solo la voce. */
function FigureEntry({ figure }: { figure: Figure }): JSX.Element {
  const diagram = figure.diagramId ? diagramById(figure.diagramId) : undefined;

  if (!diagram) {
    return (
      <div class="fig">
        <div class="fn">{figure.code}</div>
        <div class="fd">{figure.desc}</div>
      </div>
    );
  }

  return (
    <div class="figdraw">
      <div class="fn" style="margin-bottom:2px">
        {figure.code} · {figure.desc}
      </div>
      <DiagramFigure diagram={diagram} />
      <a class="btn ghost mini" href={hrefFor('train', diagram.id)}>
        Esercitati a completarlo ▶
      </a>
    </div>
  );
}

export function References(): JSX.Element {
  const [area, setArea] = useState<string | 'tutte'>('tutte');
  const [soloSchemi, setSoloSchemi] = useState(false);

  const shown = useMemo(
    () =>
      figures
        .filter((figure) => (area === 'tutte' ? true : figure.area === area))
        .filter((figure) => (soloSchemi ? Boolean(figure.diagramId) : true)),
    [area, soloSchemi],
  );

  const drawn = figures.filter((figure) => figure.diagramId).length;
  const areas = useMemo(
    () => FIGURE_AREAS.filter((name) => shown.some((figure) => figure.area === name)),
    [shown],
  );

  return (
    <section class="view">
      <p class="eyebrow">Cassetta degli attrezzi</p>
      <h1 class="h">Riferimenti &amp; trappole</h1>
      <p class="lead">
        Il catalogo completo delle figure del testo — <b>{figures.length} tavole</b>, capitolo per
        capitolo — con <b>{drawn} schemi ridisegnati</b> su cui esercitarsi. All'esame c'è sempre un
        «completare l'immagine»: si riceve il disegno con alcune etichette mancanti e l'elenco di
        quelle da collocare, con qualche etichetta in più che non va da nessuna parte.
      </p>

      <div class="panel" style="margin-top:14px">
        <div class="def-filters" role="group" aria-label="Filtra per capitolo">
          <button
            type="button"
            class={`def-chip${area === 'tutte' ? ' on' : ''}`}
            aria-pressed={area === 'tutte'}
            onClick={() => setArea('tutte')}
          >
            Tutti i capitoli
          </button>
          {FIGURE_AREAS.map((name) => (
            <button
              key={name}
              type="button"
              class={`def-chip${area === name ? ' on' : ''}`}
              aria-pressed={area === name}
              onClick={() => setArea(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div class="def-filters" style="margin-top:10px">
          <button
            type="button"
            class={`def-chip${soloSchemi ? ' on' : ''}`}
            aria-pressed={soloSchemi}
            onClick={() => setSoloSchemi((on) => !on)}
          >
            {soloSchemi ? '✓ Solo schemi da completare' : 'Solo schemi da completare'}
          </button>
        </div>
      </div>

      <p class="fn" style="margin-top:14px" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'figura' : 'figure'} ·{' '}
        {shown.filter((figure) => figure.diagramId).length} ridisegnate
      </p>

      {areas.map((name) => {
        const inArea = shown.filter((figure) => figure.area === name);
        const disegnate = inArea.filter((figure) => figure.diagramId);
        const elencate = inArea.filter((figure) => !figure.diagramId);
        return (
          <div key={name}>
            <h2 class="sec">{name}</h2>
            {disegnate.map((figure) => (
              <FigureEntry key={figure.id} figure={figure} />
            ))}
            {elencate.length > 0 && (
              <div class="figlist" style="margin-top:12px">
                {elencate.map((figure) => (
                  <FigureEntry key={figure.id} figure={figure} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <h2 class="sec">Le «trappole» del docente</h2>
      <p class="lead">
        Percezioni raccolte dagli studenti — da verificare a lezione, ma utili in fase di
        preparazione.
      </p>
      <div>
        {traps.map((trap) => (
          <TrapNote key={trap.id} trap={trap} />
        ))}
      </div>

      <h2 class="sec">Testi &amp; risorse</h2>
      <div class="panel">
        <ul class="linklist">
          {links.map((link) => (
            <li key={link.id}>
              {link.url ? (
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <span>
                  <b>{link.label}</b>
                </span>
              )}
              <span class="d">{link.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div class="disclaim">
        Le tavole del testo non sono riprodotte: gli schemi di questa pagina sono <b>ridisegnati in
        forma originale</b>, con la stessa struttura logica. Per le figure integrali, e per quelle
        qui solo elencate, consulta Hamacher.
      </div>
    </section>
  );
}
