create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.is_active)
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  sort_order integer not null default 0, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
  name text not null, slug text not null unique, description text not null default '', specifications jsonb not null default '{}'::jsonb,
  selling_price integer not null check (selling_price >= 0), cost_price integer not null check (cost_price >= 0),
  is_new boolean not null default false, is_best_seller boolean not null default false,
  is_featured boolean not null default false, featured_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists products_public_order on public.products(is_active, is_featured, featured_order);
create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete restrict,
  name text not null, hex_code text not null default '#C9827E' check (hex_code ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order integer not null default 0, is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete restrict,
  product_color_id uuid references public.product_colors(id) on delete set null,
  storage_path text not null, alt_text text not null default '', sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.product_related_products (
  product_id uuid not null references public.products(id) on delete restrict,
  related_product_id uuid not null references public.products(id) on delete restrict,
  sort_order integer not null default 0, primary key(product_id, related_product_id), check(product_id <> related_product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  customer_name text not null, customer_whatsapp text not null, notes text not null default '',
  status text not null default 'new' check(status in ('new','processing','completed','cancelled')),
  subtotal integer not null default 0, personalization_total integer not null default 0, grand_total integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists orders_created_at on public.orders(created_at desc);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null, color_name_snapshot text not null, quantity integer not null check(quantity > 0),
  personalized boolean not null default false, personalization_name text not null default '',
  selling_price_snapshot integer not null check(selling_price_snapshot >= 0), cost_price_snapshot integer not null check(cost_price_snapshot >= 0),
  personalization_fee_snapshot integer not null check(personalization_fee_snapshot >= 0), line_total integer not null check(line_total >= 0),
  created_at timestamptz not null default now()
);
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  old_status text, new_status text not null, changed_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id boolean primary key default true check(id), store_name text not null default 'Lunara Tumbler',
  whatsapp_number text not null default '6285772582278' check(whatsapp_number ~ '^62[0-9]{8,13}$'),
  whatsapp_template text not null default E'Halo Lunara, saya ingin bertanya tentang pesanan berikut:\n\n{{order_details}}\n\nTotal sementara: {{total}}', personalization_fee integer not null default 15000 check(personalization_fee >= 0),
  brand_description text not null default 'Tumbler personal yang menemani setiap momen.', instagram_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_settings(id) values(true) on conflict(id) do nothing;
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(), title text not null, alt_text text not null default '',
  image_path text not null, link_url text, sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_images enable row level security;
alter table public.product_related_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.site_settings enable row level security;
alter table public.banners enable row level security;

create policy "admin profiles read" on public.profiles for select to authenticated using (public.is_admin());
create policy "admin profiles update" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages colors" on public.product_colors for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages images" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages related products" on public.product_related_products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages order items" on public.order_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages order history" on public.order_status_history for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages banners" on public.banners for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on all tables in schema public from anon, authenticated;
grant select, insert, update on public.profiles, public.categories, public.products, public.product_colors, public.product_images, public.product_related_products, public.orders, public.order_items, public.order_status_history, public.site_settings, public.banners to authenticated;
grant delete on public.product_related_products to authenticated;
create policy "public reads product photos" on storage.objects for select to anon, authenticated using(bucket_id = 'product-photos');
create policy "admins add product photos" on storage.objects for insert to authenticated with check(bucket_id = 'product-photos' and public.is_admin());
create policy "admins update product photos" on storage.objects for update to authenticated using(bucket_id = 'product-photos' and public.is_admin()) with check(bucket_id = 'product-photos' and public.is_admin());
create policy "admins remove product photos" on storage.objects for delete to authenticated using(bucket_id = 'product-photos' and public.is_admin());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-photos','product-photos',true,10485760,array['image/jpeg','image/png','image/webp','image/avif']) on conflict(id) do nothing;

create or replace function public.get_public_settings() returns jsonb
language sql stable security definer set search_path=public as $$
  select jsonb_build_object('store_name',s.store_name,'whatsapp_number',s.whatsapp_number,'whatsapp_template',s.whatsapp_template,'personalization_fee',s.personalization_fee,'brand_description',s.brand_description,'instagram_url',s.instagram_url,
    'banners',coalesce((select jsonb_agg(jsonb_build_object('title',b.title,'alt_text',b.alt_text,'image_path',b.image_path,'link_url',b.link_url) order by b.sort_order) from public.banners b where b.is_active),'[]'::jsonb)) from public.site_settings s where s.id=true
$$;
create or replace function public.product_json(product_uuid uuid) returns jsonb
language sql stable security definer set search_path=public as $$
  select jsonb_build_object('id',p.id,'slug',p.slug,'name',p.name,'description',p.description,'selling_price',p.selling_price,
    'specifications',p.specifications,'is_featured',p.is_featured,'is_new',p.is_new,'is_best_seller',p.is_best_seller,'featured_order',p.featured_order,
    'product_colors',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'hex_code',c.hex_code,'product_images',coalesce((select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'sort_order',i.sort_order) order by i.sort_order) from public.product_images i where i.product_color_id=c.id),'[]'::jsonb)) order by c.sort_order) from public.product_colors c where c.product_id=p.id and c.is_active),'[]'::jsonb),
    'product_images',coalesce((select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'sort_order',i.sort_order) order by i.sort_order) from public.product_images i where i.product_id=p.id),'[]'::jsonb),
    'related_products',coalesce((select jsonb_agg(public.product_json(r.related_product_id) order by r.sort_order) from public.product_related_products r join public.products rp on rp.id=r.related_product_id and rp.is_active where r.product_id=p.id),'[]'::jsonb))
  from public.products p where p.id=product_uuid and p.is_active
$$;
create or replace function public.get_public_catalog() returns jsonb
language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(public.product_json(p.id) order by p.is_featured desc,p.featured_order,p.created_at desc),'[]'::jsonb)
  from public.products p where p.is_active
$$;
create or replace function public.get_public_product(product_slug text) returns jsonb
language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(public.product_json(p.id)),'[]'::jsonb) from public.products p where p.slug=product_slug and p.is_active
$$;
create or replace function public.product_json(product_uuid uuid) returns jsonb
language sql stable security definer set search_path=public as $$
  select jsonb_build_object('id',p.id,'slug',p.slug,'name',p.name,'description',p.description,'selling_price',p.selling_price,
    'specifications',p.specifications,'is_featured',p.is_featured,'is_new',p.is_new,'is_best_seller',p.is_best_seller,
    'featured_order',p.featured_order,
    'product_colors',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'hex_code',c.hex_code,'product_images',coalesce((select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'sort_order',i.sort_order) order by i.sort_order) from public.product_images i where i.product_color_id=c.id),'[]'::jsonb)) order by c.sort_order) from public.product_colors c where c.product_id=p.id and c.is_active),'[]'::jsonb),
    'product_images',coalesce((select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'sort_order',i.sort_order) order by i.sort_order) from public.product_images i where i.product_id=p.id),'[]'::jsonb),
    'related_products',coalesce((select jsonb_agg(public.product_json(r.related_product_id) order by r.sort_order) from public.product_related_products r join public.products rp on rp.id=r.related_product_id and rp.is_active where r.product_id=p.id),'[]'::jsonb))
  from public.products p where p.id=product_uuid and p.is_active
$$;
revoke all on function public.get_public_settings(), public.get_public_catalog(), public.get_public_product(text), public.product_json(uuid) from public;
grant execute on function public.get_public_settings(), public.get_public_catalog(), public.get_public_product(text) to anon, authenticated;

create or replace function public.create_manual_order(payload jsonb) returns jsonb
language plpgsql security definer set search_path=public,auth,extensions as $$
declare order_id uuid; order_no text; item jsonb; product_row public.products%rowtype; color_row public.product_colors%rowtype;
  item_qty integer; unit_price integer; fee integer; sub_total integer:=0; fee_total integer:=0; total integer:=0; attempt integer;
begin
  if not public.is_admin() then raise exception 'Akses ditolak'; end if;
  if coalesce(length(trim(payload->>'customer_name')),0)=0 or length(trim(payload->>'customer_name'))>120 or coalesce(length(trim(payload->>'customer_whatsapp')),0)=0 or length(trim(payload->>'customer_whatsapp'))>24 or trim(payload->>'customer_whatsapp') !~ '^[+]?[0-9][0-9 ()-]{7,22}$' then raise exception 'Nama dan WhatsApp pelanggan wajib valid'; end if;
  if coalesce(jsonb_typeof(payload->'items'),'') <> 'array' or jsonb_array_length(payload->'items')=0 then raise exception 'Pesanan harus memiliki produk'; end if;
  fee := (select personalization_fee from public.site_settings where id=true);
  for item in select value from jsonb_array_elements(payload->'items') loop
    item_qty := (item->>'quantity')::integer;
    if item_qty < 1 or item_qty > 10000 then raise exception 'Jumlah produk tidak valid'; end if;
    if coalesce((item->>'personalized')::boolean,false) and (coalesce(length(trim(item->>'personalization_name')),0)=0 or length(trim(item->>'personalization_name'))>24) then raise exception 'Nama personalisasi wajib diisi maksimal 24 karakter'; end if;
    select * into product_row from public.products where id=(item->>'product_id')::uuid and is_active;
    if not found then raise exception 'Produk tidak tersedia'; end if;
    select * into color_row from public.product_colors where id=(item->>'color_id')::uuid and product_id=product_row.id and is_active;
    if not found then raise exception 'Warna tidak tersedia'; end if;
    sub_total := sub_total + product_row.selling_price*item_qty;
    if coalesce((item->>'personalized')::boolean,false) then fee_total := fee_total + fee*item_qty; end if;
  end loop;
  total := sub_total+fee_total;
  for attempt in 1..10 loop
    order_no := 'ORD-'||to_char(now() at time zone 'Asia/Jakarta','YYMMDD')||'-'||upper(substr(encode(gen_random_bytes(5),'hex'),1,5));
    begin
      insert into public.orders(order_number,customer_name,customer_whatsapp,notes,status,subtotal,personalization_total,grand_total)
      values(order_no,trim(payload->>'customer_name'),trim(payload->>'customer_whatsapp'),coalesce(payload->>'notes',''),'new',sub_total,fee_total,total) returning id into order_id;
      exit;
    exception when unique_violation then if attempt=10 then raise; end if;
    end;
  end loop;
  for item in select value from jsonb_array_elements(payload->'items') loop
    item_qty := (item->>'quantity')::integer;
    select * into product_row from public.products where id=(item->>'product_id')::uuid;
    select * into color_row from public.product_colors where id=(item->>'color_id')::uuid;
    insert into public.order_items(order_id,product_id,product_name_snapshot,color_name_snapshot,quantity,personalized,personalization_name,selling_price_snapshot,cost_price_snapshot,personalization_fee_snapshot,line_total)
    values(order_id,product_row.id,product_row.name,color_row.name,item_qty,coalesce((item->>'personalized')::boolean,false),case when coalesce((item->>'personalized')::boolean,false) then trim(coalesce(item->>'personalization_name','')) else '' end,product_row.selling_price,product_row.cost_price,case when coalesce((item->>'personalized')::boolean,false) then fee else 0 end,product_row.selling_price*item_qty+case when coalesce((item->>'personalized')::boolean,false) then fee*item_qty else 0 end);
  end loop;
  insert into public.order_status_history(order_id,new_status,changed_by) values(order_id,'new',auth.uid());
  return jsonb_build_object('id',order_id,'order_number',order_no,'subtotal',sub_total,'personalization_total',fee_total,'grand_total',total);
end $$;
revoke all on function public.create_manual_order(jsonb) from public, anon;
grant execute on function public.create_manual_order(jsonb) to authenticated;

create or replace function public.admin_reports() returns jsonb
language sql stable security definer set search_path=public as $$
  select case when not public.is_admin() then '{}'::jsonb else jsonb_build_object(
    'sales',coalesce(sum(o.grand_total) filter(where o.status='completed'),0),
    'hpp',coalesce(sum(i.cost_total) filter(where o.status='completed'),0),
    'gross_profit',coalesce(sum(o.grand_total-i.cost_total) filter(where o.status='completed'),0),
    'order_count',count(distinct o.id) filter(where o.status='completed'),
    'best_sellers',coalesce((select jsonb_agg(x) from (select product_name_snapshot as name,sum(quantity) as quantity from public.order_items oi join public.orders oo on oo.id=oi.order_id where oo.status='completed' group by product_name_snapshot order by sum(quantity) desc limit 10)x),'[]'::jsonb),
    'daily',coalesce((select jsonb_agg(x) from (select (created_at at time zone 'Asia/Jakarta')::date as date,sum(grand_total) as sales from public.orders where status='completed' group by 1 order by 1 desc limit 30)x),'[]'::jsonb),
    'monthly',coalesce((select jsonb_agg(x) from (select to_char(created_at at time zone 'Asia/Jakarta','YYYY-MM') as month,sum(grand_total) as sales from public.orders where status='completed' group by 1 order by 1 desc limit 12)x),'[]'::jsonb)) end
  from public.orders o left join (select order_id,sum(cost_price_snapshot*quantity) as cost_total from public.order_items group by order_id)i on i.order_id=o.id
$$;
grant execute on function public.admin_reports() to authenticated;
revoke all on function public.admin_reports() from public, anon;
