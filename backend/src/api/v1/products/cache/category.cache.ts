import { CategoryWithParentCategory } from "../../../../models/category";
import ParentCategory from "../../../../models/parentcategory";
import CategoryService from "../services/category.service";
import getCache from "../../../../utils/getCache";
import restoreCache from "../../../../utils/restoreCache";
import { setCache } from "../../../../utils/setCache";

class CategoryCache {
  // set category
  static setCategory = async (category: CategoryWithParentCategory) => {
    let existingCategoriesCache = await getCache<CategoryWithParentCategory[]>(
      "categories"
    );

    if (!existingCategoriesCache) {
      existingCategoriesCache = await this.restoreCategoryList();
    }

    setCache("categories", [category, ...existingCategoriesCache]);
  };

  // update category
  static updateCategory = async (category: CategoryWithParentCategory) => {
    let existingCategoriesCache = await getCache<CategoryWithParentCategory[]>(
      "categories"
    );

    if (!existingCategoriesCache) {
      existingCategoriesCache = await this.restoreCategoryList();
    }

    existingCategoriesCache = existingCategoriesCache.map((c) =>
      c.id === category.id ? category : c
    );

    setCache("categories", existingCategoriesCache);
  };

  // delete category
  static deleteCategory = async (id: number) => {
    let existingCategoriesCache = await getCache<CategoryWithParentCategory[]>(
      "categories"
    );

    if (!existingCategoriesCache) {
      existingCategoriesCache = await this.restoreCategoryList();
    }

    existingCategoriesCache = existingCategoriesCache.filter(
      (c) => c.id !== id
    );

    setCache("categories", existingCategoriesCache);
  };

  // get parent category
  static getParentCategory = async (
    id: number,
    freshDataFn: () => Promise<null | ParentCategory>
  ) => {
    return (await restoreCache<ParentCategory, ParentCategory | null>(
      `parentCategory:${id}`,
      async () => freshDataFn()
    )) as ParentCategory | null;
  };

  // get category
  static getCategory = async (
    id: number,
    freshDataFn: () => Promise<null | CategoryWithParentCategory>
  ) => {
    return (await restoreCache<
      CategoryWithParentCategory,
      CategoryWithParentCategory | null
    >(`category:${id}`, async () =>
      freshDataFn()
    )) as CategoryWithParentCategory | null;
  };

  // restore category list
  static restoreCategoryList = async () => {
    return (await restoreCache<
      CategoryWithParentCategory[],
      CategoryWithParentCategory[] | null
    >(`categories`, async () =>
      CategoryService.getAllCategoryQuery()
    )) as CategoryWithParentCategory[];
  };

  // restore parent category list
  static restoreParentCategoryList = async () => {
    return (await restoreCache(`parentCategories`, async () =>
      CategoryService.getParentCategoriesQuery()
    )) as ParentCategory[];
  };
}

export default CategoryCache;
