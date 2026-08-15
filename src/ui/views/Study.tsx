import type { JSX } from 'preact';

export function Study(_props: { topicId: string | null }): JSX.Element {
  return (
    <section class="view">
      <p class="eyebrow">Moduli di studio</p>
      <h1 class="h">La teoria, per come la chiede all'esame</h1>
      <p class="lead">In arrivo con M4.</p>
    </section>
  );
}
