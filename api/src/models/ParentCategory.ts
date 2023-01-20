import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import model_config from ".";

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
    sequelize: model_config.sequelize,
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default ParentCategory;
