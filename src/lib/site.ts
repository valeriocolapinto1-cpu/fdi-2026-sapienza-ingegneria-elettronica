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
 * Oggi è GitHub Pages sotto il path del repository. Diventerà il dominio
 * proprio quando la richiesta a nic.eu.org sarà accolta: da quel momento
 * questa riga e il record DNS sono le uniche due cose da toccare.
 */
export const SITE_URL =
  'https://valeriocolapinto1-cpu.github.io/fdi-2026-sapienza-ingegneria-elettronica';

export const REPO_URL =
  'https://github.com/valeriocolapinto1-cpu/fdi-2026-sapienza-ingegneria-elettronica';

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
