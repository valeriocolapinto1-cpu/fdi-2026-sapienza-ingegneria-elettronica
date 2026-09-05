# Provenienza dei contenuti e revisione di conformità

*Ultima revisione: 5 settembre 2026.*

Questo documento dice **da dove viene** quello che si legge sul sito, con quale criterio è stato
verificato e come si chiede di rimuovere qualcosa. Serve a chi ci studia sopra, a chi possiede
diritti su materiale di questa materia e a chiunque voglia controllare invece di fidarsi.

Non è un disclaimer: un disclaimer dichiara un rischio e lo lascia dov'è. Qui sono scritti i
criteri applicati, cosa è stato tolto e perché.

---

## In una riga

Tutto il contenuto del sito — teoria, domande, definizioni, esercizi, schemi — è **scritto e
disegnato per questo sito**. Non c'è testo copiato, non ci sono immagini riprodotte, non ci sono
prove d'esame reali, e non c'è alcun legame con un corso, un'università o un docente.

---

## Perché questa revisione

Il sito nasce come progetto di studio personale, gratuito. In quella forma si appoggiava, senza
dirselo, all'eccezione dell'**art. 70 della legge 633/1941**, che consente riassunti e
riproduzioni per uso didattico — ma solo *«per finalità illustrative e per fini non
commerciali»*.

Il sito sta per diventare pubblico e finanziato dalla pubblicità. Da quel momento l'uso è
commerciale e quell'eccezione non si applica più: qualsiasi contenuto che vi si appoggiava
andava reso indipendente **prima** di monetizzare, non dopo una contestazione.

La stessa scelta ha risolto un secondo problema, di natura diversa: un sito rivolto a un corso
specifico, con la pubblicità sopra, mette il nome di un'istituzione e di una persona reale
accanto a un'attività economica che non hanno approvato.

---

## Che cosa è stato rimosso, e perché

| Rimosso | Motivo |
|---|---|
| Catalogo di 156 tavole del libro di testo, con numero e descrizione | Era la trascrizione dell'indice delle figure di un'opera altrui: una mappa di quel libro, non contenuto proprio |
| Il campo `ref` con il capitolo del testo su ~280 voci | Legava contenuti originali alla struttura di un'opera altrui; il rimando ora punta al modulo di questo sito che spiega l'argomento |
| Uno schema chiamato «la sveglia su chip», con il timer dei minuti e il timer del tono | Non descriveva un sistema su singolo chip: descriveva **l'esempio scelto da un autore** per spiegarlo. Sostituito da uno schema generico |
| Il collegamento alla pagina personale di un docente e al regolamento del suo esame | Un sito con la pubblicità sopra che rimanda a una persona identificabile la associa a un'attività che non ha approvato |
| Il collegamento a un archivio di prove d'esame reali | Testi di cui il docente detiene i diritti; linkarli da un sito monetizzato significa trarne un beneficio economico |
| Le «trappole del docente», poi «accortezze raccolte dagli studenti» | Affermazioni di terza mano su che cosa una persona reale gradisce o penalizza. Quello che restava di utile era vero da sé, e ora è scritto come fatto sulla notazione |
| L'affermazione che la prova riproducesse il formato di un esame reale | Ricostruzione da appunti mai verificata. Su un sito commerciale un'affermazione del genere non è più solo imprecisa |
| Il nome dell'università da titolo, descrizione, anteprima social e manifest | Il regolamento sul marchio disciplina anche l'uso della denominazione, e la pubblicità rende commerciale l'uso che se ne fa |
| Un file di prototipo che conteneva il cognome di un docente e frasi su cosa gradisce | Non finiva sul sito, ma il repository è pubblico |

---

## Il criterio applicato agli schemi

I 45 schemi sono disegni originali in SVG. Ma «l'ho ridisegnato io» non basta: si può ricalcare
una figura altrui tratto per tratto e chiamarlo disegno proprio. Ciascuno è stato passato al
vaglio di tre domande, e se **una** risposta era «sì» lo schema è stato rifatto:

1. Usa **etichette o sigle prese da un testo** dove esisterebbe un nome comune?
2. Ricalca **l'impaginazione di una tavola precisa**, invece della struttura logica che
   qualunque testo userebbe per quel concetto?
3. Contiene i **valori di un esempio svolto altrui** — numeri, indirizzi, o il dispositivo che
   qualcun altro ha scelto per illustrare il concetto?

Il principio: la struttura di un decodificatore, di una cache a mappatura diretta o di una
pipeline a cinque stadi è **informazione tecnica**. È idea, non espressione, e nessun editore ne
ha il monopolio — se lo avesse, quella materia non si potrebbe insegnare. Ciò che è protetto è
il modo particolare in cui un autore l'ha resa: la sua impaginazione, le sue etichette, i suoi
esempi.

Esito: 43 schemi su 45 sono passati; 1 è stato rifatto (la terza domanda), 1 rinominato (la
prima). Le tre domande sono scritte in testa a `src/content/diagrams.ts`, per chi aggiungerà il
quarantaseiesimo.

---

## I controlli che girano a ogni build

Alcune di queste regole non sono affidate alla buona volontà: sono test, e se falliscono il sito
non viene pubblicato.

- **Ogni voce rimanda a un modulo che esiste.** Ha sostituito il vecchio «ogni voce cita il libro
  di testo». È un controllo più severo: prima bastava che una stringa contenesse una parola,
  adesso il rimando è una destinazione interna e un id sbagliato è un collegamento rotto.
- **Il nome del testo non rientra dalla finestra.** Un test cerca il nome dell'opera in tutti i
  dati dei contenuti e fallisce se lo trova.
- **Le convenzioni di notazione parlano di notazione.** Un test rifiuta le voci che contengono
  «docente», «esame», «gradisce», «penalizza» e simili: un'affermazione su una persona reale non
  passa, con o senza badge «da verificare».

---

## Bibliografia

I libri consigliati sul sito sono un elenco di **letture**, non un rimando a contenuti
riprodotti: citare autore, titolo ed editore in bibliografia è lecito sempre e non dipende da
nessuna eccezione.

---

## Licenza

- **Contenuti** (testi dei moduli, domande, definizioni, esercizi, schemi SVG): © Valerio
  Colapinto. Riproduzione consentita per uso personale di studio; per qualsiasi altro uso,
  chiedere.
- **Codice** (`src/`, configurazione, test): vedi la licenza del repository.

---

## Segnalazioni e rimozione

Se possiedi diritti su qualcosa che compare in questo sito e ritieni che non debba esserci, o se
il sito dice qualcosa di inesatto su una persona, un corso o un'istituzione:

- apri una segnalazione sul repository, oppure scrivi al recapito indicato nella pagina **Note &
  privacy** del sito;
- **il materiale contestato viene rimosso senza discutere**, e la verifica viene fatta dopo;
- non è richiesta una diffida formale, e non serve un avvocato per farsi ascoltare.

Questa procedura vale per il contenuto pubblicato. La cronologia del repository viene ripulita
separatamente quando la rimozione riguarda materiale che non deve restare consultabile.
