/**
 * Identità del sito, in un posto solo.
 *
 * Erano costanti sparse fra `app.tsx`, `Notes.tsx` e i file statici. Le
 * raccoglie qui perché stanno per cambiare tutte insieme: trasloco
 * dell'hosting, dominio proprio, rinomina del repository. Cambiarle in un
 * punto solo è la differenza fra una modifica e una caccia al refuso.
 */

export const SITE_NAME = 'AE·FIN';

export const SITE_TITLE = 'AE·FIN — Palestra di Architettura degli Elaboratori';

/**
 * Indirizzo pubblico, senza barra finale.
 *
 * Cloudflare Pages, piano gratuito: è l'unico hosting senza costi che consenta
 * l'uso commerciale — il piano Hobby di Vercel vieta esplicitamente AdSense, e
 * i termini di GitHub Pages sulla pubblicità sono una zona grigia.
 *
 * `pages.dev` sta nel Public Suffix List, quindi `aefin.pages.dev` vale come
 * dominio registrabile a sé: `ads.txt` alla sua radice è esattamente dove
 * Google lo cerca, cosa impossibile sotto un sotto-path di `github.io`.
 *
 * Se un giorno serve un dominio proprio, questa riga e un record CNAME sono le
 * uniche due cose da cambiare.
 */
export const SITE_URL = 'https://aefin.pages.dev';

/**
 * Dove il sito abitava prima.
 *
 * Serve a due cose che non si possono derivare da `SITE_URL`: la pagina di
 * rinvio che resta pubblicata là, e il `canonical` che le dice di non
 * competere con il nuovo indirizzo nei risultati di ricerca. Chi ha installato
 * la PWA o messo un segnalibro passa da lì.
 */
export const LEGACY_SITE_URL =
  'https://valeriocolapinto1-cpu.github.io/fdi-2026-sapienza-ingegneria-elettronica';

export const REPO_URL =
  'https://github.com/valeriocolapinto1-cpu/fdi-2026-sapienza-ingegneria-elettronica';

/**
 * Identificativo publisher di AdSense, quello che comincia per `pub-`.
 *
 * **Vuoto finché Google non approva il sito**, e non è un segnaposto da
 * riempire alla svelta: tutto il codice degli annunci lo legge e, se è vuoto,
 * non inietta nulla — niente script, niente riquadri, niente `ads.txt`. Così
 * la parte pubblicitaria può essere scritta e messa in produzione mesi prima
 * di essere accesa, senza che nessuno veda uno spazio vuoto.
 */
export const ADSENSE_CLIENT = '';

/** Vero quando AdSense è stato approvato e la pubblicità può accendersi. */
export const hasAdsense = (): boolean => ADSENSE_CLIENT.startsWith('pub-');

/**
 * Chi risponde del sito.
 *
 * Serve per due ragioni diverse che chiedono la stessa cosa: una segnalazione
 * su un contenuto deve avere un destinatario reale, e — appena il sito
 * mostrerà pubblicità — il GDPR pretende che il titolare del trattamento sia
 * identificabile, con un nome e un recapito.
 *
 * DA RIEMPIRE prima di pubblicare: `email` va creata apposta, non riusata
 * dalla posta personale. Finché è vuota, l'interfaccia mostra le segnalazioni
 * su GitHub e tace sul resto, invece di stampare un segnaposto.
 */
export const OWNER = {
  name: '',
  email: '',
} as const;

/** Vero quando i recapiti del titolare sono stati riempiti. */
export const hasOwnerContact = (): boolean =>
  OWNER.name.trim() !== '' && OWNER.email.trim() !== '';
