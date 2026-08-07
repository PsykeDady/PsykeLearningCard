# PsykeLearningCards

Web app di **flashcard** per studiare e ripassare: si sceglie una materia, si scorrono le domande in ordine casuale, si gira la carta per vedere la risposta e si segna se la si sapeva o no. A fine sessione un riepilogo mostra risposte esatte, sbagliate e l'elenco delle domande da rivedere.

Le domande sono file JSON versionati in questo repository: **chiunque può proporne di nuove o correggerne di esistenti** (vedi [Contribuire alle domande](#contribuire-alle-domande)).

## Deploy

L'app è pubblicata su **[psykelearningcards.surge.sh](https://psykelearningcards.surge.sh)**.

Il deploy è statico su [surge.sh](https://surge.sh):

```bash
npm run build                                   # genera dist/
npx surge dist psykelearningcards.surge.sh      # pubblica
```

> L'app usa il routing HTML5 (`/learning/:materia`): perché i link diretti funzionino, su surge serve una copia di `dist/index.html` chiamata `dist/200.html`, che surge usa come fallback per tutte le rotte.

## Sviluppo in locale

Progetto React 19 + Vite, con Bootstrap 5, Redux Toolkit, React Router e KaTeX.

```bash
npm install
npm start          # dev server su http://localhost:5173
npm test           # test con vitest
npm run build      # build di produzione in dist/
```

Script di supporto:

| Comando | Cosa fa |
| --- | --- |
| `node scripts/check-formulas.mjs` | Valida con KaTeX tutte le formule `$...$` / `$$...$$` presenti nei JSON delle materie |
| `npm run import:oral-index` | Importa/aggiorna le materie a partire da un indice esterno di argomenti d'orale |

## Dove si trovano le domande

Tutto il contenuto sta sotto `public/assets/`:

```
public/assets/
├── subjects.json                 # indice di tutte le materie
└── subjects/
    └── <istituto>/
        └── <categoria>/
            └── <materia>.json    # le domande di quella materia
```

### Struttura gerarchica

La navigazione dell'app segue tre livelli, gli stessi delle cartelle:

**Istituto → Categoria (corso di laurea) → Materia → Domande**

Esempio:

```
Unical  →  LM Ingegneria Informatica  →  Data Mining  →  domande
```

corrisponde al file `public/assets/subjects/unical/lm-ingegneria-informatica/data-mining.json`.

### `subjects.json` — l'indice

Ogni materia va dichiarata qui, altrimenti non compare nell'app:

```json
{
  "institute": "Unical",
  "category": "LM Ingegneria Informatica",
  "subject": "Data Mining",
  "qapath": "unical/lm-ingegneria-informatica/data-mining.json"
}
```

| Campo | Significato |
| --- | --- |
| `institute` | Nome dell'università/istituto, come mostrato a schermo |
| `category` | Corso di laurea o area (es. `LT Ingegneria Informatica`, `Psicologia`) |
| `subject` | Nome della materia |
| `qapath` | Percorso del file delle domande, relativo a `public/assets/subjects/` |

Le cartelle e il nome del file sono la versione *slug* dei campi: minuscolo, senza accenti, spazi e simboli sostituiti da `-`.

### File di una materia

È un array di domande. Ogni domanda ha tre campi:

| Campo | Descrizione |
| --- | --- |
| `q` | Il testo della domanda (fronte della carta) |
| `a` | La risposta: stringa oppure array di stringhe, a seconda del tipo |
| `t` | Il tipo di domanda: `QA`, `RIORDINA` o `MULTIPLA` |

## Tipi di domanda

### `QA` — domanda e risposta

Il tipo più comune. `a` è una stringa: fronte la domanda, retro la risposta.

```json
{
  "q": "L'approccio empirico per la comprensione del comportamento umano enfatizza",
  "a": "l'osservazione diretta e la sperimentazione",
  "t": "QA"
}
```

### `RIORDINA` — rimettere in ordine

`a` è un array **già nell'ordine corretto**. L'app lo mescola e lo mostra sul fronte della carta; girandola si vede la sequenza giusta.

```json
{
  "q": "Riordina le fasi che compongono il processo di ricerca",
  "a": [
    "Sviluppare un quesito di ricerca",
    "Generare un'ipotesi di ricerca",
    "Formare delle definizioni operative",
    "Scegliere un disegno di ricerca",
    "Valutare l'etica della ricerca",
    "Raccogliere e analizzare i dati e formulare delle conclusioni",
    "Riferire sui dati"
  ],
  "t": "RIORDINA"
}
```

### `MULTIPLA` — scelta multipla

`a` è un array di opzioni, ognuna nella forma `SI;testo` oppure `NO;testo`. Sul fronte le opzioni vengono mostrate mescolate e senza il prefisso; sul retro restano solo quelle marcate `SI`.

```json
{
  "q": "Indica in quali situazioni è obbligatorio il debriefing",
  "a": [
    "SI;Agli studenti viene chiesto di descrivere un intruso entrato in classe, come parte di uno studio sulla testimonianza oculare.",
    "NO;Cento genitori compilano un questionario online sulla disabilità, dopo aver dato il consenso informato.",
    "SI;I partecipanti credono di somministrare scosse elettriche a un'altra persona."
  ],
  "t": "MULTIPLA"
}
```

Il separatore è il **primo** `;` della riga: nel testo dell'opzione i punti e virgola successivi sono liberi.

## Formattazione del testo

`q` e `a` non sono testo semplice: vengono renderizzati come HTML, con supporto per le formule matematiche.

### A capo e HTML

- `\n` diventa un'interruzione di riga, `\n\n` una riga vuota di separazione.
- Sono ammessi tag HTML inline (`<br>`, `<b>`, `<i>`, `<code>`, `<ul>`…). Usali con misura: il contenuto viene iniettato così com'è nella pagina, quindi niente `<script>`, `<iframe>` o attributi `on*`.

### Formule matematiche (KaTeX)

Si usa la sintassi LaTeX con i delimitatori `$`:

- `$...$` → formula **in linea**, dentro il flusso del testo;
- `$$...$$` → formula **in blocco**, centrata su una riga a sé.

Nel JSON i backslash vanno raddoppiati (`\\omega`, `\\dot{x}`), perché `\` è un carattere di escape JSON.

```json
{
  "q": "Che cos'è la linearizzazione di un sistema non lineare attorno a un punto di equilibrio?",
  "a": "È l'approssimazione locale ottenuta sviluppando le equazioni di stato e di uscita al primo ordine.\n\nSe $\\dot{x}=f(x,u)$ e $y=h(x,u)$, attorno a $(x_e,u_e)$ si ottiene $$\\delta\\dot{x}=A\\,\\delta x+B\\,\\delta u,\\qquad \\delta y=C\\,\\delta x+D\\,\\delta u$$ dove $A$, $B$, $C$ e $D$ sono le rispettive matrici Jacobiane valutate nel punto di equilibrio.",
  "t": "QA"
}
```

Regole pratiche:

- i `$` vanno **sempre in coppia**: un numero dispari di delimitatori in un testo è un errore;
- il carattere `$` non può comparire come simbolo letterale (es. per i dollari) nei testi delle domande;
- una formula in linea non può contenere a capo;
- prima di aprire una PR, verifica tutto con:

  ```bash
  node scripts/check-formulas.mjs
  ```

  Lo script rende ogni formula con KaTeX e segnala file, indice della domanda ed errore.

## Contribuire alle domande

Ogni contributo sulle domande è benvenuto: nuove materie, domande mancanti, risposte sbagliate o poco chiare, refusi.

**Con una issue** — se non vuoi toccare il codice: apri una [issue](https://github.com/PsykeDady/PsykeLearningCard/issues) indicando la materia, la domanda interessata e la correzione o l'aggiunta proposta.

**Con una pull request** — se vuoi modificarle direttamente:

1. Fai un fork del repository e crea un branch.
2. **Domande su una materia esistente:** modifica il JSON corrispondente in `public/assets/subjects/…`.
3. **Nuova materia:** crea il file in `public/assets/subjects/<istituto>/<categoria>/<materia>.json` e aggiungi la voce in `public/assets/subjects.json`.
4. Controlla che il JSON sia valido, che ogni domanda abbia `q`, `a` e `t` coerenti col tipo e, se ci sono formule, esegui `node scripts/check-formulas.mjs`.
5. Apri la PR verso `main` spiegando in breve cosa hai aggiunto o corretto.

Qualche indicazione sui contenuti: una domanda per concetto, risposte autoconsistenti (senza rimandi tipo "come visto sopra"), niente materiale coperto da copyright copiato integralmente da dispense o libri.

## Struttura del progetto

```
src/
├── components/       # Card, header, footer, navigazione a lista
├── contexts/         # contesto domande (caricamento, punteggio) e store Redux
├── models/           # Question, Subject, contenuti GitHub
├── pages/            # scelta materia, sessione di studio, pagine di errore
├── routes/           # configurazione React Router
├── styles/           # colori e tipografia
└── utils/
    ├── github.utils.js   # caricamento materie e domande (locale, con fallback su GitHub raw)
    └── stringutils.js    # formattazione testo + rendering KaTeX
```

I dati vengono letti prima dagli asset serviti insieme all'app; se non sono disponibili, si ricade sui file grezzi del repository su GitHub (branch `refactoring`, poi `main`).
