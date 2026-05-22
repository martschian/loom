-- Character arc summary (freeform prose)
alter table public.characters
  add column arc_summary text not null default '';

-- Per-character moments within a scene
create table public.scene_character_moments (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes (id) on delete cascade,
  character_id uuid not null references public.characters (id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create index scene_character_moments_scene_id_idx
  on public.scene_character_moments (scene_id);

alter table public.scene_character_moments enable row level security;

create policy "Users can manage scene_character_moments in own projects"
  on public.scene_character_moments for all
  using (
    exists (
      select 1
      from public.scenes s
      join public.projects p on p.id = s.project_id
      where s.id = scene_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.scenes s
      join public.projects p on p.id = s.project_id
      where s.id = scene_id and p.user_id = auth.uid()
    )
  );

-- Remove scene-level mood
alter table public.scenes drop column mood;
