export interface ProjectSummary {
  slug: string;
  code: string;
  category: "professional" | "university";
  location: string;
  type: string;
  year: string;
  studio: string;
}

export const projects: ProjectSummary[] = [
  { slug: "ristorante-garni-bar-post", code: "a1 | Ristorante Garni Bar Post", category: "professional", location: "Castasegna, GR", type: "Requalification", year: "2026", studio: "Commission" },
  { slug: "casa-sb", code: "a2 | Casa SB", category: "professional", location: "Maloja, GR", type: "New building", year: "2023", studio: "Ruinelli Associati" },
  { slug: "verso-sud", code: "a3 | Verso Sud", category: "professional", location: "Crete", type: "New building", year: "2023", studio: "Ruinelli Associati" },
  { slug: "casa-ln", code: "a4 | Casa LN", category: "professional", location: "Stampa, GR", type: "Requalification", year: "2023", studio: "Ruinelli Associati" },
  { slug: "student-hostel", code: "b1 | Student hostel", category: "university", location: "Milano, MI", type: "New building", year: "2023", studio: "PoliMi - Cino Zucchi" },
  { slug: "diffused-house", code: "b2 | Diffused house", category: "university", location: "Monesteroli, SP", type: "Requalification", year: "2023", studio: "PoliMi - Jacopo Leveratto" },
  { slug: "school-rubattino", code: "b3 | A school for Rubattino", category: "university", location: "Milano, MI", type: "New building", year: "2018 - 2019", studio: "PoliMi - Lorenzo Consalez" },
  { slug: "hedgehog", code: "b4 | Hedgehog", category: "university", location: "Milano, MI", type: "New building", year: "2020 - 2021", studio: "PoliMi - Alessandra Zanelli" },
  { slug: "agency-of-future", code: "b5 | Agency of Future", category: "university", location: "Milano, MI", type: "Multidisciplinary project", year: "2020 - 2021", studio: "Alta Scuola Politecnica" },
  { slug: "colonie", code: "b6 | Colonie", category: "university", location: "Milano, MI", type: "Scenography", year: "2022", studio: "PoliMi - Pierluigi Salvadeo" },
];
