import Category from "../models/category";
import getCache from "../utils/getCache";
import restoreCache from "../utils/restoreCahce";
import { setCache } from "../utils/setCache";

export const push_categoryListCache = async (category: Category) => {
  let existingCategoriesCache = await getCache<Category[]>("categories");

  if (!existingCategoriesCache.length) {
    existingCategoriesCache = await restoreCategoryListCache();
  }

  setCache("categories", [...existingCategoriesCache, category]);
};

export const update_categoryListCache = async (category: Category) => {
  let existingCategoriesCache = await getCache<Category[]>("categories");

  if (!existingCategoriesCache.length) {
    existingCategoriesCache = await restoreCategoryListCache();
  }

  existingCategoriesCache = existingCategoriesCache.map((c) =>
    c.id === category.id ? category : c
  );

  setCache("categories", existingCategoriesCache);
};

export const delete_categoryListCache = async (id: number) => {
  let existingCategoriesCache = await getCache<Category[]>("categories");

  if (!existingCategoriesCache.length) {
    existingCategoriesCache = await restoreCategoryListCache();
  }

  existingCategoriesCache = existingCategoriesCache.filter((c) => c.id !== id);

  setCache("categories", existingCategoriesCache);
};

export const get_categoryCache = async (
  id: number,
  freshDataFn: () => Promise<null | Category>
) => {
  return (await restoreCache<Category, Category | null>(
    `category:${id}`,
    async () => {
      return freshDataFn();
    }
  )) as Category | null;
};

export const getCategoryListCache = async (
  freshDataFn: () => Promise<null | Category[]>
) => {
  return (await restoreCache<Category[], Category[] | null>(
    `categories`,
    async () => {
      return freshDataFn();
    }
  )) as Category[];
};

export const restoreCategoryListCache = async () => {
  return (await restoreCache<Category[], Category[] | null>(
    `categories`,
    async () => {
      const categories = await Category.findAll({ raw: true });

      if (!categories.length) return null;

      return categories;
    }
  )) as Category[];
};
