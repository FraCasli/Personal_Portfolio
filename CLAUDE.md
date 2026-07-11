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
npm run dev       # dev server, http://localhost:4321/Personal_Portfolio/ (vedi nota base path)
npm run build     # genera l'output statico in dist/
npm run preview   # serve dist/ localmente per verifica pre-deploy
```

## Deploy su GitHub Pages

- `astro.config.mjs` imposta `site: "https://fracasli.github.io"` e
  `base: "/Personal_Portfolio"` — necessario perché GitHub Pages di progetto serve il sito da
  un sottopercorso, non dalla root del dominio. **Con `base` impostato, anche il dev server
  gira sotto quel sottopercorso** (`http://localhost:4321/Personal_Portfolio/`), non su `/`.
- Tutti i link/percorsi interni (`href`, `src` di immagini in `public/`) passano dall'helper
  `src/utils/url.ts` → `withBase(path)`, che prefissa con `import.meta.env.BASE_URL`. Le immagini
  gestite da `astro:assets` (`<Image>`, import diretti in `src/assets/`) sono già prefissate
  automaticamente da Astro e non serve toccarle.
  **Se aggiungi un nuovo link o `<img src="/...">` hardcoded, passalo sempre da `withBase()`**,
  altrimenti sotto GitHub Pages punterà alla root sbagliata.
- Il workflow `.github/workflows/deploy.yml` builda il sito (`npm ci && npm run build`) e pubblica
  `dist/` su GitHub Pages a ogni push su `main`. **Passo manuale una tantum**: nelle impostazioni
  della repo GitHub → Settings → Pages → Source, selezionare "GitHub Actions" (non "Deploy from a
  branch").
- Se cambi nome alla repo o account GitHub, aggiorna `site`/`base` in `astro.config.mjs` di conseguenza.

## Struttura

```
src/
  pages/
    index.astro          # Home: Header (hero) + ProjectList + Footer
    projects/[slug].astro # Route dinamica: 1 pagina per ogni entry di src/content/projects/
  layouts/
    ProjectLayout.astro   # Layout condiviso delle pagine di dettaglio progetto
  components/
    TopBar.astro          # Barra grigia in alto (nome/titolo portfolio/"selected works")
    SiteNav.astro         # Menu Home / Professional / University / CV, riusato in home + dettaglio
    Header.astro          # Hero della home: ritratto + identità + titolo + SiteNav
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
    hero-portrait.jpg, signature.png  # immagini home (già ottimizzate manualmente in public/)
    projects/<slug>/NN-nome.ext        # elaborati di galleria per ogni progetto
    projects/thumb-<slug>.png          # miniature usate SOLO nella home list
public/assets/
    images/hero-portrait.jpg, signature.png  # NON passano da astro:assets (usate via <img> diretto in Header)
    fonts/FuturaLT-{Light,Book}.woff2         # attesi da main.css ma NON presenti (vedi "Font mancanti")
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

- Colori: `--color-black`, `--color-white`, `--color-grey` (#d7d7d7, barre), `--color-blue` (#5F7489, hover)
- Font: `--font-family-base` = "Futura LT" con fallback "Century Gothic"/"Avenir Next"/sans-serif;
  pesi `--font-weight-light` (Futura LT Light) e `--font-weight-book` (Futura LT Book)
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
**Questi file non esistono** — il sito al momento usa il fallback di sistema (Century Gothic/Avenir
Next/sans-serif). Se si recuperano i file del font, basta metterli in quel percorso: nessuna modifica
al codice necessaria.

## Layout condiviso

Sia `Header.astro` (home) sia `ProjectLayout.astro` (dettaglio) usano la stessa griglia a 3 colonne
`1fr 2fr 1fr` da 64rem in su (colonna sinistra / centrale contenuto / colonna destra nav), per
coerenza visiva. `SiteNav` usa `<details>/<summary>` per i sottomenu Professional/University —
accessibile e senza JS.

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

## Cose note ma non ancora fatte

- **Stalla Montaccio** (comparso nel menu Figma come "a2 | Stalla Montaccio", frame `3523:1804`,
  Slide 16:9 - 16): il frame è un duplicato non ancora modificato di "Ristorante Garni Bar Post"
  (stesso titolo/testo/immagini). Non ha contenuti propri in Figma: nessuna pagina costruita finché
  non viene popolato.
- **Curriculum vitae**: link presente in `SiteNav` (`/curriculum-vitae`) ma la pagina non esiste ancora.
- **Font Futura LT**: vedi sopra, fallback di sistema attivo.
- Il file Figma sorgente può essere stato modificato dopo l'ultima sincronizzazione: se aggiungi
  progetti o modifichi contenuti in Figma, questo file va tenuto aggiornato di conseguenza.
