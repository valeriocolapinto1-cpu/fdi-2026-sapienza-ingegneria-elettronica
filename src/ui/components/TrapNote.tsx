import type { JSX } from 'preact';
import type { Trap } from '~/content/types';
import { Rich } from './Rich';

/**
 * Riquadro «trappola». Il badge di stato è deliberato: sono percezioni
 * raccolte dagli studenti, non regole confermate dal docente, e la specifica
 * chiede che questo resti esplicito.
 */
export function TrapNote({ trap }: { trap: Trap }): JSX.Element {
  return (
    <div class="trap">
      <div class="tt">
        <span>Trappola · {trap.title}</span>
        <span class="status">
          {trap.status === 'da-verificare' ? 'da verificare' : 'verificata'}
        </span>
      </div>
      <Rich html={trap.body} />
    </div>
  );
}
