// Curated BibleProject Português video map
// All video IDs verified from @BibleProject-Português channel
// Each book maps to 1-3 relevant videos (overview first, then deep-dive/thematic)

export type BPVideo = { id: string; title: string };

export const BIBLEPROJECT_VIDEOS: Record<string, BPVideo[]> = {
  // ── PENTATEUCO ──────────────────────────────────────────────────────────────
  "Gênesis": [
    { id: "syzvUKr4f44", title: "Gênesis 1–11 · Visão Geral" },
    { id: "VaZdOfekgo8", title: "Gênesis 12–50 · Visão Geral" },
    { id: "f7iUjgJ6U9M", title: "O Livro de Gênesis — Parte 1" },
    { id: "NXxntlZSoEQ", title: "O Livro de Gênesis — Parte 2" },
  ],
  "Êxodo": [
    { id: "TF6whgRN6AM", title: "Êxodo 1–18 · Visão Geral" },
    { id: "cfZVX_ns8ds", title: "Êxodo 19–40 · Visão Geral" },
    { id: "fNDAvFlveKM", title: "O Livro de Êxodo — Parte 1" },
    { id: "SMz0zq0EPMM", title: "O Livro de Êxodo — Parte 2" },
  ],
  "Levítico": [
    { id: "bR5qA3fmpEM", title: "Levítico · Visão Geral" },
    { id: "b8fF2xdZMOU", title: "O Livro de Levítico" },
    { id: "ygryRtR76bI", title: "Sacrifício e Propiciação" },
  ],
  "Números": [
    { id: "6MtqQzOTukQ", title: "Números · Visão Geral" },
    { id: "K2OaGmdfdxI", title: "O Livro de Números" },
  ],
  "Deuteronômio": [
    { id: "udwkeytvMPI", title: "Deuteronômio · Visão Geral" },
    { id: "-N3VMFLKFGQ", title: "O Livro de Deuteronômio" },
    { id: "c9IwEZcYWws", title: "A Lei" },
  ],

  // ── HISTÓRICOS ──────────────────────────────────────────────────────────────
  "Josué": [
    { id: "OjB3aTBrgS8", title: "Josué · Visão Geral" },
  ],
  "Juízes": [
    { id: "cPu3SHxOFDo", title: "Juízes · Visão Geral" },
  ],
  "Rute": [
    { id: "m3voBpWv5Ig", title: "Rute · Visão Geral" },
  ],
  "1 Samuel": [
    { id: "othkYCAsskc", title: "1 Samuel · Visão Geral" },
  ],
  "2 Samuel": [
    { id: "YApXtfUyODg", title: "2 Samuel · Visão Geral" },
  ],
  "1 Reis": [
    { id: "6R5wFQWFDL4", title: "1–2 Reis · Visão Geral" },
    { id: "10VS8aSehrY", title: "Templo" },
  ],
  "2 Reis": [
    { id: "6R5wFQWFDL4", title: "1–2 Reis · Visão Geral" },
  ],
  "1 Crônicas": [
    { id: "1PnrE58L5Fg", title: "1–2 Crônicas · Visão Geral" },
  ],
  "2 Crônicas": [
    { id: "1PnrE58L5Fg", title: "1–2 Crônicas · Visão Geral" },
  ],
  "Esdras": [
    { id: "TTVEz3s22yE", title: "Esdras–Neemias · Visão Geral" },
  ],
  "Neemias": [
    { id: "TTVEz3s22yE", title: "Esdras–Neemias · Visão Geral" },
  ],
  "Ester": [
    { id: "0ZLyAPhbORU", title: "Ester · Visão Geral" },
  ],

  // ── POESIA E SABEDORIA ───────────────────────────────────────────────────────
  "Jó": [
    { id: "6rCWVsNyIqg", title: "Jó · Visão Geral" },
    { id: "YYYnDM372SA", title: "O Livro de Jó" },
  ],
  "Salmos": [
    { id: "fOPF8khGeII", title: "Salmos · Visão Geral" },
    { id: "WwokgNSOWuI", title: "Sábado" },
  ],
  "Provérbios": [
    { id: "W2zeUOSXMjA", title: "Provérbios · Visão Geral" },
    { id: "ZIoa1bub_rA", title: "O Livro de Provérbios" },
  ],
  "Eclesiastes": [
    { id: "E-nMyBL46bQ", title: "Eclesiastes · Visão Geral" },
    { id: "tf2JOY-VBiU", title: "O Livro de Eclesiastes" },
  ],
  "Cantares": [
    { id: "0QXA35lz9rA", title: "Cântico dos Cânticos · Visão Geral" },
  ],

  // ── PROFETAS MAIORES ─────────────────────────────────────────────────────────
  "Isaías": [
    { id: "EZ5LTlriVLs", title: "Isaías 1–39 · Visão Geral" },
    { id: "tAWKUvWe5JI", title: "Isaías 40–66 · Visão Geral" },
    { id: "dknI8gax1eA", title: "Messias" },
  ],
  "Jeremias": [
    { id: "1eSlWcmPxH4", title: "Jeremias · Visão Geral" },
    { id: "NDg0TV7m0i8", title: "O Caminho do Exílio" },
  ],
  "Lamentações": [
    { id: "g43dhirNO9Y", title: "Lamentações · Visão Geral" },
  ],
  "Ezequiel": [
    { id: "isBjPaTB5Rk", title: "Ezequiel 1–33 · Visão Geral" },
    { id: "TyNUYAy7zp4", title: "Ezequiel 34–48 · Visão Geral" },
    { id: "10VS8aSehrY", title: "Templo" },
  ],
  "Daniel": [
    { id: "pfsmbv0L0bo", title: "Daniel · Visão Geral" },
    { id: "eY1bi66vouc", title: "Filho do Homem" },
  ],

  // ── PROFETAS MENORES ─────────────────────────────────────────────────────────
  "Oséias": [{ id: "wGozU771I_w", title: "Oséias · Visão Geral" }],
  "Joel":   [{ id: "uQoMheoe904", title: "Joel · Visão Geral" }, { id: "so41a3JSVxA", title: "O Dia do Senhor" }],
  "Amós":   [{ id: "NXnDB-paGV4", title: "Amós · Visão Geral" }],
  "Obadias":[{ id: "ZsNqqDZiG1Y", title: "Obadias · Visão Geral" }],
  "Jonas":  [{ id: "FB-E5jUZas0", title: "Jonas · Visão Geral" }],
  "Miquéias":[{ id: "06A48hAXQA8", title: "Miquéias · Visão Geral" }],
  "Naum":   [{ id: "Sm3Ag-faQr0", title: "Naum · Visão Geral" }],
  "Habacuque":[{ id: "X9mMgfw2AFM", title: "Habacuque · Visão Geral" }],
  "Sofonias":[{ id: "VirAEdcrQG0", title: "Sofonias · Visão Geral" }],
  "Ageu":   [{ id: "VM5OH90xmjE", title: "Ageu · Visão Geral" }],
  "Zacarias":[{ id: "fgM4uynP7LU", title: "Zacarias · Visão Geral" }],
  "Malaquias":[{ id: "-HEQoeS1NtM", title: "Malaquias · Visão Geral" }],

  // ── EVANGELHOS E ATOS ────────────────────────────────────────────────────────
  "Mateus": [
    { id: "VskOdIySJQI", title: "Mateus 1–13 · Visão Geral" },
    { id: "4E-Ju-WKe1k", title: "Mateus 14–28 · Visão Geral" },
  ],
  "Marcos": [
    { id: "EOT1Mo_YERM", title: "Marcos · Visão Geral" },
    { id: "DoQlphslHd0", title: "Evangelho do Reino" },
  ],
  "Lucas": [
    { id: "ubXUcaXu8bQ", title: "Lucas 1–9 · Visão Geral" },
    { id: "UeUAAAs7hec", title: "Lucas 10–24 · Visão Geral" },
  ],
  "João": [
    { id: "x2Q23ddS1TM", title: "João 1–12 · Visão Geral" },
    { id: "bKIiCTvr8CA", title: "João 13–21 · Visão Geral" },
    { id: "uxxBXFZUvOk", title: "Vida Eterna" },
  ],
  "Atos": [
    { id: "9HdS25PV9JQ", title: "Atos 1–12 · Visão Geral" },
    { id: "29q6CEle764", title: "Atos 13–28 · Visão Geral" },
    { id: "ljnuAMhCVBg", title: "O Espírito Santo" },
  ],

  // ── CARTAS DE PAULO ──────────────────────────────────────────────────────────
  "Romanos": [
    { id: "uGLbrGF1JJk", title: "Romanos 1–4 · Visão Geral" },
    { id: "w5rkwQb3cFM", title: "Romanos 5–16 · Visão Geral" },
    { id: "Xt5llOKnvrQ", title: "Justiça" },
  ],
  "1 Coríntios":  [{ id: "XVVM-AP3IB0", title: "1 Coríntios · Visão Geral" }],
  "2 Coríntios":  [{ id: "BgFBb0uAuLY", title: "2 Coríntios · Visão Geral" }],
  "Gálatas":      [{ id: "UdP2LsHsAyY", title: "Gálatas · Visão Geral" }, { id: "Mgf8zfoy6Jc", title: "Graça" }],
  "Efésios":      [{ id: "HgQeAMIJZ8Q", title: "Efésios · Visão Geral" }, { id: "zu9jsq521xI", title: "Imagem de Deus" }],
  "Filipenses":   [{ id: "OtJkruVf4b0", title: "Filipenses · Visão Geral" }],
  "Colossenses":  [{ id: "25udRufsBzE", title: "Colossenses · Visão Geral" }],
  "1 Tessalonicenses": [{ id: "HEjuHQagEfY", title: "1 Tessalonicenses · Visão Geral" }],
  "2 Tessalonicenses": [{ id: "rxaPUrNzCTQ", title: "2 Tessalonicenses · Visão Geral" }],
  "1 Timóteo":    [{ id: "EK43-lXnV50", title: "1 Timóteo · Visão Geral" }],
  "2 Timóteo":    [{ id: "AxTyLu521XU", title: "2 Timóteo · Visão Geral" }],
  "Tito":         [{ id: "7I-QWYLUG6A", title: "Tito · Visão Geral" }],
  "Filemom":      [{ id: "JDLfv0-e6oI", title: "Filemom · Visão Geral" }],

  // ── CARTAS GERAIS ────────────────────────────────────────────────────────────
  "Hebreus": [
    { id: "yt4uHfHfixY", title: "Hebreus · Visão Geral" },
    { id: "EEf8lGwWr2k", title: "Santidade" },
  ],
  "Tiago":   [{ id: "jkMUhg4pqSk", title: "Tiago · Visão Geral" }],
  "1 Pedro": [{ id: "ckVR3YJUTXY", title: "1 Pedro · Visão Geral" }],
  "2 Pedro": [{ id: "hipwXlqhTNM", title: "2 Pedro · Visão Geral" }],
  "1 João":  [{ id: "vKZ-RGmZs-8", title: "1–3 João · Visão Geral" }, { id: "SOe8Rfjxq7A", title: "Amor (Ahavah)" }],
  "2 João":  [{ id: "vKZ-RGmZs-8", title: "1–3 João · Visão Geral" }],
  "3 João":  [{ id: "vKZ-RGmZs-8", title: "1–3 João · Visão Geral" }],
  "Judas":   [{ id: "Ep975kf8vXE", title: "Judas · Visão Geral" }],
  "Apocalipse": [
    { id: "BLQEAe9VDUQ", title: "Apocalipse 1–11 · Visão Geral" },
    { id: "eizPQBawrsU", title: "Apocalipse 12–22 · Visão Geral" },
    { id: "u8AvXQVNhD8", title: "Céu e Terra" },
  ],
};
