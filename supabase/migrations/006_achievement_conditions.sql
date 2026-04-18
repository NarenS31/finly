set search_path = public;

create or replace function check_and_award_achievements(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lessons_completed int;
  v_streak int;
  v_xp int;
  v_achievement record;
  v_earned boolean;
  v_newly_earned uuid[] := '{}';
  v_daily_lessons int;
begin
  -- Base stats
  select
    (select count(*) from lesson_progress where user_id = p_user_id and status = 'completed'),
    streak_current,
    xp
  into v_lessons_completed, v_streak, v_xp
  from profiles where id = p_user_id;

  -- Lessons completed today
  select count(*) into v_daily_lessons
  from lesson_progress
  where user_id = p_user_id
    and status = 'completed'
    and completed_at::date = current_date;

  -- Loop achievements
  for v_achievement in select * from achievements loop

    continue when exists (
      select 1 from user_achievements
      where user_id = p_user_id and achievement_id = v_achievement.id
    );

    v_earned := false;

    if v_achievement.condition_type = 'lessons_completed' then
      v_earned := v_lessons_completed >= v_achievement.condition_value;

    elsif v_achievement.condition_type = 'streak_days' then
      v_earned := v_streak >= v_achievement.condition_value;

    elsif v_achievement.condition_type = 'daily_lessons' then
      v_earned := v_daily_lessons >= v_achievement.condition_value;

    elsif v_achievement.condition_type = 'quiz_perfect' then
      v_earned := exists (
        select 1 from lesson_progress
        where user_id = p_user_id
          and quiz_score = 100
      );

    elsif v_achievement.condition_type = 'topic_complete' then
      -- Check if user has completed ALL published lessons in any single topic
      v_earned := exists (
        select 1
        from (
          select
            l.topic,
            count(*) as total,
            count(lp.id) filter (where lp.status = 'completed') as completed
          from lessons l
          left join lesson_progress lp
            on lp.lesson_id = l.id and lp.user_id = p_user_id
          where l.published = true
          group by l.topic
        ) topic_stats
        where completed >= total and total > 0
      );

    elsif v_achievement.condition_type = 'lesson_perfect' then
      -- Completed a lesson AND scored 100% on the quiz
      v_earned := exists (
        select 1 from lesson_progress
        where user_id = p_user_id
          and status = 'completed'
          and quiz_score = 100
          and quiz_total > 0
          and quiz_correct = quiz_total
      );

    elsif v_achievement.condition_type = 'currency_switch' then
      -- Profile has a non-default currency set
      v_earned := exists (
        select 1 from profiles
        where id = p_user_id
          and currency_code != 'USD'
      );

    elsif v_achievement.condition_type = 'lesson_shared' then
      v_earned := exists (
        select 1 from lesson_shares
        where user_id = p_user_id
      );
    end if;

    if v_earned then
      insert into user_achievements (user_id, achievement_id)
      values (p_user_id, v_achievement.id)
      on conflict do nothing;

      update profiles
      set xp = xp + coalesce(v_achievement.xp_bonus, 25)
      where id = p_user_id;

      v_newly_earned := array_append(v_newly_earned, v_achievement.id);
    end if;

  end loop;

  return jsonb_build_object(
    'newly_earned', coalesce(
      (
        select jsonb_agg(jsonb_build_object(
          'id', a.id,
          'title', a.title,
          'description', a.description
        ))
        from achievements a
        where a.id = any(v_newly_earned)
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create table if not exists lesson_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_slug text not null,
  shared_at timestamptz default now()
);

alter table lesson_shares enable row level security;

drop policy if exists "Users can manage own shares" on lesson_shares;
create policy "Users can manage own shares"
  on lesson_shares for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert on lesson_shares to authenticated;
grant execute on function check_and_award_achievements(uuid) to authenticated;
