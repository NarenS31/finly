-- XP award + achievement checks (security definer RPCs)

set search_path = public;

-- Award XP when a lesson is first marked complete (caller must ensure not duplicate)
create or replace function award_lesson_xp(
  p_user_id uuid,
  p_lesson_id uuid,
  p_quiz_score int default 0,
  p_quiz_total int default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_xp_reward int;
  v_xp_bonus int := 0;
  v_total_xp int;
  v_old_level text;
  v_new_level text;
  v_awarded int;
begin
  select coalesce(xp_reward, 10) into v_xp_reward from lessons where id = p_lesson_id;

  if p_quiz_total > 0 then
    v_xp_bonus := p_quiz_score;
    if p_quiz_score = p_quiz_total then
      v_xp_bonus := v_xp_bonus + 5;
    end if;
  end if;

  v_awarded := v_xp_reward + v_xp_bonus;

  select level into v_old_level from profiles where id = p_user_id;

  update profiles
  set
    xp = xp + v_awarded,
    updated_at = now()
  where id = p_user_id
  returning xp into v_total_xp;

  v_new_level := case
    when v_total_xp >= 1500 then 'Money Master'
    when v_total_xp >= 700 then 'Finance Pro'
    when v_total_xp >= 300 then 'Investor'
    when v_total_xp >= 100 then 'Saver'
    else 'Beginner'
  end;

  update profiles set level = v_new_level where id = p_user_id;

  return jsonb_build_object(
    'xp_awarded', v_awarded,
    'total_xp', v_total_xp,
    'new_level', v_new_level,
    'leveled_up', v_new_level is distinct from v_old_level
  );
end;
$$;

create or replace function check_and_award_achievements(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lessons_completed int;
  v_streak int;
  v_daily_lessons int;
  v_achievement record;
  v_earned boolean;
  v_newly_earned uuid[] := array[]::uuid[];
  v_has_perfect_quiz boolean;
begin
  select count(*)::int into v_lessons_completed
  from lesson_progress
  where user_id = p_user_id and status = 'completed';

  select streak_current into v_streak from profiles where id = p_user_id;

  select count(*)::int into v_daily_lessons
  from lesson_progress
  where user_id = p_user_id
    and status = 'completed'
    and completed_at is not null
    and (completed_at at time zone 'utc')::date = (now() at time zone 'utc')::date;

  select exists (
    select 1 from lesson_progress
    where user_id = p_user_id and quiz_score is not null and quiz_score >= 100
  ) into v_has_perfect_quiz;

  for v_achievement in select * from achievements loop
    if exists (
      select 1 from user_achievements
      where user_id = p_user_id and achievement_id = v_achievement.id
    ) then
      continue;
    end if;

    v_earned := false;

    if v_achievement.condition_type = 'lessons_completed' and v_achievement.condition_value is not null then
      v_earned := v_lessons_completed >= v_achievement.condition_value;
    elsif v_achievement.condition_type = 'streak_days' and v_achievement.condition_value is not null then
      v_earned := coalesce(v_streak, 0) >= v_achievement.condition_value;
    elsif v_achievement.condition_type = 'daily_lessons' and v_achievement.condition_value is not null then
      v_earned := v_daily_lessons >= v_achievement.condition_value;
    elsif v_achievement.condition_type = 'quiz_perfect' then
      v_earned := v_has_perfect_quiz;
    end if;

    if v_earned then
      insert into user_achievements (user_id, achievement_id)
      values (p_user_id, v_achievement.id)
      on conflict (user_id, achievement_id) do nothing;

      update profiles
      set xp = xp + coalesce(v_achievement.xp_bonus, 25), updated_at = now()
      where id = p_user_id;

      v_newly_earned := array_append(v_newly_earned, v_achievement.id);
    end if;
  end loop;

  return jsonb_build_object(
    'newly_earned', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object('id', a.id, 'title', a.title, 'description', a.description)
          order by a.title
        )
        from achievements a
        where a.id = any(v_newly_earned)
      ),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function award_lesson_xp(uuid, uuid, int, int) to authenticated;
grant execute on function check_and_award_achievements(uuid) to authenticated;
