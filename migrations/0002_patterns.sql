create table if not exists necklace_patterns (
  id         text primary key,
  user_id    text not null,
  name       text not null,
  metal      text not null,
  length_in  integer not null,
  config     jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists necklace_patterns_user_id_idx on necklace_patterns (user_id);
