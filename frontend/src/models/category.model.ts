export interface Category {
  id: number;
  categoryName: string;
  parentCategoryId: number;
  parentCategoryName: string;
  description: string;
  img: string;
  totalItems: number;
  created_at: Date;
  updated_at: Date;
}
