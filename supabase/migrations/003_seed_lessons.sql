insert into lessons (slug, title, description, topic, age_tier, difficulty, estimated_minutes, order_index, xp_reward, key_takeaways, published) values
  (
    'needs-vs-wants',
    'Needs vs Wants',
    'Learn to tell the difference so every dollar has a purpose.',
    'budgeting',
    '8-12',
    'beginner',
    6,
    1,
    10,
    array[
      'Needs are things you must have to survive',
      'Wants are things that would be nice but are not essential',
      'Telling them apart helps you make smarter choices with money'
    ],
    true
  ),
  (
    'compound-interest',
    'Compound Interest',
    'Why time is the most powerful part of growing money.',
    'saving',
    '13-17',
    'beginner',
    10,
    2,
    15,
    array[
      'Compound interest makes your money grow faster over time',
      'Starting early is more powerful than saving more later',
      'Compound interest also works against you in debt'
    ],
    true
  ),
  (
    'how-banks-work',
    'How Banks Work',
    'What happens after you deposit, and how banks earn while keeping your money safe.',
    'banking',
    '13-17',
    'beginner',
    8,
    3,
    10,
    array[
      'Banks make money by lending yours out at a higher rate',
      'Your money is usually insured up to a limit',
      'Different account types serve different purposes'
    ],
    true
  ),
  (
    'the-50-30-20-rule',
    'The 50/30/20 Rule',
    'A simple way to split income between needs, wants, and future you.',
    'budgeting',
    '13-17',
    'beginner',
    8,
    4,
    10,
    array[
      '50% of income on needs, 30% on wants, 20% on savings is a proven starting point',
      'Budgeting is not about restricting fun — it is about being intentional',
      'You can adapt the rule to your situation'
    ],
    true
  ),
  (
    'what-is-money',
    'What Is Money?',
    'From barter to digital wallets — why money exists and how it moves.',
    'money_basics',
    '8-12',
    'beginner',
    5,
    5,
    8,
    array[
      'Money is a tool we invented to make trading easier',
      'You earn money by doing work or providing value',
      'Money has value because we all agree it does'
    ],
    true
  )
on conflict (slug) do nothing;
