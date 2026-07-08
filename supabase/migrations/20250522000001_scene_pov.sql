alter table public.scenes
  add column pov_character_id uuid references public.characters(id) on delete set null;
