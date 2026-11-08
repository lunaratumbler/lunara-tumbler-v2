alter table public.site_settings
  add column if not exists brand_tagline text not null default 'Warna lembut, cerita personal.';

alter table public.banners
  add column if not exists subtitle text not null default '',
  add column if not exists button_label text not null default 'Jelajahi Katalog';

alter table public.products
  add column if not exists newest_order integer not null default 0 check (newest_order >= 0),
  add column if not exists best_seller_order integer not null default 0 check (best_seller_order >= 0);

create index if not exists products_newest_order on public.products(is_active, is_new, newest_order);
create index if not exists products_best_seller_order on public.products(is_active, is_best_seller, best_seller_order);

create or replace function public.get_public_settings() returns jsonb
language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'store_name', s.store_name,
    'brand_tagline', s.brand_tagline,
    'whatsapp_number', s.whatsapp_number,
    'whatsapp_template', s.whatsapp_template,
    'personalization_fee', s.personalization_fee,
    'brand_description', s.brand_description,
    'instagram_url', s.instagram_url,
    'banners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', b.title,
        'subtitle', b.subtitle,
        'alt_text', b.alt_text,
        'image_path', b.image_path,
        'button_label', b.button_label,
        'link_url', b.link_url
      ) order by b.sort_order, b.created_at)
      from public.banners b where b.is_active
    ), '[]'::jsonb)
  )
  from public.site_settings s where s.id=true
$$;

create or replace function public.product_json(product_uuid uuid) returns jsonb
language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'id', p.id,
    'slug', p.slug,
    'name', p.name,
    'description', p.description,
    'selling_price', p.selling_price,
    'specifications', p.specifications,
    'is_featured', p.is_featured,
    'is_new', p.is_new,
    'is_best_seller', p.is_best_seller,
    'featured_order', p.featured_order,
    'newest_order', p.newest_order,
    'best_seller_order', p.best_seller_order,
    'product_colors', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'hex_code', c.hex_code,
        'product_images', coalesce((
          select jsonb_agg(jsonb_build_object('storage_path', i.storage_path, 'sort_order', i.sort_order) order by i.sort_order)
          from public.product_images i where i.product_color_id=c.id
        ), '[]'::jsonb)
      ) order by c.sort_order)
      from public.product_colors c where c.product_id=p.id and c.is_active
    ), '[]'::jsonb),
    'product_images', coalesce((
      select jsonb_agg(jsonb_build_object('storage_path', i.storage_path, 'sort_order', i.sort_order) order by i.sort_order)
      from public.product_images i where i.product_id=p.id
    ), '[]'::jsonb),
    'related_products', coalesce((
      select jsonb_agg(public.product_json(r.related_product_id) order by r.sort_order)
      from public.product_related_products r
      join public.products rp on rp.id=r.related_product_id and rp.is_active
      where r.product_id=p.id
    ), '[]'::jsonb)
  )
  from public.products p where p.id=product_uuid and p.is_active
$$;

create or replace function public.get_public_catalog() returns jsonb
language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(public.product_json(p.id) order by
    p.is_featured desc, p.featured_order, p.is_new desc, p.newest_order,
    p.is_best_seller desc, p.best_seller_order, p.created_at desc
  ), '[]'::jsonb)
  from public.products p where p.is_active
$$;

revoke all on function public.get_public_settings(), public.get_public_catalog(), public.product_json(uuid) from public;
grant execute on function public.get_public_settings(), public.get_public_catalog() to anon, authenticated;
