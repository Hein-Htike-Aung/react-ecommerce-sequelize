import sequelize from "./index";

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export class ParentCategory extends Model<
  InferAttributes<ParentCategory>,
  InferCreationAttributes<ParentCategory>
> {
  declare id: CreationOptional<number>;
  declare parentCategoryName: string;
}

ParentCategory.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    parentCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "parent_category",
    sequelize,
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default ParentCategory;
