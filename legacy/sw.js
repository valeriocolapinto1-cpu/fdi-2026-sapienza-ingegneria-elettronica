/*
 * Service worker di congedo.
 *
 * Il sito ha traslocato, ma chi lo aveva installato come app o visitato prima
 * del trasloco ha in pancia un service worker che serve la vecchia versione
 * **dalla cache** — e un service worker non scade: senza questo file
 * continuerebbe a mostrare l'app vecchia all'infinito, offline e online, senza
 * mai accorgersi che il sito si è spostato. È il modo più comune di lasciare
 * indietro degli utenti in un trasloco.
 *
 * Questo file prende il posto del vecchio `sw.js` allo stesso indirizzo. I
 * browser non mettono mai in cache a lungo il file del service worker proprio
 * per permettere questa manovra: al primo controllo lo trovano cambiato, lo
 * installano, e lui smonta tutto.
 *
 * Ordine dei passaggi, che conta: prima si svuotano le cache, poi ci si
 * disinstalla, e solo alla fine si ricaricano le finestre aperte — che a quel
 * punto vanno in rete per forza e trovano la pagina di rinvio.
 */

self.addEventListener('install', () => {
  // Niente attesa: non c'è niente da preparare, e ogni ciclo in più è una
  // visita in cui l'utente vede ancora il sito vecchio.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      await self.registration.unregister();

      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) {
        // `navigate` invece di un semplice reload: la scheda potrebbe essere
        // ferma su una rotta profonda, e va comunque riportata in rete.
        client.navigate(client.url);
      }
    })(),
  );
});

/*
 * Nessun `fetch` handler, ed è deliberato: da questo momento ogni richiesta
 * passa in rete come se il service worker non ci fosse. Aggiungerne uno
 * significherebbe restare in mezzo proprio mentre stiamo cercando di toglierci
 * di mezzo.
 */
