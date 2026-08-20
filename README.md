# AE·FIN — Palestra d'esame

Sito di studio e **generatore di prove d'esame** per il modulo *Architettura degli Elaboratori*
(6 CFU) del corso di Fondamenti di Informatica — Ingegneria Elettronica, Sapienza.

Replica il formato della prova scritta: **12 quesiti, 1 ora, voto su 30 con lode**. Ogni quesito
e ogni scheda di studio riportano il riferimento al testo di Hamacher.

### → **[Apri il sito](https://valeriocolapinto1-cpu.github.io/fdi-2026-sapienza-ingegneria-elettronica/)**

Funziona anche da telefono e, dopo la prima visita, **offline**: si installa come app dal menu
del browser.

> ⚠︎ Strumento di studio **non ufficiale**, costruito su appunti studenteschi e sul regolamento
> pubblico del docente. Le domande sono nello *stile* dell'esame, non sono prove reali. Le
> «trappole» sono percezioni raccolte dagli studenti, marcate come *da verificare*. I contenuti
> sono riscritti in forma originale: i riferimenti a Hamacher sono rimandi al testo, non
> citazioni.

## Cosa c'è dentro

- **Dashboard** — statistiche (esami svolti, miglior voto, media, moduli letti) e avvio rapido.
- **Studia** — 17 moduli in ordine di studio, raggruppati per area. Ognuno ha il ripasso «in due
  minuti», l'indice interno, un **esempio svolto con i numeri**, gli errori tipici, gli schemi
  collegati e tre domande di **autoverifica** con la risposta a scomparsa.
- **Definizioni** — i termini che l'esame chiede di saper enunciare, una frase ciascuno, con
  filtro per testo e per argomento.
- **Simulatore** — quattro formati di prova, generati al volo: numeri, tabelle di verità,
  schemi, snippet e mix di quesiti cambiano a ogni generazione.
- **Allenamento** — quattro palestre che fanno fare il procedimento e correggono ogni passaggio:
  binario a mano, schemi da completare, verità e Karnaugh, assembly da eseguire a mente. In
  fondo restano i convertitori, come banco di verifica.
- **Riferimenti** — gli schemi ridisegnati da saper completare, le trappole, testi e link.

Nessun backend: nessun account, nessun dato inviato da nessuna parte. I progressi restano nel
browser.

## Come aggiungere domande

**Non serve toccare il codice**: i contenuti sono dati, tutti in `src/content/`.

| File | Cosa contiene |
|---|---|
| `mcq.ts` | Crocette, raggruppate per argomento |
| `open.ts` | Domande aperte con risposta modello |
| `asmWrite.ts` | Esercizi «scrivi un programma» |
| `topics/` | Moduli di studio, uno per file; `index.ts` fissa l'ordine e i gruppi |
| `definitions.ts` | I termini da saper enunciare |
| `diagrams.ts` | Schemi ridisegnati, con gli slot da completare |
| `traps.ts` | Trappole del docente |
| `figures.ts` | Figure di Hamacher da saper completare |
| `links.ts` | Testi e risorse |

Un modulo di studio porta con sé, oltre al corpo della teoria: `summary` (il ripasso «in due
minuti»), `checks` (le domande di autoverifica), `prereq` e `diagramIds`. L'indice interno **non**
è un dato: si ricava dai titoli del corpo (`content/outline.ts`), così non può disallinearsi.

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
- **`engine/ieee754.ts`** passa da un `DataView` per codificare, quindi applica lo standard
  esattamente come l'hardware. I quesiti partono dai **campi** e ne ricavano il valore: il
  numero mostrato è rappresentabile per costruzione e nessun arrotondamento può falsare la
  risposta attesa.
- **`store/storage.ts`** è l'unico punto che tocca `localStorage`, con ripiego in memoria se la
  scrittura è vietata.

### Struttura della prova completa

12 quesiti, **30 punti esatti** (verificato dai test su 500 semi):

| Tipo | Quanti | Punti |
|---|---|---|
| Crocette — teoria, complemento a 2, porte logiche, assembly, RTN, IEEE 754, traduzione indirizzi, campi di cache, cicli di pipeline | 4 | 2,5 |
| Completare lo schema | 2 | 2,5 |
| Dalla tabella di verità all'espressione logica | 2 | 2,5 |
| Sintesi con Karnaugh | 1 | 2,5 |
| Domanda aperta | 2 | 2,5 |
| Assembly da scrivere | 1 | 2,5 |

Le quattro crocette sono **estratte senza reinserimento** da un insieme di undici generatori, di
cui tre teorici: ogni prova copre quindi aree distinte, senza concentrarsi su un solo argomento,
e due prove di fila differiscono nel *mix*, non solo nei numeri.

Crocette, risposte brevi, schemi ed espressioni sono **auto-corretti**; Karnaugh, domande aperte
e assembly mostrano una soluzione modello e si autovalutano (pieno / parziale / no).

Due quesiti danno **credito parziale calcolato**: lo schema vale in proporzione alle etichette
azzeccate, e un'espressione corretta ma non minima vale metà. La **lode** richiede il punteggio
pieno.

## Deploy

Automatico: ogni push su `main` fa partire `.github/workflows/deploy.yml`, che esegue i test e
pubblica su GitHub Pages. **Se i test falliscono il sito non viene pubblicato**, quindi una
domanda malformata non arriva mai online.

Il `base` di Vite è il nome del repository (`vite.config.ts`): se rinomini il repo, aggiorna la
costante `REPO` lì.

## Progetto di riferimento

`docs/prototipo.html` è il prototipo monofile da cui nasce questo lavoro: resta nel repo come
baseline di design. L'estetica dell'app è portata da lì; l'architettura, i test e le correzioni
ai generatori no.

## Stack

Vite 7 · Preact 10 · TypeScript (strict) · Tailwind CSS 4 · Vitest · vite-plugin-pwa.
Font self-hostati (`@fontsource`): nessuna chiamata a servizi esterni a runtime.
