# Telos — App Specification

## Product Overview

**Name:** Telos
**What it is:** A Bible completion tracker app for the Brazilian evangelical market.
**Core mission:** Help users finish reading the entire Bible — with streaks, pace control, and AI-generated daily devotionals in Portuguese.
**Stack:** Next.js (web PWA), Supabase, Stripe + PIX, Claude API (Anthropic).
**Target:** Brazilian evangélicos, R$14.90–19.90/month Pro tier.

---

## Design System

**Colors:**
- Parchment bg: `#F7F3EE`
- Surface: `#EDE8DF`
- Card: `#FFFFFF`
- Border: `#E2DBD0`
- Muted: `#C8BEB2`
- Gray: `#8C8279`
- Ink: `#0D0D0B`
- Blue accent: `#3B82C4`

**Fonts:**
- Serif (headings/Bible text): `Vesper Libre`
- Sans (UI/body): `Noto Sans`

**UI style:** Glassmorphism headers (blur 24px, 82% opacity), floating capsule nav dock, frosted glass effects.

---

## App Structure — 4 Bottom Tabs

### Tab 1: Hoje (`/hoje`)
The daily screen. What the user sees every time they open the app.

**Components (top to bottom):**
1. **Frosted glass sticky header** — greeting + streak badge
2. **Horizon calendar** — horizontal date scroller, today featured, past days with completion dots
3. **Progress bar** — % of plan completed
4. **Leitura de hoje** — today's assigned reading. Tap "Ler agora" → opens `/leitura` Bible reader
5. **Versículo do dia** — key verse with share button (WhatsApp/Instagram)
6. **Como você está hoje?** — mood selector (5 pills: Ansioso, Triste, Grato, Perdido, Cansado). Appears after reading is marked done. Tapping a mood surfaces a content card (verse + reflection)
7. **Música para hoje** — music embed placeholder (Spotify playlist embed coming)
8. **Devocionário** — Claude-generated devotional. Free: read-only text. Pro: audio narration button. Unlocks after reading marked done.

**UX rule:** Mood content and devotional only fully accessible after today's reading is marked "Concluído" in the reader. This protects the core reading loop.

---

### Tab 2: Jornada (`/jornada`)
The Bible completion map. Core feature of the app.

**Components:**
1. **Completion ring** — circular progress showing % of entire Bible completed
2. **Bible book grid** — all 66 books shown as tiles. Color fill = % of chapters completed. Tap a book to see its chapters as a checklist
3. **Chapter checklist** — inside each book, list all chapters with checkboxes. Marking a chapter also advances the streak if it's today's reading
4. **Pace selector** — choose reading pace: 3 months, 6 months, 9 months, 1 year, 2 years. Free: 9-month only. Pro: all paces
5. **Milestones** — badges unlocked at completion of each Testament, major section (Torah, Prophets, Gospels, etc.), and at 25/50/75/100%
6. **Annual Wrapped card** (Pro) — end-of-year shareable card with Claude-generated highlight phrase

---

### Tab 3: Explorar (`/explorar`)
Mood-based and themed spiritual content. Every piece links to a Bible passage.

**Layout:** Horizontal scroll categories at top, vertical card list below.

**Categories:**
- Orações guiadas (guided prayers)
- Meditações bíblicas (Bible meditations)
- Versículos por tema (verses by topic)
- Histórias bíblicas narradas (narrated Bible stories — main Pro conversion driver)
- Playlists de louvor (YouTube embeds: Hillsong PT, Fernandinho, Aline Barros)

**Mood → Content Mapping:**

| Mood | Key verse | Content type |
|------|-----------|-------------|
| Ansioso | Filipenses 4:6-7 | Oração guiada + Salmo 23 |
| Triste | Salmo 34:18 | Lamentações 3, história de Jó |
| Grato | Salmo 100 | Oração de gratidão, versículo para compartilhar |
| Perdido | Jeremias 29:11 | História de Abraão, devocional "Fé" |
| Cansado | Mateus 11:28 | Oração antes de dormir, Salmo 121 |

**Free vs Pro:**
- Free: 3 content cards/day, text only, fixed selection
- Pro: unlimited, audio narration, Claude-personalized reflection, history saved

---

### Tab 4: Perfil (`/perfil`)
Account management + community.

**Components:**
1. **Stats dashboard** — total chapters read, current streak, longest streak, books completed, days active
2. **Streak history calendar** — GitHub-style heatmap of reading days
3. **Igreja / grupo** (Pro) — join or create a church reading group, group leaderboard
4. **Journal / notas** — personal notes tied to specific chapters. Free: last 10. Pro: unlimited + searchable
5. **Notificações** — set daily reminder time. Smart reminder text changes based on streak length
6. **Upgrade para Pro** — paywall CTA with feature list and pricing

---

## Bible Reader (`/leitura`)
Accessed by tapping "Ler agora" on the Hoje card. Not a nav tab.

**Features:**
- Sticky frosted glass header with chapter title + translation toggle (NVI/ACF)
- Bible text with verse numbers in serif font
- Tap a verse to highlight + open note-taking bottom sheet (Pro only)
- "Li hoje" / "Concluído" button at bottom
- Pro accordion sections below: O que você leu, Contexto histórico, Aprofunde-se (YouTube), Para refletir, Anotações

---

## Free vs Pro Split

### Free tier:
- Full Bible tracker (mark chapters, see completion %)
- 9-month reading pace only
- Today's reading assignment
- Devotional (read-only text)
- 1 mood content card/day (text only)
- Versículo do dia with sharing
- Last 10 journal notes
- Personal stats

### Pro tier (R$14.90–19.90/month):
- Audio devotional (narrated in Brazilian Portuguese)
- All pace options (3mo / 6mo / 9mo / 1yr / 2yr)
- Full Explorar library + audio narrations
- Histórias bíblicas narradas (main conversion driver)
- Streak recovery (1 grace day/week)
- Annual Wrapped card (shareable)
- Church groups + leaderboard
- Unlimited journal + search
- Previous devotionals access
- Verse note-taking in reader

---

## Paywall Moments

1. After marking reading done → audio button on devotional is locked
2. Selecting a faster pace (3/6 month) → lock icon
3. 4th mood card of the day → "Você usou seus 3 conteúdos gratuitos hoje"
4. Tapping a narrated story → "Histórias bíblicas narradas são exclusivas do Pro"
5. Streak breaks → "Não perca sua sequência! Ative o dia de graça com o Pro"
6. Joining/creating a group → "Grupos são exclusivos para membros Pro"

---

## Supabase Schema (current)

**Tables:**
- `profiles` — id, full_name, email, phone, pace, start_date, bible_translation, plan_type
- `devotionals` — day_number, pace, chapters_text, books_covered, key_verse, key_verse_reference, reflection, historical_context, discussion_questions, youtube_search_terms
- `reading_progress` — user_id, day_number, completed_at
- `streaks` — user_id, current_streak, longest_streak, last_read_date
- `notes` — user_id, day_number, content, verse_reference, created_at, updated_at

**Planned additions:**
```sql
-- mood_entries
id uuid primary key
user_id uuid references profiles(id)
mood text -- 'ansioso' | 'triste' | 'grato' | 'perdido' | 'cansado'
content_id text
created_at timestamptz default now()

-- mood_content (or static JSON)
id text primary key
mood text
verse_ref text
verse_text text
reflection_pt text
audio_url text
is_pro boolean
```

---

## Mood System

**When it appears:** Only after user taps "Concluído" on today's reading.

**UI:** 5 horizontally scrollable pill buttons. Single selection. After tapping, animates in a content card below.

**Content card:**
```
[Versículo âncora — bold, large, serif]
[Referência — small, muted]
[Reflexão — 3 sentences, Claude-generated PT-BR]
[Audio button — Pro only, locked for free]
[Compartilhar — free]
```

**Claude API call (cache daily, not per-user):**
```javascript
const prompt = `Você é um pastor evangélico brasileiro escrevendo uma reflexão breve e calorosa.
O usuário está se sentindo ${mood} hoje.
Versículo base: ${verseRef} — "${verseText}"
Escreva uma reflexão de exatamente 3 frases em português brasileiro:
1. Reconheça o sentimento com empatia
2. Conecte o versículo ao momento do usuário
3. Encerre com encorajamento prático e esperançoso
Tom: caloroso, pastoral, direto. Sem linguagem excessivamente formal.`;
```

---

## Key UX Rules

1. **Reading comes first.** Mood content and devotional unlock only after today's reading is marked done.
2. **Streak is sacred.** Every screen reinforces the streak. Notifications change text based on streak length.
3. **Share buttons everywhere.** Versículo do dia, devotional highlight, Wrapped card — one-tap WhatsApp share. This is the viral growth engine.
4. **Audio is the #1 Pro driver.** Always show the locked audio button to free users so they know what they're missing.
5. **Portuguese first.** All copy, Claude prompts, notifications, and content must be in Brazilian Portuguese. No EN fallbacks.

---

## Build Order

**Phase 1 (current — MVP):**
- [x] Bible reading plan with daily assignments
- [x] Streak counter
- [x] Devotional (text, Claude API)
- [x] Horizon calendar
- [x] Floating capsule nav
- [x] Frosted glass UI
- [ ] Jornada tab (Bible book grid + completion ring)
- [ ] Explorar tab (content library)
- [ ] Mood selector + content cards
- [ ] Perfil tab (stats heatmap, journal, notifications)
- [ ] Versículo do dia share button

**Phase 2 (Pro launch):**
- [ ] Paywall + Stripe/PIX integration
- [ ] Audio devotional (ElevenLabs PT voice)
- [ ] All pace options
- [ ] Streak recovery (grace day)
- [ ] Previous devotionals

**Phase 3 (Growth):**
- [ ] Explorar full library + narrated stories
- [ ] Church groups + leaderboard
- [ ] Annual Wrapped card
- [ ] Push notification smart copy
- [ ] Spotify/YouTube embeds in Explorar

---

## Navigation Flow

```
App open
  └── Onboarding (first time) → select pace → set notification → login/register
  └── Tab 1: Hoje (/hoje)
        ├── Streak + horizon calendar
        ├── "Ler agora" → /leitura (Bible reader)
        │     └── Read → tap "Concluído"
        ├── Devotional unlocks (text free / audio Pro)
        ├── Mood selector → content card
        └── Versículo do dia → share
  └── Tab 2: Jornada (/jornada)
        ├── Completion ring + book grid
        ├── Tap book → chapter checklist
        └── Pace selector → paywall if free
  └── Tab 3: Explorar (/explorar)
        ├── Category horizontal scroll
        ├── Content cards (text free / audio Pro)
        └── Mood shortcut pills
  └── Tab 4: Perfil (/perfil)
        ├── Stats + streak heatmap
        ├── Groups (Pro)
        ├── Journal
        └── Upgrade CTA
```
