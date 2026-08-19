import type { JSX } from 'preact';
import { figures, links, traps } from '~/content';
import { diagramById } from '~/content/diagrams';
import { hrefFor } from '~/lib/router';
import { DiagramFigure } from '~/ui/components/DiagramFigure';
import { TrapNote } from '~/ui/components/TrapNote';

export function References(): JSX.Element {
  const drawn = figures.filter((figure) => figure.diagramId);
  const onlyListed = figures.filter((figure) => !figure.diagramId);

  return (
    <section class="view">
      <p class="eyebrow">Cassetta degli attrezzi</p>
      <h1 class="h">Riferimenti &amp; trappole</h1>

      <h2 class="sec">Schemi da saper completare</h2>
      <p class="lead">
        All'esame c'è sempre un «completare l'immagine»: si riceve il disegno con alcune etichette
        mancanti e l'elenco di quelle da collocare. Questi sono ridisegnati: studiali finché li
        rifai a memoria, poi mettiti alla prova.
      </p>
      <div style="margin-top:14px">
        {drawn.map((figure) => {
          const diagram = diagramById(figure.diagramId as string);
          if (!diagram) return null;
          return (
            <div key={figure.id} style="margin-bottom:26px">
              <div class="fn" style="margin-bottom:2px">
                {figure.code} · {figure.desc}
              </div>
              <DiagramFigure diagram={diagram} />
              <a class="btn ghost mini" href={hrefFor('train', diagram.id)}>
                Esercitati a completarlo ▶
              </a>
            </div>
          );
        })}
      </div>

      <h2 class="sec">Altre figure da studiare sul testo</h2>
      <p class="lead">Non ancora ridisegnate qui: guardale su Hamacher.</p>
      <div class="figlist" style="margin-top:14px">
        {onlyListed.map((figure) => (
          <div class="fig" key={figure.id}>
            <div class="fn">{figure.code}</div>
            <div class="fd">{figure.desc}</div>
          </div>
        ))}
      </div>

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
        Fonti: catalogo Sapienza, sito del docente, dispensa studentesca «AE-[FIN]». Contenuti di
        studio riscritti in forma originale; per i testi integrali consulta Hamacher.
      </div>
    </section>
  );
}
