-- Profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  genre text not null default '',
  synopsis text not null default '',
  target_word_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects (user_id);

alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Characters
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  role text not null default '',
  color text not null,
  summary text not null default ''
);

create index characters_project_id_idx on public.characters (project_id);

alter table public.characters enable row level security;

create policy "Users can manage characters in own projects"
  on public.characters for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

-- Locations
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  color text not null,
  summary text not null default ''
);

create index locations_project_id_idx on public.locations (project_id);

alter table public.locations enable row level security;

create policy "Users can manage locations in own projects"
  on public.locations for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

-- Scenes
create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  summary text not null default '',
  location_id uuid references public.locations (id) on delete set null,
  mood text not null default '',
  word_count integer not null default 0,
  sort_order integer not null default 0
);

create index scenes_project_id_idx on public.scenes (project_id);

alter table public.scenes enable row level security;

create policy "Users can manage scenes in own projects"
  on public.scenes for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

-- Scene characters (junction)
create table public.scene_characters (
  scene_id uuid not null references public.scenes (id) on delete cascade,
  character_id uuid not null references public.characters (id) on delete cascade,
  primary key (scene_id, character_id)
);

alter table public.scene_characters enable row level security;

create policy "Users can manage scene_characters in own projects"
  on public.scene_characters for all
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

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
