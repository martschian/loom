-- One narrative arc per character (app enforces single arc in v1)
create table public.character_arcs (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  title text not null default '',
  summary text not null default '',
  sort_order integer not null default 0
);

create unique index character_arcs_character_id_idx
  on public.character_arcs (character_id);

create table public.arc_beats (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid not null references public.character_arcs (id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create index arc_beats_arc_id_idx on public.arc_beats (arc_id);

create table public.scene_arc_events (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes (id) on delete cascade,
  character_id uuid not null references public.characters (id) on delete cascade,
  beat_id uuid references public.arc_beats (id) on delete set null,
  note text not null default '',
  sort_order integer not null default 0
);

create index scene_arc_events_scene_id_idx
  on public.scene_arc_events (scene_id);

alter table public.character_arcs enable row level security;
alter table public.arc_beats enable row level security;
alter table public.scene_arc_events enable row level security;

create policy "Users can manage character_arcs in own projects"
  on public.character_arcs for all
  using (
    exists (
      select 1
      from public.characters c
      join public.projects p on p.id = c.project_id
      where c.id = character_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.characters c
      join public.projects p on p.id = c.project_id
      where c.id = character_id and p.user_id = auth.uid()
    )
  );

create policy "Users can manage arc_beats in own projects"
  on public.arc_beats for all
  using (
    exists (
      select 1
      from public.character_arcs a
      join public.characters c on c.id = a.character_id
      join public.projects p on p.id = c.project_id
      where a.id = arc_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.character_arcs a
      join public.characters c on c.id = a.character_id
      join public.projects p on p.id = c.project_id
      where a.id = arc_id and p.user_id = auth.uid()
    )
  );

create policy "Users can manage scene_arc_events in own projects"
  on public.scene_arc_events for all
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

alter table public.scenes drop column mood;
