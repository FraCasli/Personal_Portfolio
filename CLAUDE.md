# Francesca Caslini — Architecture Portfolio

Portfolio statico costruito con Astro a partire dal design Figma
"Francesca Caslini" (fileKey `QgD37tvmT37aysnbuSRGOG`). Output 100% statico
(nessun framework JS lato client), pensato per hosting su hosting statico
(es. Hugging Face Spaces / GitHub Pages).

## Stack

- **Astro 4** (`output: "static"`), nessuna dipendenza UI (no React/Vue/Tailwind)
- CSS vanilla con custom properties (design token)
- **Astro Content Collections** per i dati dei progetti (`astro:content`)
- **`astro:assets`** per l'ottimizzazione automatica delle immagini in build (sharp)

Comandi:
```
npm install
npm run dev       # dev server, http://localhost:4321/
npm run build     # genera l'output statico in dist/
npm run preview   # serve dist/ localmente per verifica pre-deploy
```

## Deploy su GitHub Pages (dominio custom)

- Il sito è servito dal dominio custom **`www.francescacaslini.info`** (registrato su Porkbun,
  puntato a GitHub Pages via DNS), non più da `https://fracasli.github.io/Personal_Portfolio/`.
  Di conseguenza `astro.config.mjs` imposta solo `site: "https://www.francescacaslini.info"` e
  **non ha più `base`** (default `"/"`): il sito è servito dalla root del dominio, non da un
  sottopercorso. Se in futuro si tornasse a un dominio `*.github.io/<repo>` senza dominio custom,
  andrebbe reintrodotto `base: "/<repo>"`.
- **`public/CNAME`** contiene `www.francescacaslini.info` — file richiesto da GitHub Pages per
  sapere che il sito va servito su quel dominio invece che su `fracasli.github.io`. Astro copia il
  contenuto di `public/` così com'è nella root di `dist/`, quindi il CNAME arriva automaticamente
  nel deploy. **Non rimuoverlo/rinominarlo** senza aggiornare anche le impostazioni DNS su Porkbun
  e Settings → Pages → Custom domain su GitHub.
- Tutti i link/percorsi interni (`href`, `src` di immagini in `public/`) passano dall'helper
  `src/utils/url.ts` → `withBase(path)`, che prefissa con `import.meta.env.BASE_URL` (ora `"/"`,
  quindi di fatto un no-op, ma va comunque usato per restare compatibili se `base` cambiasse di
  nuovo in futuro). Le immagini gestite da `astro:assets` (`<Image>`, import diretti in
  `src/assets/`) sono già prefissate automaticamente da Astro e non serve toccarle.
  **Se aggiungi un nuovo link o `<img src="/...">` hardcoded, passalo sempre da `withBase()`**.
- Il workflow `.github/workflows/deploy.yml` builda il sito (`npm ci && npm run build`) e pubblica
  `dist/` su GitHub Pages a ogni push su `main`. **Passo manuale una tantum**: nelle impostazioni
  della repo GitHub → Settings → Pages → Source, selezionare "GitHub Actions" (non "Deploy from a
  branch"), e in Settings → Pages → Custom domain impostare `www.francescacaslini.info`.
- Se cambi dominio o torni al sottopercorso `github.io`, aggiorna `site`/`base` in
  `astro.config.mjs` **e** `public/CNAME` di conseguenza.

## Struttura

```
src/
  pages/
    index.astro          # Home: Header (hero) + ProjectList + Footer
    curriculum-vitae.astro # Pagina CV (formazione, esperienze, skill, lingue), dati inline nel file
    projects/[slug].astro # Route dinamica: 1 pagina per ogni entry di src/content/projects/
  layouts/
    ProjectLayout.astro   # Layout condiviso delle pagine di dettaglio progetto
  components/
    TopBar.astro          # Barra grigia in alto (nome/titolo portfolio/"selected works")
    SiteNav.astro         # Menu Home / Professional / University / CV, riusato ovunque
    Header.astro          # Hero della home: foto di sfondo full-bleed + identità + titolo + SiteNav overlay
    Footer.astro          # Barra di contatto in fondo pagina ("Page Down")
    ProjectList.astro     # Elenco righe progetto nella home (usa src/data/projects.ts)
  data/
    projects.ts           # Manifest statico dei progetti per nav/home (vedi sotto)
  content/
    config.ts             # Schema della collection "projects"
    projects/*.md          # Un file per progetto con dettagli + descrizione + gallery
  styles/
    tokens.css             # Design token (colori, font, spaziatura)
    main.css                # Reset + stili globali, importa tokens.css
  assets/images/
    hero-mountain.jpg     # Foto di sfondo hero home (croppata/specchiata da Figma, vedi sotto)
    cv-portrait.jpg        # Ritratto usato nella pagina CV
    projects/<slug>/NN-nome.ext        # elaborati di galleria per ogni progetto
    projects/thumb-<slug>.png          # miniature usate SOLO nella home list
public/assets/
    images/signature.png  # firma, NON passa da astro:assets (usata via <img> diretto, riusata in Header + CV)
    fonts/
      FuturaLT-{Light,Book}.woff2  # attesi da main.css ma NON presenti (vedi "Font mancanti")
      Jost-Variable.woff2           # font fallback self-hosted attivo, vedi "Font mancanti"
```

## Doppia fonte dati dei progetti (IMPORTANTE)

Ci sono **due fonti distinte e non ridondanti** per i progetti:

1. **`src/data/projects.ts`** — manifest statico con `slug, code, category, location, type, year, studio`.
   Usato da `SiteNav.astro` (per generare il menu) e `ProjectList.astro` (righe della home).
   Contiene **tutti** i progetti conosciuti, anche quelli senza pagina di dettaglio ancora costruita.

2. **`src/content/projects/*.md`** — una entry per ogni progetto che **ha già una pagina di dettaglio**
   costruita (title, code, category, order, details[], gallery[], corpo markdown = descrizione).

`SiteNav.astro` e `ProjectList.astro` interrogano `getCollection("projects")` per sapere quali slug
hanno già una pagina reale: se sì linkano a `/projects/<slug>/`, altrimenti fanno fallback ad
un'ancora `/#<slug>` sulla riga corrispondente in home. Questo permette di aggiungere progetti al
manifest (quindi farli comparire in home/nav) **prima** di aver costruito la pagina di dettaglio,
senza generare link rotti.

**Quando aggiungi un nuovo progetto**: aggiorna prima `src/data/projects.ts`, poi crea
`src/content/projects/<slug>.md` con lo stesso `code`/`category`; il link si "accende" da solo.

## Design token (`src/styles/tokens.css`)

Estratti dalle variabili Figma del file (`Base`, `Titolo`, `Blu`):

- Colori: `--color-black`, `--color-white`, `--color-grey` (#d7d7d7, barre), `--color-blue` (#5F7489, hover),
  `--color-gold` (#f3d49d, testo overlay sulla foto hero — hex letterale, non è una variabile Figma legata)
- Font: `--font-family-base` = "Futura LT" con fallback "Jost" (self-hosted) poi "Century Gothic"/"Avenir Next"/sans-serif;
  pesi `--font-weight-light` (200, Futura LT Light) e `--font-weight-book` (400, Futura LT Book)
- Dimensioni: `--font-size-sm` (16px body), `--font-size-md` (20px titoli/barre), `--font-size-xl` (46px hero)
- Letter-spacing: `--tracking-base` (2%, testo normale), `--tracking-wide` (15%, titoli/maiuscolo)
- Spaziatura: scala `--space-1`…`--space-9` su base 8px
- `--size-thumb` (160px, miniature home), `--opacity-dim`/`--transition-base` (hover miniature)

### Font mancanti

Figma non espone font a licenza commerciale. `main.css` ha già gli `@font-face` pronti che puntano a:
```
public/assets/fonts/FuturaLT-Light.woff2
public/assets/fonts/FuturaLT-Book.woff2
```
**Questi file non esistono.** Nel frattempo `main.css` definisce anche `@font-face` per **Jost**
(`public/assets/fonts/Jost-Variable.woff2`, SIL OFL, self-hosted — scaricato da Google Fonts), un
geometric sans open-source molto vicino a Futura, messo in `--font-family-base` subito dopo "Futura LT"
nella catena di fallback. È lui il font effettivamente attivo oggi (Futura LT fallisce silenziosamente
il 404 e il browser passa a Jost). Se si recuperano i file veri di Futura LT, basta metterli nel percorso
sopra: **nessuna modifica al codice necessaria**, torneranno ad avere priorità automaticamente.

## Layout condiviso

`ProjectLayout.astro` (dettaglio progetto) e `curriculum-vitae.astro` usano la stessa griglia a 3
colonne `1fr 2fr 1fr` da 64rem in su (colonna sinistra / centrale contenuto / colonna destra nav), per
coerenza visiva. Le pagine di dettaglio progetto hanno inoltre due linee separatrici (`border-top`
grigio) nella colonna sinistra: una tra titolo e lista dettagli, una tra lista dettagli e descrizione;
ogni riga dettaglio è resa come `Label   -   Valore` (dash via `::before` su `dd`). `SiteNav` usa
`<details>/<summary>` per i sottomenu Professional/University — accessibile e senza JS.

`Header.astro` (home) è diverso: è una foto a piena larghezza (`aspect-ratio: 1920/1034`) con testo
in overlay (`position:absolute` sull'immagine, poi un `div` `position:relative` sopra in flex
column). Identità (nome/ruolo/firma) e `SiteNav` sono in alto a destra sopra la foto; titolo
"Architecture portfolio" e hint scroll sono in basso a destra. Il colore del testo overlay
(nome/titolo/hint) è `--color-gold`; `SiteNav` invece resta nero di default (leggibile comunque
sulla foto in quel punto — verificato via screenshot, nessun override necessario).

## Riferimento ai frame Figma

Ogni pagina progetto è stata generata da un frame "Slide 16:9 - N" nel file Figma. Mappatura frame → slug
(utile se serve ri-sincronizzare un progetto dopo modifiche in Figma):

| slug | frame Figma | code |
|---|---|---|
| casa-sb | `1302:1493` (Slide 16:9 - 11) | a2 |
| verso-sud | `1310:1723` (Slide 16:9 - 13) | a3 |
| casa-ln | `1310:1769` (Slide 16:9 - 14) | a4 |
| ristorante-garni-bar-post | `3487:1564` (Slide 16:9 - 15) | a1 |
| student-hostel | `1:298` (Slide 16:9 - 5) | b1 |
| diffused-house | `8:21` (Slide 16:9 - 6) | b2 |
| school-rubattino | `36:269` (Slide 16:9 - 7) | b3 |
| hedgehog | `36:793` (Slide 16:9 - 8) | b4 |
| agency-of-future | `46:205` (Slide 16:9 - 9) | b5 |
| colonie | `46:261` (Slide 16:9 - 10) | b6 |

Pagine non-progetto: Home = frame `1:334` ("Home"), Curriculum vitae = frame `1:112`
("Curriculum Vitae"). Non seguono la convenzione "Slide 16:9 - N" delle pagine progetto.

## Cose note ma non ancora fatte

- **Stalla Montaccio** (comparso nel menu Figma come "a2 | Stalla Montaccio", frame `3523:1804`,
  Slide 16:9 - 16): il frame è un duplicato non ancora modificato di "Ristorante Garni Bar Post"
  (stesso titolo/testo/immagini). Non ha contenuti propri in Figma: nessuna pagina costruita finché
  non viene popolato. **Nota**: nel menu Figma attuale questo progetto occupa la posizione "a2",
  spostando Casa SB/Verso Sud/Casa LN rispettivamente ad a3/a4/a5 — `src/data/projects.ts` non
  riflette questo shift (mantiene Casa SB come a2 ecc.) perché Stalla Montaccio resta escluso dal
  manifest finché non ha contenuti propri; se un giorno viene popolato, riallineare i `code`.
- **Font Futura LT**: vedi sopra — fallback attivo su Jost (self-hosted), non più sul solo fallback
  di sistema.
- **Hero home** (`Header.astro`): l'immagine `src/assets/images/hero-mountain.jpg` è stata ricavata
  ritagliando e specchiando orizzontalmente l'asset sorgente di Figma (il frame applicava un
  `rotate-180` + `scaleY(-1)`, equivalente netto a un mirror orizzontale, più uno zoom/crop non
  uniforme risolto calcolando l'area visibile in pixel sorgente). Se l'immagine cambia di nuovo in
  Figma va rifatto lo stesso procedimento (o semplicemente ri-esportata l'immagine già ritagliata
  da Figma, se disponibile).
- Il file Figma sorgente può essere stato modificato dopo l'ultima sincronizzazione: se aggiungi
  progetti o modifichi contenuti in Figma, questo file va tenuto aggiornato di conseguenza.
