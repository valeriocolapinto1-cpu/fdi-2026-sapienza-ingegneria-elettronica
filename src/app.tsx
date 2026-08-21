import type { JSX } from 'preact';
import { hrefFor, useRoute, VIEWS, type ViewId } from '~/lib/router';
import { t } from '~/lib/i18n';
import { Dashboard } from '~/ui/views/Dashboard';
import { Study } from '~/ui/views/Study';
import { Simulator } from '~/ui/views/Simulator';
import { Definitions } from '~/ui/views/Definitions';
import { Training } from '~/ui/views/Training';
import { References } from '~/ui/views/References';
import { Career } from '~/ui/views/Career';

const TAB_LABELS: Record<ViewId, string> = {
  dash: 'Dashboard',
  study: 'Studia',
  def: 'Definizioni',
  exam: 'Simulatore',
  train: 'Allenamento',
  ref: 'Riferimenti',
  carriera: 'Carriera',
};

function Header({ active }: { active: ViewId }): JSX.Element {
  return (
    <header class="top">
      <div class="top-inner">
        <div class="brand">
          <span class="glyph" aria-hidden="true">
            AE
          </span>
          <span>
            Palestra d'esame
            <small>Architettura degli Elaboratori</small>
          </span>
        </div>
        <nav class="tabs" aria-label={t('Sezioni del sito')}>
          {VIEWS.map((view) => (
            <a
              key={view}
              class={`tab${view === active ? ' active' : ''}`}
              href={hrefFor(view)}
              aria-current={view === active ? 'page' : undefined}
            >
              {TAB_LABELS[view]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function App(): JSX.Element {
  const route = useRoute();

  return (
    <>
      <Header active={route.view} />
      <main class="shell-main">
        {route.view === 'dash' && <Dashboard />}
        {route.view === 'study' && <Study topicId={route.param} />}
        {route.view === 'exam' && <Simulator mode={route.param} />}
        {route.view === 'def' && <Definitions />}
        {route.view === 'train' && <Training focus={route.param} />}
        {route.view === 'ref' && <References />}
        {route.view === 'carriera' && <Career />}
      </main>
      <footer class="site-footer">
        AE·FIN — palestra d'esame · costruito per lo studio personale · non affiliato alla
        Sapienza
      </footer>
    </>
  );
}
