# AE·FIN — Palestra d'esame

Sito di studio e **generatore di prove d'esame** per il modulo *Architettura degli Elaboratori*
(6 CFU) del corso di Fondamenti di Informatica — Ingegneria Elettronica, Sapienza.

Replica il formato della prova scritta: **12 quesiti, 1 ora, voto su 30 con lode**. Ogni quesito
e ogni scheda di studio riportano il riferimento al testo di Hamacher.

> ⚠︎ Strumento di studio **non ufficiale**, costruito su appunti studenteschi e sul regolamento
> pubblico del docente. Le domande sono nello *stile* dell'esame, non sono prove reali. Le
> «trappole» sono percezioni raccolte dagli studenti, marcate come *da verificare*. I contenuti
> sono riscritti in forma originale: i riferimenti a Hamacher sono rimandi al testo, non
> citazioni.

## Cosa c'è dentro

- **Dashboard** — statistiche (esami svolti, miglior voto, media, moduli letti) e avvio rapido.
- **Studia** — 9 moduli di teoria con citazioni Hamacher e trappole del docente.
- **Simulatore** — quattro formati di prova, generati al volo: numeri, tabelle di verità e
  snippet cambiano a ogni generazione.
- **Strumenti** — convertitore decimale ↔ complemento a 2 ↔ esadecimale, sommatore binario con
  flag di overflow **e** riporto uscente, calcolatore di range.
- **Riferimenti** — indice delle figure da saper completare, trappole, testi e link.

Funziona offline (PWA) e senza backend: nessun account, nessun dato inviato da nessuna parte.

## Sviluppo in locale

Serve Node 22 o superiore.

```bash
npm install
npm run dev        # http://localhost:5173/fdi-2026-sapienza-ingegneria-elettronica/
```

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo con ricarica a caldo |
| `npm test` | Test del motore d'esame (Vitest) |
| `npm run test:watch` | Test in watch mode |
| `npm run typecheck` | Solo controllo dei tipi |
| `npm run build` | Typecheck + build statica in `dist/` |
| `npm run preview` | Serve la build come in produzione |

> Il server di sviluppo ascolta sotto `/fdi-2026-sapienza-ingegneria-elettronica/`, lo stesso
> `base` della produzione: così dev, preview e sito pubblicato si comportano allo stesso modo.

## Come aggiungere domande

**Non serve toccare il codice**: i contenuti sono dati, tutti in `src/content/`.

| File | Cosa contiene |
|---|---|
| `mcq.ts` | Crocette, raggruppate per argomento |
| `open.ts` | Domande aperte con risposta modello |
| `asmWrite.ts` | Esercizi «scrivi un programma» |
| `topics.ts` | Moduli di studio |
| `traps.ts` | Trappole del docente |
| `figures.ts` | Figure di Hamacher da saper completare |
| `links.ts` | Testi e risorse |

### Una crocetta

Aggiungi una voce nella sezione dell'argomento giusto in `src/content/mcq.ts`:

```ts
{
  id: 'mcq-mem-12',            // deve essere unico
  topic: 'mem',                // uno dei TopicId in types.ts
  q: 'Che cos’è il <b>write-back</b> in una cache?',
  options: [                   // esattamente 4, tutte diverse
    'La scrittura va subito in memoria principale',
    'Il blocco modificato è riscritto solo quando viene sostituito',
    'La cache viene svuotata a ogni miss',
    'Un algoritmo di sostituzione',
  ],
  correct: 1,                  // indice (0-based) della risposta esatta
  ref: 'Hamacher cap. 8',      // obbligatorio
}
```

L'ordine in cui scrivi le alternative non conta: il motore le rimescola a ogni generazione.

### Una domanda aperta

In `src/content/open.ts`, con `model` che elenca i punti che l'esame vuole sentire:

```ts
{
  id: 'open-pipe-02',
  topic: 'pipe',
  q: 'Che cos’è un hazard di controllo e come si mitiga?',
  model: 'Un salto rende incerta l’istruzione da prelevare…',
  ref: 'Hamacher cap. 6',
}
```

### Verificare quello che hai scritto

```bash
npm test
```

`validateContent()` controlla id univoci, presenza del riferimento Hamacher, 4 alternative
distinte per crocetta e trappole collegate esistenti. Se sbagli qualcosa, il test dice
esattamente quale voce e perché. In sviluppo gli stessi controlli girano al caricamento e
stampano un avviso in console.

## Architettura

Tre livelli separati in modo netto:

```
src/content/   dati puri: nessun import dal motore, nessun accesso al DOM
src/engine/    generatori, costruttore d'esame, correttore: funzioni pure, testabili
src/ui/        componenti: consumano motore e contenuti, nessuna logica di dominio
```

Il motore è **seedabile**: `buildExam('full', 42)` produce sempre la stessa prova, il che rende i
test riproducibili e permetterà di salvare e rigiocare un esame.

Punti notevoli:

- **`engine/boolean.ts`** contiene un minimizzatore booleano **esatto**. Il quesito di Karnaugh
  non mostra la SOP da cui è partito: la ricalcola, così la soluzione modello è minima per
  costruzione, indifferenze comprese. La minimalità è verificata dai test contro una forza bruta
  indipendente su tutte le 256 funzioni a 3 variabili e su un campione a 4.
- **`engine/asmSim.ts`** esegue davvero i tre template assembly: la risposta esatta non è mai
  scritta a mano. Un test rilegge i parametri dal listato mostrato e ri-esegue il programma.
- **`engine/numeric.ts`** tiene `overflow` e `carryOut` **separati**: sono cose diverse e
  confonderle è una classica perdita di punti.
- **`store/storage.ts`** è l'unico punto che tocca `localStorage`, con ripiego in memoria se la
  scrittura è vietata.

### Struttura della prova completa

12 quesiti, **30 punti esatti** (verificato dai test su 500 semi):

| Tipo | Quanti | Punti |
|---|---|---|
| Crocette di teoria | 6 | 2 |
| Complemento a 2, riconoscimento porta, snippet assembly | 3 | 2 |
| Sintesi con Karnaugh | 1 | 5 |
| Assembly da scrivere | 1 | 4 |
| Domanda aperta | 1 | 3 |

Crocette e risposte brevi sono auto-corrette; Karnaugh, assembly e domanda aperta mostrano una
soluzione modello e si autovalutano (pieno / parziale / no). La **lode** richiede il punteggio
pieno.

## Deploy

Ogni push su `main` fa partire `.github/workflows/deploy.yml`: installa, esegue i test, builda e
pubblica su GitHub Pages. Se i test falliscono, il sito non viene pubblicato.

**Passo manuale, una volta sola:** in *Settings → Pages*, imposta **Source: GitHub Actions**.
Senza questo il workflow fallisce in fase di deploy.

Il `base` di Vite è il nome del repository (`vite.config.ts`). Se rinomini il repo, aggiorna la
costante `REPO` lì.

## Progetto di riferimento

`docs/prototipo.html` è il prototipo monofile da cui nasce questo lavoro: resta nel repo come
baseline di design. L'estetica dell'app è portata da lì; l'architettura, i test e le correzioni
ai generatori no.

## Stack

Vite 7 · Preact 10 · TypeScript (strict) · Tailwind CSS 4 · Vitest · vite-plugin-pwa.
Font self-hostati (`@fontsource`): nessuna chiamata a servizi esterni a runtime.
