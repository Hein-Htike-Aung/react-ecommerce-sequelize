import { QueryTypes } from "sequelize";
import {
  getParentCategoryByIdCache,
  get_categoryCache,
} from "../cache/category.cache";
import { sequelize } from "../models";
import ParentCategory from "../models/parentcategory";

export const parentCategoryById_using_cache = async (id: number) => {
  const parentCategory = await getParentCategoryByIdCache(id, async () => {
    const parentCategory = await ParentCategory.findByPk(id);

    if (!parentCategory) return null;

    return parentCategory;
  });

  return parentCategory;
};

export const getCategoryById_using_cache = async (id: number) => {
  return await get_categoryCache(id, async () => getCategoryById(id));
};

export const getCategoryById = async (id: number) => {
  const q = `select c.*, pc.parentCategoryName from category c
  inner join parent_category pc
  on c.parentCategoryId = pc.id
  where c.id = ?`;

  const [category] = await sequelize.query(q, {
    replacements: [id],
    raw: true,
    type: QueryTypes.SELECT,
  });

  return category;
};

export const getAllCategory = async () => {
  const q = `select c.*, pc.parentCategoryName from category c
                  inner join parent_category pc
                  on c.parentCategoryId = pc.id
                  order by c.created_at desc`;

  const categories = await sequelize.query(q, {
    raw: true,
    type: QueryTypes.SELECT,
  });

  if (categories.length) return categories;
  return [];
};
