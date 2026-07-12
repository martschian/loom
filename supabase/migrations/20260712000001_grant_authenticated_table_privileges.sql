-- authenticated is missing base table grants on public.* (only public.profiles
-- had a partial grant added, and only for anon). Without an explicit GRANT,
-- Postgres blocks the query with 42501 "permission denied for table X" before
-- RLS is even evaluated, regardless of how permissive the policies are — this
-- is why logged-in users get 403 on every request (list/select AND insert).
-- RLS policies already fully restrict rows to the owning user; these grants
-- only allow the queries to run at all, mirroring the reasoning in
-- 20250708000001_grant_anon_select_profiles.sql.
grant usage on schema public to authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.locations to authenticated;
grant select, insert, update, delete on public.scenes to authenticated;
grant select, insert, update, delete on public.scene_characters to authenticated;
grant select, insert, update, delete on public.character_arcs to authenticated;
grant select, insert, update, delete on public.arc_beats to authenticated;
grant select, insert, update, delete on public.scene_arc_events to authenticated;
