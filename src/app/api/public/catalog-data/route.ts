import { NextResponse } from "next/server";
import { getPublicProducts } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const products = await getPublicProducts();
  const data = products.map(({ id, slug, name, description, colors, gallery }) => ({
    id,
    slug,
    name,
    description,
    image: colors[0]?.image || gallery[0] || "",
    colors: colors.map(({ id: colorId, name: colorName, image }) => ({ id: colorId, name: colorName, image })),
  }));
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
