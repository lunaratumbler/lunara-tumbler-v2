import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
export default async function NewProductPage() { await requireAdmin(); return <><header className="admin-page-heading"><div><p className="eyebrow">KATALOG</p><h1>Tambah Produk</h1></div><Link href="/admin/products">Kembali</Link></header><ProductForm/></>; }
