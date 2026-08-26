import type { Trap } from './types';

/**
 * Accortezze raccolte dagli appunti degli studenti.
 *
 * **Sono percezioni di chi ha dato l'esame, non regole di nessuno.** Per
 * questo sono scritte all'impersonale e marcate `da-verificare`: attribuirle
 * a una persona significherebbe metterle in bocca a qualcuno che non le ha
 * dette qui, e nessuna di queste è confermata da una fonte del corso.
 *
 * Regola per chi ne aggiunge: descrivi **come conviene rispondere**, mai cosa
 * qualcuno pensa, chiede, sbaglia o preferisce.
 */
export const traps: Trap[] = [
  {
    id: 'trap-and-assoc',
    title: 'AND a più di due ingressi',
    body: 'Nei disegni conviene scomporre le porte AND a 3+ ingressi in porte a 2 ingressi: è la forma che gli appunti riportano come attesa.',
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
    body: 'Conviene usare {∧, ∨} invece di «AND»/«OR» per esteso: è la notazione usata a lezione secondo gli appunti.',
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
    title: 'RTN, forma corretta',
    body: 'Nelle risposte scrivi la notazione per esteso e con le parentesi solo sulle sorgenti: <code>Add R1,R2,R3</code> → <code>R1 ← [R2]+[R3]</code>.',
    status: 'da-verificare',
  },
];
