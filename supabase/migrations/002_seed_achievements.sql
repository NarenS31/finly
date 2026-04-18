insert into achievements (slug, title, description, icon_svg, condition_type, condition_value, xp_bonus) values
  ('first_step', 'First Step', 'Complete your first lesson', null, 'lessons_completed', 1, 25),
  ('week_warrior', 'Week Warrior', '7-day learning streak', null, 'streak_days', 7, 25),
  ('month_master', 'Month Master', '30-day learning streak', null, 'streak_days', 30, 25),
  ('budget_boss', 'Budget Boss', 'Complete all Budgeting lessons', null, 'topic_complete', null, 25),
  ('compound_explorer', 'Compound Explorer', 'Complete compound interest + 100% quiz', null, 'lesson_perfect', null, 25),
  ('saver', 'Saver', 'Set first savings goal in calculator', null, 'savings_goal_set', 1, 25),
  ('global_citizen', 'Global Citizen', 'Change your currency setting', null, 'currency_switch', 1, 25),
  ('quiz_ace', 'Quiz Ace', 'Score 100% on any quiz', null, 'quiz_perfect', 100, 25),
  ('speed_learner', 'Speed Learner', 'Complete 3 lessons in one day', null, 'daily_lessons', 3, 25),
  ('sharing_caring', 'Sharing is Caring', 'Share a lesson with someone', null, 'lesson_shared', 1, 25),
  ('both_worlds', 'Both Worlds', 'Complete a lesson in both age tiers', null, 'both_tiers', 1, 25),
  ('finance_pro', 'Finance Pro', 'Complete 20 lessons', null, 'lessons_completed', 20, 25)
on conflict (slug) do nothing;
