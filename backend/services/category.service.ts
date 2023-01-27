import { get_categoryCache } from "../cache/category.cache";
import Category from "../models/category";

export const getCategoryById = async (id: number) => {
  const category = await get_categoryCache(id, async () => {
    const category = await Category.findByPk(id);

    if (category === null) return null;

    return category;
  });
  return category;
};
