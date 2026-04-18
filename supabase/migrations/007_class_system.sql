-- Classes created by teachers
create table classes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,             -- 6-char uppercase code e.g. "FIN42X"
  name text not null,                    -- e.g. "Period 3 Economics"
  teacher_id uuid references profiles(id) on delete cascade,
  age_tier text check (age_tier in ('8-12', '13-17')) default '13-17',
  created_at timestamptz default now(),
  archived_at timestamptz               -- soft delete
);

-- Students who have joined a class
create table class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(class_id, user_id)
);

-- RLS
alter table classes enable row level security;
alter table class_members enable row level security;

-- Teachers can manage their own classes
create policy "Teachers manage own classes"
  on classes for all using (auth.uid() = teacher_id);

-- Anyone can read a class by code (for joining)
create policy "Anyone can read class by code"
  on classes for select using (true);

-- Members can read their own memberships
create policy "Users manage own memberships"
  on class_members for all using (auth.uid() = user_id);

-- Teachers can read memberships for their classes
create policy "Teachers read class memberships"
  on class_members for select using (
    exists (
      select 1 from classes
      where classes.id = class_members.class_id
        and classes.teacher_id = auth.uid()
    )
  );

-- Function: generate a unique 6-char class code
create or replace function generate_class_code()
returns text
language plpgsql
as $$
declare
  v_code text;
  v_exists boolean;
begin
  loop
    -- Generate random 6-char uppercase alphanumeric code
    v_code := upper(substring(md5(random()::text) from 1 for 6));
    -- Check uniqueness
    select exists(select 1 from classes where code = v_code) into v_exists;
    exit when not v_exists;
  end loop;
  return v_code;
end;
$$;

-- Function: get class dashboard data for a teacher
create or replace function get_class_dashboard(p_class_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_class classes;
  v_member_count int;
  v_member_data jsonb;
  v_topic_data jsonb;
begin
  -- Verify caller is the teacher
  select * into v_class from classes where id = p_class_id;
  if v_class.teacher_id != auth.uid() then
    raise exception 'Unauthorized';
  end if;

  -- Member count
  select count(*) into v_member_count
  from class_members where class_id = p_class_id;

  -- Per-member progress summary
  select jsonb_agg(
    jsonb_build_object(
      'user_id', p.id,
      'display_name', p.display_name,
      'xp', p.xp,
      'level', p.level,
      'streak', p.streak_current,
      'lessons_completed', (
        select count(*) from lesson_progress lp
        where lp.user_id = p.id and lp.status = 'completed'
      ),
      'last_active', p.last_active_date
    )
  ) into v_member_data
  from class_members cm
  join profiles p on p.id = cm.user_id
  where cm.class_id = p_class_id;

  -- Topic completion across whole class
  select jsonb_agg(
    jsonb_build_object(
      'topic', topic,
      'avg_completion', avg_pct
    )
  ) into v_topic_data
  from (
    select
      l.topic,
      round(
        avg(
          case when lp.status = 'completed' then 100 else 0 end
        )
      ) as avg_pct
    from lessons l
    cross join class_members cm
    left join lesson_progress lp
      on lp.lesson_id = l.id and lp.user_id = cm.user_id
    where cm.class_id = p_class_id
      and l.published = true
    group by l.topic
  ) topic_stats;

  return jsonb_build_object(
    'class', row_to_json(v_class),
    'member_count', v_member_count,
    'members', coalesce(v_member_data, '[]'::jsonb),
    'topic_stats', coalesce(v_topic_data, '[]'::jsonb)
  );
end;
$$;
