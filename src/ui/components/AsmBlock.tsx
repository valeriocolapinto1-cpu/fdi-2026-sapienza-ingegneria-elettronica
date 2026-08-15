import type { JSX } from 'preact';
import type { AsmLine } from '~/engine/types';

/**
 * Listato assembly. Le righe arrivano già strutturate dal motore
 * (etichetta / istruzione / commento): qui si decide solo come colorarle,
 * senza che la UI debba interpretare il codice.
 */
export function AsmBlock({ lines }: { lines: AsmLine[] }): JSX.Element {
  return (
    <pre>
      {lines.map((line, index) => (
        <span key={index}>
          {line.label ? <span class="lb">{line.label.padEnd(6)}</span> : '      '}
          {line.text}
          {line.comment ? <span class="cm">{`  ${line.comment}`}</span> : null}
          {index < lines.length - 1 ? '\n' : ''}
        </span>
      ))}
    </pre>
  );
}
