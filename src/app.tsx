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
          <span class="brand-name">
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

/**
 * Chiusura del sito. Porta la mappa completa perché ogni vista è lunga: da
 * fondo modulo si riparte da qui invece di risalire fino alla barra in cima.
 */
function Footer(): JSX.Element {
  return (
    <footer class="site-footer">
      <div class="foot-inner">
        {/*
          La riserva sta qui e non solo in home: al Simulatore ci si arriva
          per collegamento diretto, e chi entra da lì non vedrebbe mai
          scritto che le domande non sono prove vere.
        */}
        <p class="foot-note" style="margin:0">
          AE·FIN — palestra d'esame · strumento <b>non ufficiale</b> scritto da uno studente,
          non affiliato alla Sapienza né al corso · le domande sono inventate, non sono prove
          d'esame reali · nessun dato esce dal tuo browser
        </p>
        <nav class="foot-nav" aria-label={t('Mappa del sito')}>
          {VIEWS.map((view) => (
            <a key={view} href={hrefFor(view)}>
              {TAB_LABELS[view]}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function App(): JSX.Element {
  const route = useRoute();

  return (
    <>
      {/* Il router vive nell'hash: un `href="#contenuto"` cambierebbe rotta
          invece di saltare, quindi il salto lo facciamo a mano. */}
      <a
        class="skip"
        href="#contenuto"
        onClick={(event) => {
          event.preventDefault();
          const target = document.getElementById('contenuto');
          target?.focus({ preventScroll: true });
          target?.scrollIntoView({ block: 'start' });
        }}
      >
        Salta al contenuto
      </a>
      <Header active={route.view} />
      <main class="shell-main" id="contenuto" tabIndex={-1}>
        {route.view === 'dash' && <Dashboard />}
        {route.view === 'study' && <Study topicId={route.param} />}
        {route.view === 'exam' && <Simulator mode={route.param} />}
        {route.view === 'def' && <Definitions />}
        {route.view === 'train' && <Training focus={route.param} />}
        {route.view === 'ref' && <References />}
        {route.view === 'carriera' && <Career />}
      </main>
      <Footer />
    </>
  );
}
