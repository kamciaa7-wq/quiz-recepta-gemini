create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  answers jsonb,
  score int default 0,
  duration_ms int,
  completed boolean default false,
  notified boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_quiz_attempts_rank on quiz_attempts(score desc, duration_ms asc);
