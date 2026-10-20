-- Folio: one role per account, and the projects students file for review.
create table if not exists profiles (
  user_id text primary key,
  role text not null check (role in ('STUDENT', 'MENTOR')),
  display_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id serial primary key,
  student_id text not null references profiles (user_id),
  student_name text not null,
  student_email text not null,
  project_name text not null,
  github_url text not null,
  github_key text not null,
  demo_url text not null,
  description text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_id text
);

create unique index if not exists submissions_student_github_uidx
  on submissions (student_id, github_key);

create index if not exists submissions_status_created_idx
  on submissions (status, created_at desc);

create index if not exists submissions_student_created_idx
  on submissions (student_id, created_at desc);
