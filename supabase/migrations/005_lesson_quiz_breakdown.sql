-- Optional breakdown for lesson quiz display (9/10) and analytics
alter table lesson_progress
  add column if not exists quiz_correct int,
  add column if not exists quiz_total int;

comment on column lesson_progress.quiz_correct is 'Number of correct answers when quiz_score was recorded';
comment on column lesson_progress.quiz_total is 'Total questions when quiz_score was recorded';
