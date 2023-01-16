import { Category } from "./category.model";

export interface ParentCategory {
  id: number;
  parentCategoryName: string;
  categories: Category[];
  created_at: Date;
  updated_at: Date;
}
