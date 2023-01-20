import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import model_config from ".";

export class Subscriber extends Model<
  InferAttributes<Subscriber>,
  InferCreationAttributes<Subscriber>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
}

Subscriber.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "subscriber",
    sequelize: model_config.sequelize,
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default Subscriber;
