import type { JSX } from 'preact';
import type { Diagram } from '~/content/diagrams';

/** Freccia condivisa: definita una volta qui, richiamata dagli SVG dei dati. */
export function ArrowDefs(): JSX.Element {
  return (
    <defs>
      <marker
        id="aefin-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill="var(--color-line)" />
      </marker>
    </defs>
  );
}

/** Posizione percentuale di uno slot dentro il viewBox. */
export function slotStyle(x: number, y: number, w: number, h: number): string {
  return `left:${(x / w) * 100}%;top:${(y / h) * 100}%`;
}

/** Lo schema con tutte le etichette al loro posto: serve da figura di studio. */
export function DiagramFigure({ diagram }: { diagram: Diagram }): JSX.Element {
  return (
    <figure class="dg" style="margin-left:0;margin-right:0">
      <svg
        class="dg-svg"
        viewBox={`0 0 ${diagram.width} ${diagram.height}`}
        role="img"
        aria-label={diagram.title}
      >
        <ArrowDefs />
        <g dangerouslySetInnerHTML={{ __html: diagram.svg }} />
      </svg>
      {diagram.slots.map((slot) => (
        <span
          key={slot.id}
          class="dg-slot"
          style={slotStyle(slot.x, slot.y, diagram.width, diagram.height)}
        >
          <span class="dg-label">{slot.label}</span>
        </span>
      ))}
      <figcaption class="dg-caption">
        {diagram.title} · {diagram.ref}
      </figcaption>
    </figure>
  );
}
