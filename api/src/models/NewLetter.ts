import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import model_config from ".";
export class NewLetter extends Model<
  InferAttributes<NewLetter>,
  InferCreationAttributes<NewLetter>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare link: string;
}

NewLetter.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    tableName: "new_letter",
    sequelize: model_config.sequelize,
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default NewLetter;
