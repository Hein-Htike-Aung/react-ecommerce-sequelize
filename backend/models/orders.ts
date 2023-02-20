"use strict";

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from ".";

class Orders extends Model<
  InferAttributes<Orders>,
  InferCreationAttributes<Orders>
> {
  declare id: CreationOptional<number>;
  declare orderId: string;
  declare shipping_address: string;
  declare order_date: string;
  declare paymentMethod: string;
  declare status: CreationOptional<string>;
  declare shipping_fee: number;
  declare userId: number;
}

Orders.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_date: {
      type: "TIMESTAMP",
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      // Delivered, OnTheWay, Pending, Cancelled, Returned
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
    shipping_fee: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Orders",
    tableName: "orders",
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default Orders;
