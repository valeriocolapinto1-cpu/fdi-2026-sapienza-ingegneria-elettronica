import type { JSX } from 'preact';

export function Simulator(_props: { mode: string | null }): JSX.Element {
  return (
    <section class="view">
      <p class="eyebrow">Simulatore</p>
      <h1 class="h">Genera una prova</h1>
      <p class="lead">In arrivo con M4.</p>
    </section>
  );
}
