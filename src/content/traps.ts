import type { Trap } from './types';

/**
 * Le «trappole» del docente, raccolte dagli appunti studenteschi.
 *
 * Sono marcate `da-verificare` di proposito: sono percezioni utili in fase di
 * preparazione, non regole confermate. La UI le mostra con il badge relativo.
 */
export const traps: Trap[] = [
  {
    id: 'trap-and-assoc',
    title: 'AND «non associativo»',
    body: 'Evita porte AND a 3+ ingressi nei disegni: scomponi in porte a 2 ingressi. Secondo gli appunti considera associativi solo OR e NOR.',
    status: 'da-verificare',
  },
  {
    id: 'trap-ram',
    title: 'RAM ≠ «accesso casuale»',
    body: 'Non tradurre la sigla: spiega che <b>il tempo di accesso al dato non dipende dalla sua posizione</b> in memoria.',
    status: 'da-verificare',
  },
  {
    id: 'trap-simboli',
    title: 'Simboli logici',
    body: 'Usa {∧, ∨} nelle risposte: nei quesiti non scrive «AND»/«OR» per esteso.',
    status: 'da-verificare',
  },
  {
    id: 'trap-demorgan',
    title: 'De Morgan esteso',
    body: 'Ricorda che vale anche per più di due fattori.',
    status: 'da-verificare',
  },
  {
    id: 'trap-rtn',
    title: 'RTN richiesto',
    body: 'Alcune risposte pronte dei quiz erano errate: scrivi tu la forma corretta, es. <code>Add R1,R2,R3</code> → <code>R1 ← [R2]+[R3]</code>.',
    status: 'da-verificare',
  },
];
