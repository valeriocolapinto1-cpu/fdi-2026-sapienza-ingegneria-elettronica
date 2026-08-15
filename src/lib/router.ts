import { useEffect, useState } from 'preact/hooks';

/**
 * Router a hash, ~40 righe, nessuna dipendenza.
 *
 * Perché hash e non History API: il sito è servito da GitHub Pages sotto un
 * sotto-path, e un router basato su History richiederebbe il trucco del
 * `404.html` per sopravvivere ai reload sulle route profonde. Con l'hash il
 * server vede sempre `index.html` e il problema non esiste.
 */
export const VIEWS = ['dash', 'study', 'exam', 'tools', 'ref'] as const;
export type ViewId = (typeof VIEWS)[number];

export const DEFAULT_VIEW: ViewId = 'dash';

export type Route = {
  /** Vista attiva. */
  view: ViewId;
  /** Segmento opzionale, es. l'id del modulo in `#/study/mem`. */
  param: string | null;
};

function isViewId(value: string): value is ViewId {
  return (VIEWS as readonly string[]).includes(value);
}

export function parseHash(hash: string): Route {
  // "#/study/mem" → ["study", "mem"]
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const head = segments[0];
  if (head === undefined || !isViewId(head)) {
    return { view: DEFAULT_VIEW, param: null };
  }
  return { view: head, param: segments[1] ?? null };
}

export function hrefFor(view: ViewId, param?: string): string {
  return param ? `#/${view}/${param}` : `#/${view}`;
}

/** Naviga, lasciando che sia l'evento `hashchange` ad aggiornare lo stato. */
export function navigate(view: ViewId, param?: string): void {
  const next = hrefFor(view, param);
  if (window.location.hash === next) return;
  window.location.hash = next;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = (): void => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
