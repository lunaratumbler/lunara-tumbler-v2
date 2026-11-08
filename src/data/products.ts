export interface ProductColor { id: string; name: string; image: string }
export interface Product {
  id: string; slug: string; name: string; price: number; description: string;
  createdAt: string;
  capacity: string; material: string; dimensions: string; featured: boolean;
  featuredOrder: number; isNew: boolean; newestOrder: number; isBestSeller: boolean;
  bestSellerOrder: number; colors: ProductColor[]; gallery: string[];
  related?: Product[];
}
