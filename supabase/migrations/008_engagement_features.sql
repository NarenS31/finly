-- Engagement features: daily challenges, streak shields, polls, money goals, avatars

-- Generic XP award helper (used by daily challenge, polls, etc.)
create or replace function award_xp(p_user_id uuid, p_xp int)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total int;
  v_old_level text;
  v_new_level text;
begin
  select level into v_old_level from profiles where id = p_user_id;
  update profiles set xp = xp + p_xp, updated_at = now()
  where id = p_user_id returning xp into v_total;
  v_new_level := case
    when v_total >= 1500 then 'Money Master'
    when v_total >= 700  then 'Finance Pro'
    when v_total >= 300  then 'Investor'
    when v_total >= 100  then 'Saver'
    else 'Beginner'
  end;
  update profiles set level = v_new_level, updated_at = now() where id = p_user_id;
  return jsonb_build_object('xp_awarded', p_xp, 'total_xp', v_total, 'new_level', v_new_level, 'leveled_up', v_new_level is distinct from v_old_level);
end;
$$;

-- ─── Streak Shields ──────────────────────────────────────────────────────────
-- Add streak_shields column to profiles (how many shields the user has)
alter table profiles add column if not exists streak_shields int default 0;
-- Add avatar JSONB column - stores { hat, shirt, accessory } item IDs
alter table profiles add column if not exists avatar jsonb default '{"hat":null,"shirt":null,"accessory":null}'::jsonb;

-- ─── Daily Challenges ────────────────────────────────────────────────────────
create table if not exists daily_challenges (
  id          uuid primary key default gen_random_uuid(),
  date        date unique not null,
  question    text not null,
  options     text[] not null,
  correct     int not null,          -- 0-based index into options
  explanation text not null,
  xp_reward   int default 10,
  created_at  timestamptz default now()
);

create table if not exists daily_challenge_completions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete cascade,
  challenge_id  uuid references daily_challenges(id) on delete cascade,
  chosen        int not null,        -- which option user picked (0-based)
  correct       boolean not null,
  completed_at  timestamptz default now(),
  unique(user_id, challenge_id)
);

create index if not exists idx_dc_completions_user on daily_challenge_completions(user_id);

-- Seed a rolling 14-day batch of challenges so there's always content
insert into daily_challenges (date, question, options, correct, explanation, xp_reward) values
  (current_date - 13, 'You get $20 for your birthday. The smartest move is…',
   ARRAY['Spend it all on snacks','Put $15 in savings and spend $5','Lend it to a friend', 'Ignore it'],
   1, 'Saving most and spending a small allowance builds the saving habit early.', 10),
  (current_date - 12, 'What does "interest" mean when you save money?',
   ARRAY['A fee the bank charges you','Extra money the bank pays you for saving','A type of loan','A government tax'],
   1, 'Banks pay you interest as a reward for leaving your money with them.', 10),
  (current_date - 11, 'Which of these is a "want" rather than a "need"?',
   ARRAY['Lunch at school','A new video game','Winter coat','Bus fare'],
   1, 'Wants are extras — nice to have but not essential to survive.', 10),
  (current_date - 10, 'If you save $5 every week, how much will you have after 10 weeks?',
   ARRAY['$50','$40','$55','$45'],
   0, '$5 × 10 weeks = $50. Consistent saving adds up fast!', 10),
  (current_date - 9, 'A budget is a plan for…',
   ARRAY['Spending as much as possible','Tracking and deciding how to use your money','Borrowing money from a bank','Investing in stocks'],
   1, 'A budget helps you control where your money goes before you spend it.', 10),
  (current_date - 8, 'What happens to your money with compound interest over time?',
   ARRAY['It stays the same','It decreases slowly','It grows faster and faster','It gets taxed away'],
   2, 'Compound interest means you earn interest on your interest — a snowball effect!', 10),
  (current_date - 7, 'You want to buy headphones that cost $60. You save $10/week. How many weeks?',
   ARRAY['5','6','7','8'],
   1, '$60 ÷ $10 = 6 weeks. Setting a goal and timeline makes saving concrete.', 10),
  (current_date - 6, 'What is a "credit score"?',
   ARRAY['How much money you have in the bank','A number showing how trustworthy you are to repay debt','Your school grade for finance class','The amount you can borrow today'],
   1, 'Credit scores range 300–850 and are based on your repayment history.', 10),
  (current_date - 5, 'Which account is best for emergency savings?',
   ARRAY['Checking account','High-yield savings account','Investment account','Credit card'],
   1, 'High-yield savings keeps money accessible while earning more interest than checking.', 10),
  (current_date - 4, 'Inflation means prices over time generally…',
   ARRAY['Go down','Stay the same','Go up','Become free'],
   2, 'Inflation erodes buying power — $10 today buys less than $10 in 10 years.', 10),
  (current_date - 3, 'You earn $100 and spend $80. Your savings rate is…',
   ARRAY['80%','20%','10%','40%'],
   1, '($100 − $80) ÷ $100 = 20%. Saving even 20% of income is a great habit.', 10),
  (current_date - 2, 'Diversification in investing means…',
   ARRAY['Putting all money in one hot stock','Spreading money across various investments','Only buying government bonds','Keeping cash under your mattress'],
   1, 'Spreading investments reduces risk — if one falls, the others can offset it.', 10),
  (current_date - 1, 'A debit card takes money directly from your…',
   ARRAY['Future paycheck','Credit line','Checking or savings account','Investment portfolio'],
   2, 'Debit = your own money immediately. Credit = borrowed money to repay later.', 10),
  (current_date,      'The 50/30/20 rule splits income into needs/wants/savings. What % goes to savings?',
   ARRAY['50%','30%','20%','10%'],
   2, '20% of take-home pay goes to savings and debt repayment in this popular framework.', 10)
on conflict (date) do nothing;

-- ─── What Would You Do Polls ─────────────────────────────────────────────────
create table if not exists polls (
  id          uuid primary key default gen_random_uuid(),
  week_start  date unique not null,   -- Monday of that week
  question    text not null,
  options     text[] not null,
  created_at  timestamptz default now()
);

create table if not exists poll_votes (
  id          uuid primary key default gen_random_uuid(),
  poll_id     uuid references polls(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  option_idx  int not null,
  voted_at    timestamptz default now(),
  unique(poll_id, user_id)
);

create index if not exists idx_poll_votes_poll on poll_votes(poll_id);

-- Seed some weeks of polls
insert into polls (week_start, question, options) values
  (date_trunc('week', current_date)::date,
   'You find $20 on the ground with no one around. What do you do?',
   ARRAY['Keep it and save it','Buy yourself something fun','Donate it to charity','Turn it in to lost & found']),
  (date_trunc('week', current_date)::date - 7,
   'Your friend wants to borrow $50. What do you do?',
   ARRAY['Lend it — no questions asked','Lend it but ask when they''ll repay','Offer a smaller amount','Say no politely']),
  (date_trunc('week', current_date)::date - 14,
   'You get a part-time job. First paycheck — what first?',
   ARRAY['Save at least half','Buy something I''ve been wanting','Split it evenly: save & spend','Pay off any debt first'])
on conflict (week_start) do nothing;

-- ─── Money Goals ─────────────────────────────────────────────────────────────
create table if not exists money_goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete cascade,
  title         text not null,
  target_amount numeric(10,2) not null,
  saved_amount  numeric(10,2) default 0,
  currency_code text default 'USD',
  target_date   date,
  completed     boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_money_goals_user on money_goals(user_id);

-- RLS
alter table daily_challenge_completions enable row level security;
create policy "users can read own completions"       on daily_challenge_completions for select using (auth.uid() = user_id);
create policy "users can insert own completions"     on daily_challenge_completions for insert with check (auth.uid() = user_id);

alter table poll_votes enable row level security;
create policy "users can read all poll votes"        on poll_votes for select using (true);
create policy "users can insert own poll vote"       on poll_votes for insert with check (auth.uid() = user_id);

alter table money_goals enable row level security;
create policy "users can manage own goals"           on money_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table polls enable row level security;
create policy "polls are public"                     on polls for select using (true);

alter table daily_challenges enable row level security;
create policy "daily challenges are public"          on daily_challenges for select using (true);
