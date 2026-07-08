-- The anon role is missing SELECT on profiles, causing 42501 "permission
-- denied for table profiles" on any unauthenticated request (e.g. the CI
-- keepalive ping). RLS ("auth.uid() = id") still fully protects the data —
-- anon has no auth.uid(), so this grant only allows the query to execute,
-- never returns another user's row.
grant select on public.profiles to anon;
