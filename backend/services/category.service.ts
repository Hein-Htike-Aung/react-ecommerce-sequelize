import { QueryTypes } from "sequelize";
import CategoryCache from "../cache/category.cache";
import { sequelize } from "../models";
import ParentCategory from "../models/parentcategory";

class CategoryService {
  // get parent category
  static getParentCategory = async (id: number) => {
    const parentCategory = await CategoryCache.getParentCategory(
      id,
      async () => {
        const parentCategory = await ParentCategory.findByPk(id);

        if (!parentCategory) return null;

        return parentCategory;
      }
    );

    return parentCategory;
  };

  // get category
  static getCategory = async (id: number) => {
    return await CategoryCache.getCategory(id, () => this.getCategoryQuery(id));
  };

  // get parent category query
  static getParentCategoriesQuery = async () =>
    await ParentCategory.findAll({
      order: [["created_at", "DESC"]],
      raw: true,
    });

  // get category query
  static getCategoryQuery = async (id: number) => {
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

  // get all category query
  static getAllCategoryQuery = async () => {
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
}

export default CategoryService;
