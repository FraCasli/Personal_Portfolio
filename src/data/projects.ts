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
  { slug: "ristorante-garni-bar-post", code: "a1 | Garni Bar Post", category: "professional", location: "Castasegna, GR", type: "Requalification", year: "2026", studio: "Commission" },
  { slug: "stalla-montaccio", code: "a2 | Stalla Montaccio", category: "professional", location: "Montaccio, GR", type: "Requalification", year: "2026", studio: "Commission" },
  { slug: "casa-sb", code: "a3 | Casa SB", category: "professional", location: "Maloja, GR", type: "New building", year: "2023", studio: "Ruinelli Associati" },
  { slug: "verso-sud", code: "a4 | Verso Sud", category: "professional", location: "Crete", type: "New building", year: "2023", studio: "Ruinelli Associati" },
  { slug: "casa-ln", code: "a5 | Casa LN", category: "professional", location: "Stampa, GR", type: "Requalification", year: "2023", studio: "Ruinelli Associati" },
  { slug: "student-hostel", code: "b1 | Student hostel", category: "university", location: "Milano, MI", type: "New building", year: "2023", studio: "PoliMi - Cino Zucchi" },
  { slug: "diffused-house", code: "b2 | Diffused house", category: "university", location: "Monesteroli, SP", type: "Requalification", year: "2023", studio: "PoliMi - Jacopo Leveratto" },
  { slug: "school-rubattino", code: "b3 | A school for Rubattino", category: "university", location: "Milano, MI", type: "New building", year: "2018 - 2019", studio: "PoliMi - Lorenzo Consalez" },
  { slug: "hedgehog", code: "b4 | Hedgehog", category: "university", location: "Milano, MI", type: "New building", year: "2020 - 2021", studio: "PoliMi - Alessandra Zanelli" },
  { slug: "colonie", code: "b5 | Colonie", category: "university", location: "Milano, MI", type: "Scenography", year: "2022", studio: "PoliMi - Pierluigi Salvadeo" },
];
