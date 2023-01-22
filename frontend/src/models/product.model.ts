export interface Product {
  id: number;
  categoryId: number;
  productName: string;
  product_code: string;
  product_sku: string;
  regular_price: number;
  sale_price: number;
  tags: string;
  sizes: string;
  quantity: number;
  colors: string;
  gender: string;
  isFeatured: boolean;
  status: boolean;
  description: string;
  productImages: ProductImage[];
  created_at: Date;
  updated_at: Date;
}

export interface ProductImage {
  id: number;
  productId: number;
  img: string;
  created_at: Date;
  updated_at: Date;
}
