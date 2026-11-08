-- LOCAL ONLY: expose only the safe creation timestamp needed to sort the public latest-products carousel.
create or replace function public.product_json(product_uuid uuid) returns jsonb
language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'id',p.id,'slug',p.slug,'name',p.name,'description',p.description,
    'selling_price',p.selling_price,'created_at',p.created_at,
    'specifications',p.specifications,'is_featured',p.is_featured,'is_new',p.is_new,
    'is_best_seller',p.is_best_seller,'featured_order',p.featured_order,
    'newest_order',p.newest_order,'best_seller_order',p.best_seller_order,
    'product_colors',coalesce((select jsonb_agg(jsonb_build_object(
      'id',c.id,'name',c.name,'hex_code',c.hex_code,
      'product_images',coalesce((select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'sort_order',i.sort_order) order by i.sort_order) from public.product_images i where i.product_color_id=c.id),'[]'::jsonb)
    ) order by c.sort_order) from public.product_colors c where c.product_id=p.id and c.is_active),'[]'::jsonb),
    'product_images',coalesce((select jsonb_agg(jsonb_build_object('storage_path',i.storage_path,'sort_order',i.sort_order) order by i.sort_order) from public.product_images i where i.product_id=p.id),'[]'::jsonb),
    'related_products',coalesce((select jsonb_agg(public.product_json(r.related_product_id) order by r.sort_order) from public.product_related_products r join public.products rp on rp.id=r.related_product_id and rp.is_active where r.product_id=p.id),'[]'::jsonb)
  ) from public.products p where p.id=product_uuid and p.is_active
$$;

create or replace function public.get_public_catalog() returns jsonb
language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(public.product_json(p.id) order by p.created_at desc),'[]'::jsonb)
  from public.products p where p.is_active
$$;

revoke all on function public.product_json(uuid) from public;
grant execute on function public.get_public_catalog(), public.get_public_product(text) to anon, authenticated;
