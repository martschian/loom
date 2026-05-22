alter table public.scenes
  add column pov_character_id text references public.characters(id) on delete set null;
