-- Draft Day Board schema
-- Single-league, no-auth design

-- Board settings (single row, enforced by check constraint)
create table board (
  id int primary key default 1 check (id = 1),
  title text not null default 'Draft Day Board',
  updated_at timestamptz not null default now()
);

-- Seed the single board row
insert into board (id, title) values (1, 'Draft Day Board');

-- Candidate dates proposed for the draft
create table candidate_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  label text,
  created_at timestamptz not null default now()
);

-- Votes: one per team per candidate date (enforced by unique constraint)
-- team_name is one of the 12 fixed roster names, enforced by check constraint
create table votes (
  id uuid primary key default gen_random_uuid(),
  candidate_date_id uuid not null references candidate_dates(id) on delete cascade,
  team_name text not null check (team_name in (
    'Fat Bastards',
    'ArtistFormerlyKnown',
    'Little Hammers',
    'PIMPs',
    'Slingin'' Salamis',
    'Spirtles',
    'The Red Hot Chili Pukas',
    'Yellowbellies',
    'Son of Pubis',
    'Thug Lyfe',
    'Robby''s Fire',
    'Skat Pack'
  )),
  created_at timestamptz not null default now(),
  unique (candidate_date_id, team_name)
);

-- Index for fast vote lookups by candidate date
create index idx_votes_candidate_date on votes(candidate_date_id);

-- Enable Row Level Security (required for Supabase public access)
alter table board enable row level security;
alter table candidate_dates enable row level security;
alter table votes enable row level security;

-- RLS policies: fully open (no auth, public board)
-- Anyone can read and write everything. The trade-off is documented in README.
create policy "Public read board" on board for select using (true);
create policy "Public update board" on board for update using (true);

create policy "Public read dates" on candidate_dates for select using (true);
create policy "Public insert dates" on candidate_dates for insert with check (true);
create policy "Public delete dates" on candidate_dates for delete using (true);

create policy "Public read votes" on votes for select using (true);
create policy "Public insert votes" on votes for insert with check (true);
create policy "Public delete votes" on votes for delete using (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table board;
alter publication supabase_realtime add table candidate_dates;
alter publication supabase_realtime add table votes;

-- Function to update board.updated_at on title change
create or replace function update_board_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger board_updated_at
  before update on board
  for each row
  execute function update_board_timestamp();
