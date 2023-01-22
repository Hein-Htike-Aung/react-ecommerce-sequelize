"use strict";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from ".";
import ParentCategory from "./parentcategory";

export interface ParentCategoryWithCategories extends ParentCategory {
  categories: Category[];
}

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<number>;
  declare categoryName: string;
  declare parentCategoryId: number;
  declare description: string;
  declare img: string;
}

Category.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parentCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize: sequelize,
    modelName: "Category",
    tableName: "category",
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default Category;