import Category from "../models/category";
import getCache from "../utils/getCache";
import restoreCache from "../utils/restoreCahce";
import { setCache } from "../utils/setCache";

export const push_categoryListCache = async (category: Category) => {
  const existingCategories = await getCache<Category[]>("categories");

  setCache("categories", [...existingCategories, category]);
};

export const update_categoryListCache = async (category: Category) => {
  let categories = await getCache<Category[]>("categories");

  categories = categories.map((c) => (c.id === category.id ? category : c));

  setCache("categories", categories);
};

export const delete_categoryListCache = async (id: number) => {
  let categories = await getCache<Category[]>("categories");

  categories = categories.filter((c) => c.id !== id);

  setCache("categories", categories);
};

export const get_categoryCache = async (
  id: string,
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
