import type { JSX } from 'preact';
import type { Trap } from '~/content/types';
import { Rich } from './Rich';

/**
 * Riquadro «accortezza». Il badge di stato è deliberato: sono impressioni
 * raccolte fra studenti, non regole di nessuno, e questo deve restare
 * esplicito ovunque compaiano.
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
