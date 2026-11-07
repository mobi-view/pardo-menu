create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.restaurant_settings (
  id boolean primary key default true check (id),
  name_ar text not null,
  name_en text,
  menu_title_ar text not null,
  menu_title_en text,
  menu_subtitle_ar text,
  menu_subtitle_en text,
  logo_url text,
  pattern_url text,
  currency_symbol text not null default '₪',
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  description_ar text,
  description_en text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  description_ar text,
  description_en text,
  price numeric(10,2) not null check (price >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.item_addons (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  price numeric(10,2) not null default 0 check (price >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index categories_sort_idx on public.categories (sort_order);
create index items_category_sort_idx on public.items (category_id, sort_order);
create index item_images_item_sort_idx on public.item_images (item_id, sort_order);
create index item_addons_item_sort_idx on public.item_addons (item_id, sort_order);

create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();

create trigger items_set_updated_at before update on public.items
for each row execute function public.set_updated_at();

create trigger restaurant_settings_set_updated_at before update on public.restaurant_settings
for each row execute function public.set_updated_at();

alter table public.admins enable row level security;
alter table public.restaurant_settings enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.item_images enable row level security;
alter table public.item_addons enable row level security;

create policy "admins read self" on public.admins
for select to authenticated using (user_id = auth.uid());

create policy "public read settings" on public.restaurant_settings
for select to anon, authenticated using (true);

create policy "admin manage settings" on public.restaurant_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read active categories" on public.categories
for select to anon, authenticated using (is_active);

create policy "admin manage categories" on public.categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read active items" on public.items
for select to anon, authenticated using (is_active);

create policy "admin manage items" on public.items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read item images" on public.item_images
for select to anon, authenticated using (true);

create policy "admin manage item images" on public.item_images
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read active addons" on public.item_addons
for select to anon, authenticated using (is_active);

create policy "admin manage addons" on public.item_addons
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "public read menu images" on storage.objects
for select to anon, authenticated using (bucket_id = 'menu-images');

create policy "admin upload menu images" on storage.objects
for insert to authenticated with check (bucket_id = 'menu-images' and public.is_admin());

create policy "admin update menu images" on storage.objects
for update to authenticated using (bucket_id = 'menu-images' and public.is_admin());

create policy "admin delete menu images" on storage.objects
for delete to authenticated using (bucket_id = 'menu-images' and public.is_admin());

insert into public.restaurant_settings (name_ar, name_en, menu_title_ar, menu_title_en, menu_subtitle_ar, menu_subtitle_en)
values (
  'باردو',
  'Pardo',
  'منيو باردو',
  'Pardo Menu',
  'مكونات طازجة. نكهات جريئة. في أي وقت، بطريقتكم.',
  'Fresh ingredients. Bold flavors. Anytime, your way.'
);




drop table if exists public.item_option_groups;
drop table if exists public.option_group_choices;
drop table if exists public.option_groups;

create table public.extra_groups (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.extra_group_options (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.extra_groups(id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) > 0),
  name_en text,
  price numeric(10,2) not null default 0 check (price >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true
);

create index extra_group_options_group_idx on public.extra_group_options (group_id, sort_order);

alter table public.extra_groups enable row level security;
alter table public.extra_group_options enable row level security;

create policy "admin manage extra groups" on public.extra_groups
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin manage extra group options" on public.extra_group_options
for all to authenticated using (public.is_admin()) with check (public.is_admin());