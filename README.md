# Draft Day Board — Monster Maniacs

A single-purpose PWA for the Monster Maniacs fantasy football league to vote on a draft date. Drop the link in the group chat, everyone picks their team, taps "I'm in" on dates that work — results update live for everyone.

**Draft time is fixed at 8:00 PM ET** for all candidate dates.

---

## Stack

- **React 19 + Vite + TypeScript**
- **Tailwind CSS** — custom theme with felt-green, card-cream, trophy-gold palette
- **Supabase** — Postgres + Realtime (no Auth)
- **vite-plugin-pwa** — service worker, manifest, offline app shell
- **Vercel** — hosting with preview deploys per branch

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works fine)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd monstersdraft
npm install
```

### 2. Create the Supabase tables

Run the migration SQL against your Supabase project:

1. Go to your Supabase dashboard → **SQL Editor**
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

This creates the `board`, `candidate_dates`, and `votes` tables with RLS policies and Realtime enabled.

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase dashboard → **Settings → API**.

### 4. Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

Output in `dist/` — ready for Vercel or any static host.

---

## Deploy to Vercel

1. Push the repo to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Vite and builds with `npm run build`

Preview deploys work automatically per PR/branch.

---

## Supabase Realtime setup

The migration enables Realtime on all three tables via:

```sql
alter publication supabase_realtime add table board;
alter publication supabase_realtime add table candidate_dates;
alter publication supabase_realtime add table votes;
```

If Realtime isn't working after running the migration, verify in your Supabase dashboard → **Database → Replication** that the `supabase_realtime` publication includes these tables.

---

## Schema design

| Table | Purpose |
|-------|---------|
| `board` | Single row (id=1, enforced by check constraint). Holds the editable title. |
| `candidate_dates` | Each proposed draft date. Has `date` (DATE) and optional `label` (text). |
| `votes` | Maps a team name to a candidate date. Unique constraint on `(candidate_date_id, team_name)` enforces one vote per team per date. |

### Enforcement without auth

- **One vote per team per date**: `UNIQUE (candidate_date_id, team_name)` — the database rejects duplicates regardless of client behavior.
- **Valid team names only**: `CHECK` constraint on `votes.team_name` accepts only the 12 roster names. Invalid names are rejected at the DB level.
- **Cascade deletes**: Removing a candidate date cascades to its votes (though the UI only allows removal of zero-vote dates).

---

## Trade-offs & known limitations

### No authentication

Anyone with the link can vote as any team. This is by design — it's a private group-chat tool for 12 known people, not a public poll. The fixed roster dropdown prevents typo-fragmentation, and the unique constraint prevents double-votes, but there's no verification that the person selecting "Fat Bastards" is actually the Fat Bastards owner.

**Mitigation**: The link is only shared in the league group chat. If someone votes as the wrong team, the real owner can toggle it off and re-vote.

### No role-based access

Any participant can:
- Edit the board title
- Add candidate dates
- Remove candidate dates (only if zero votes)

There's no "commissioner-only" gating. The zero-vote guard on removal is the only protection against destructive actions.

### Optimistic updates

Votes and removals apply immediately in the local UI before the server confirms. If the server rejects (network error, constraint violation), the UI rolls back. In rare race conditions, Realtime events reconcile state within ~1 second.

### Offline limitations

The PWA caches the app shell (HTML, CSS, JS, fonts) for offline loading, but voting requires network connectivity to reach Supabase. The board shows a loading/error state if the connection fails.

---

## Fixed roster

```
Fat Bastards
ArtistFormerlyKnown
Little Hammers
PIMPs
Slingin' Salamis
Spirtles
The Red Hot Chili Pukas
Yellowbellies
Son of Pubis
Thug Lyfe
Robby's Fire
Skat Pack
```

---

## Project structure

```
src/
├── components/
│   ├── AddDateForm.tsx      — date picker + label input
│   ├── Board.tsx            — main board layout, wires up useBoard hook
│   ├── DateCard.tsx         — individual date card with vote button
│   ├── EditableTitle.tsx    — click-to-edit board title
│   ├── LeadingContenderBanner.tsx — top banner showing front-runner
│   └── TeamSelector.tsx     — team selection on first visit
├── hooks/
│   └── useBoard.ts          — Supabase CRUD + Realtime subscriptions
├── lib/
│   ├── database.types.ts    — typed Supabase schema
│   └── supabase.ts          — Supabase client init
├── constants.ts             — team roster, league size, draft time
├── types.ts                 — shared TypeScript interfaces
├── App.tsx                  — routing between team select and board
├── main.tsx                 — React entry point
└── index.css                — Tailwind directives + base styles
```

---

## Deviations from spec

None. All v1 features implemented as specified:
- Fixed 12-team roster dropdown (no free text)
- Leading contender banner with "still waiting on" team names
- All-12-in distinct state
- Date removal blocked when votes exist
- Editable board title
- Realtime via Supabase postgres_changes
- PWA installable with offline app shell
- Mobile-first at 375px with 44px touch targets
