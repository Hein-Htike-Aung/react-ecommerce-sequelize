import { CategoryWithParentCategory } from "../models/category";
import ParentCategory from "../models/parentcategory";
import { getAllCategory } from "../services/category.service";
import getCache from "../utils/getCache";
import restoreCache from "../utils/restoreCahce";
import { setCache } from "../utils/setCache";

export const setCategoryCache = async (
  category: CategoryWithParentCategory
) => {
  let existingCategoriesCache = await getCache<CategoryWithParentCategory[]>(
    "categories"
  );

  if (!existingCategoriesCache.length) {
    existingCategoriesCache = await restoreCategoryListCache();
  }

  setCache("categories", [category, ...existingCategoriesCache]);
};

export const updateCategoryCache = async (
  category: CategoryWithParentCategory
) => {
  let existingCategoriesCache = await getCache<CategoryWithParentCategory[]>(
    "categories"
  );

  if (!existingCategoriesCache.length) {
    existingCategoriesCache = await restoreCategoryListCache();
  }

  existingCategoriesCache = existingCategoriesCache.map((c) =>
    c.id === category.id ? category : c
  );

  setCache("categories", existingCategoriesCache);
};

export const delete_categoryListCache = async (id: number) => {
  let existingCategoriesCache = await getCache<CategoryWithParentCategory[]>(
    "categories"
  );

  if (!existingCategoriesCache.length) {
    existingCategoriesCache = await restoreCategoryListCache();
  }

  existingCategoriesCache = existingCategoriesCache.filter((c) => c.id !== id);

  setCache("categories", existingCategoriesCache);
};

export const getParentCategoryByIdCache = async (
  id: number,
  freshDataFn: () => Promise<null | ParentCategory>
) => {
  return (await restoreCache<ParentCategory, ParentCategory | null>(
    `parentCategory:${id}`,
    async () => {
      return freshDataFn();
    }
  )) as ParentCategory | null;
};

export const get_categoryCache = async (
  id: number,
  freshDataFn: () => Promise<null | CategoryWithParentCategory>
) => {
  return (await restoreCache<
    CategoryWithParentCategory,
    CategoryWithParentCategory | null
  >(`category:${id}`, async () => {
    return freshDataFn();
  })) as CategoryWithParentCategory | null;
};

export const getCategoryListCache = async (
  freshDataFn: () => Promise<null | CategoryWithParentCategory[]>
) => {
  return (await restoreCache<
    CategoryWithParentCategory[],
    CategoryWithParentCategory[] | null
  >(`categories`, async () => {
    return freshDataFn();
  })) as CategoryWithParentCategory[];
};

export const restoreCategoryListCache = async () => {
  return (await restoreCache<
    CategoryWithParentCategory[],
    CategoryWithParentCategory[] | null
  >(`categories`, async () => {
    return getAllCategory();
  })) as CategoryWithParentCategory[];
};
