alter table public.characters
  add column age text not null default '',
  add column pronouns text not null default '',
  add column relationships text not null default '',
  add column traits text[] not null default '{}';
