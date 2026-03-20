// Total chapters per Bible book — PT-BR names matching BOOK_ABBR in lib/bible.ts
export const BOOK_CHAPTER_COUNT: Record<string, number> = {
  "Gênesis": 50,     "Êxodo": 40,        "Levítico": 27,     "Números": 36,          "Deuteronômio": 34,
  "Josué": 24,       "Juízes": 21,        "Rute": 4,          "1 Samuel": 31,         "2 Samuel": 24,
  "1 Reis": 22,      "2 Reis": 25,        "1 Crônicas": 29,   "2 Crônicas": 36,       "Esdras": 10,
  "Neemias": 13,     "Ester": 10,         "Jó": 42,           "Salmos": 150,          "Provérbios": 31,
  "Eclesiastes": 12, "Cantares": 8,       "Isaías": 66,       "Jeremias": 52,         "Lamentações": 5,
  "Ezequiel": 48,    "Daniel": 12,        "Oséias": 14,       "Joel": 3,              "Amós": 9,
  "Obadias": 1,      "Jonas": 4,          "Miquéias": 7,      "Naum": 3,              "Habacuque": 3,
  "Sofonias": 3,     "Ageu": 2,           "Zacarias": 14,     "Malaquias": 4,
  "Mateus": 28,      "Marcos": 16,        "Lucas": 24,        "João": 21,             "Atos": 28,
  "Romanos": 16,     "1 Coríntios": 16,   "2 Coríntios": 13,  "Gálatas": 6,           "Efésios": 6,
  "Filipenses": 4,   "Colossenses": 4,    "1 Tessalonicenses": 5, "2 Tessalonicenses": 3, "1 Timóteo": 6,
  "2 Timóteo": 4,    "Tito": 3,           "Filemom": 1,       "Hebreus": 13,          "Tiago": 5,
  "1 Pedro": 5,      "2 Pedro": 3,        "1 João": 5,        "2 João": 1,            "3 João": 1,
  "Judas": 1,        "Apocalipse": 22,
};

// Display abbreviation → full book name (reverse of ABBR map in JornadaClient)
export const ABBR_TO_BOOK: Record<string, string> = {
  "Gn": "Gênesis",      "Êx": "Êxodo",         "Lv": "Levítico",      "Nm": "Números",        "Dt": "Deuteronômio",
  "Js": "Josué",        "Jz": "Juízes",         "Rt": "Rute",          "1Sm": "1 Samuel",      "2Sm": "2 Samuel",
  "1Rs": "1 Reis",      "2Rs": "2 Reis",        "1Cr": "1 Crônicas",   "2Cr": "2 Crônicas",    "Esd": "Esdras",
  "Ne": "Neemias",      "Et": "Ester",          "Jó": "Jó",            "Sl": "Salmos",         "Pv": "Provérbios",
  "Ec": "Eclesiastes",  "Ct": "Cantares",       "Is": "Isaías",        "Jr": "Jeremias",       "Lm": "Lamentações",
  "Ez": "Ezequiel",     "Dn": "Daniel",         "Os": "Oséias",        "Jl": "Joel",           "Am": "Amós",
  "Ob": "Obadias",      "Jn": "Jonas",          "Mq": "Miquéias",      "Na": "Naum",           "Hc": "Habacuque",
  "Sf": "Sofonias",     "Ag": "Ageu",           "Zc": "Zacarias",      "Ml": "Malaquias",
  "Mt": "Mateus",       "Mc": "Marcos",         "Lc": "Lucas",         "Jo": "João",           "At": "Atos",
  "Rm": "Romanos",      "1Co": "1 Coríntios",   "2Co": "2 Coríntios",  "Gl": "Gálatas",        "Ef": "Efésios",
  "Fp": "Filipenses",   "Cl": "Colossenses",    "1Ts": "1 Tessalonicenses", "2Ts": "2 Tessalonicenses", "1Tm": "1 Timóteo",
  "2Tm": "2 Timóteo",   "Tt": "Tito",           "Fm": "Filemom",       "Hb": "Hebreus",        "Tg": "Tiago",
  "1Pe": "1 Pedro",     "2Pe": "2 Pedro",       "1Jo": "1 João",       "2Jo": "2 João",        "3Jo": "3 João",
  "Jd": "Judas",        "Ap": "Apocalipse",
};
