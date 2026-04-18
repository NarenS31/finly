-- Finly initial schema (fresh install)
create extension if not exists pgcrypto;

-- Drop legacy objects if re-running locally.
-- Do not DROP TRIGGER on tables here: on a fresh DB those relations do not exist yet (42P01).
-- CASCADE on tables removes triggers; then functions can be dropped.
drop table if exists calculator_uses cascade;
drop table if exists user_achievements cascade;
drop table if exists quiz_answers cascade;
drop table if exists lesson_progress cascade;
drop table if exists achievements cascade;
drop table if exists lessons cascade;
drop table if exists platform_stats cascade;
drop table if exists profiles cascade;

drop function if exists increment_lesson_count() cascade;
drop function if exists increment_user_count() cascade;

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  age_tier text not null check (age_tier in ('8-12', '13-17')),
  currency_code text default 'USD',
  onboarding_complete boolean default false,
  xp int default 0,
  level text default 'Beginner',
  streak_current int default 0,
  streak_longest int default 0,
  last_active_date date,
  email_notify_streak boolean default true,
  email_notify_weekly boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  topic text not null,
  age_tier text not null check (age_tier in ('8-12', '13-17', 'both')),
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_minutes int,
  order_index int,
  xp_reward int default 10,
  key_takeaways text[],
  published boolean default false,
  created_at timestamptz default now()
);

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  status text check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
  scroll_progress float default 0,
  quiz_score int,
  time_spent_seconds int default 0,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

create table quiz_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  question_index int,
  selected_answer int,
  is_correct boolean,
  answered_at timestamptz default now()
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon_svg text,
  condition_type text,
  condition_value int,
  xp_bonus int default 25
);

create table user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  achievement_id uuid references achievements(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

create table calculator_uses (
  id uuid primary key default gen_random_uuid(),
  calculator_type text not null,
  currency_code text,
  age_tier text,
  used_at timestamptz default now()
);

create table platform_stats (
  id int primary key default 1,
  total_users int default 0,
  total_countries int default 0,
  total_lessons_completed int default 0,
  updated_at timestamptz default now()
);

insert into platform_stats (id, total_users, total_countries, total_lessons_completed)
values (1, 3200, 47, 12400)
on conflict (id) do nothing;

alter table profiles enable row level security;
alter table lessons enable row level security;
alter table lesson_progress enable row level security;
alter table quiz_answers enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table platform_stats enable row level security;
alter table calculator_uses enable row level security;

create policy "Users can manage own profile"
  on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Lessons are public"
  on lessons for select using (published = true);

create policy "Users can manage own progress"
  on lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own quiz answers"
  on quiz_answers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Achievements readable"
  on achievements for select using (true);

create policy "Users can read own achievements"
  on user_achievements for select using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on user_achievements for insert with check (auth.uid() = user_id);

create policy "Stats are public"
  on platform_stats for select using (true);

create policy "Anyone can log calculator use"
  on calculator_uses for insert with check (true);

create or replace function increment_user_count()
returns trigger language plpgsql as $$
begin
  update platform_stats set total_users = total_users + 1, updated_at = now() where id = 1;
  return new;
end;
$$;

create trigger on_new_user
  after insert on profiles
  for each row execute function increment_user_count();

create or replace function increment_lesson_count()
returns trigger language plpgsql as $$
begin
  if new.status = 'completed' and (tg_op = 'INSERT' or coalesce(old.status, '') <> 'completed') then
    update platform_stats set total_lessons_completed = total_lessons_completed + 1, updated_at = now() where id = 1;
  end if;
  return new;
end;
$$;

create trigger on_lesson_complete
  after insert or update on lesson_progress
  for each row execute function increment_lesson_count();
