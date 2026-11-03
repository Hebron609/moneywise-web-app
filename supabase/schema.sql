-- ==============================================================================
-- MoneyWise SHS: Financial Literacy Platform (IT404 Group 4)
-- Supabase PostgreSQL Schema & Security Rules
-- Copy and run this entire file in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null default 'STUDENT' check (role in ('STUDENT', 'LECTURER', 'ADMIN')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Course Activity Progress Table
create table if not exists public.activity_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  activity_code text not null,
  status text not null default 'completed' check (status in ('not_started', 'in_progress', 'completed')),
  score numeric default 0,
  max_score numeric default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, activity_code)
);

-- 4. Quiz Attempts (Practice 10 Questions & Mastery 5 Questions)
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  quiz_type text not null check (quiz_type in ('practice_10', 'mastery_5')),
  score integer not null,
  max_score integer not null,
  passed boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Discussion Forum Threads
create table if not exists public.forum_threads (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  author_role text not null default 'STUDENT',
  title text not null,
  content text not null,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Discussion Forum Replies
create table if not exists public.forum_replies (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references public.forum_threads on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  author_role text not null default 'STUDENT',
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Collaborative Wiki Document
create table if not exists public.wiki_documents (
  id uuid default gen_random_uuid() primary key,
  group_name text not null default 'Demo Group A',
  title text not null default 'Group Savings Plan Wiki',
  content jsonb not null default '{}'::jsonb,
  last_edited_by text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Assignments (Group Savings Plan 06b & Individual Checklist 09)
create table if not exists public.assignment_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  user_name text not null,
  assignment_code text not null check (assignment_code in ('MWSHS-W3-GROUP-SUBMIT', 'MWSHS-W3-INDIVIDUAL')),
  group_name text,
  submission_content text not null,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'graded')),
  grade numeric,
  max_grade numeric not null default 4,
  feedback text,
  graded_by text,
  graded_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.activity_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.forum_threads enable row level security;
alter table public.forum_replies enable row level security;
alter table public.wiki_documents enable row level security;
alter table public.assignment_submissions enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- Activity Progress Policies
create policy "Users can view and manage their own activity progress"
  on public.activity_progress for all to authenticated using (auth.uid() = user_id);

create policy "Staff can view all student progress"
  on public.activity_progress for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('LECTURER', 'ADMIN')
    )
  );

-- Quiz Attempts Policies
create policy "Users can view their own quiz attempts"
  on public.quiz_attempts for all to authenticated using (auth.uid() = user_id);

create policy "Staff can view all quiz attempts for gradebook"
  on public.quiz_attempts for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('LECTURER', 'ADMIN')
    )
  );

-- Forum Policies
create policy "Everyone can view forum threads and replies"
  on public.forum_threads for select to authenticated using (true);
create policy "Everyone can view replies"
  on public.forum_replies for select to authenticated using (true);

create policy "Users can post forum threads"
  on public.forum_threads for insert to authenticated with check (auth.uid() = author_id);

create policy "Users can post replies"
  on public.forum_replies for insert to authenticated with check (auth.uid() = author_id);

-- Wiki Policies
create policy "Everyone can view and edit the group wiki"
  on public.wiki_documents for all to authenticated using (true);

-- Assignment Submissions Policies
create policy "Students can submit and view their own assignments"
  on public.assignment_submissions for all to authenticated using (auth.uid() = user_id);

create policy "Staff can view and grade all assignments"
  on public.assignment_submissions for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('LECTURER', 'ADMIN')
    )
  );

-- ==============================================================================
-- Auto Profile Creation Trigger on Auth Signup
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'STUDENT')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed starter forum thread
insert into public.forum_threads (id, author_id, author_name, author_role, title, content, is_pinned)
values (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'Augustine K. (Course Facilitator)',
  'LECTURER',
  'Welcome to Week 3: Pause Before You Pay Discussion',
  'Choose a fictional scam example from the lesson. In 2–3 sentences, explain one critical warning sign and the safe next step. Remember: never share real phone numbers or PINs in this forum.',
  true
) on conflict do nothing;

