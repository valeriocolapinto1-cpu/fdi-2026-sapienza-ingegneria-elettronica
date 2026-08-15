import type { JSX } from 'preact';
import { figures, links, traps } from '~/content';
import { TrapNote } from '~/ui/components/TrapNote';

export function References(): JSX.Element {
  return (
    <section class="view">
      <p class="eyebrow">Cassetta degli attrezzi</p>
      <h1 class="h">Riferimenti &amp; trappole</h1>

      <h2 class="sec">Figure Hamacher da saper completare</h2>
      <p class="lead">
        Uscite negli appelli recenti come «completa lo schema». Studiale finché le disegni a
        memoria.
      </p>
      <div class="figlist" style="margin-top:14px">
        {figures.map((figure) => (
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
