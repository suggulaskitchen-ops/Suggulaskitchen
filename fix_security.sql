-- 1. Lock down the business table to Admins only for editing
drop policy if exists "Admins can write business content" on public.business;
create policy "Admins can write business content"
on public.business
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 2. Lock down the gallery table to Admins only for editing
drop policy if exists "Admins can manage gallery records" on public.gallery;
create policy "Admins can manage gallery records"
on public.gallery
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 3. Make the gallery storage bucket completely Public
update storage.buckets
set public = true
where id = 'gallery';
