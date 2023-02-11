"use strict";

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from ".";
import ProductImage from "./productimage";

export interface ProductWithImages extends Product {
  productImages: ProductImage[];
}

export interface ProductWithRate extends Product {
  rate: number;
}

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare categoryId: number;
  declare productName: string;
  declare product_code: string;
  declare product_sku: string;
  declare regular_price: number;
  declare sale_price: number;
  declare tags: string;
  declare sizes: string;
  declare quantity: number;
  declare colors: string;
  declare gender: string;
  declare isFeatured: CreationOptional<boolean>;
  declare status: CreationOptional<string>;
  declare description: string;
}

Product.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "productName",
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "product_code",
    },
    product_sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "product_sku",
    },
    regular_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    sale_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sizes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    colors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Others",
    },
    isFeatured: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Sale",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Product",
    tableName: "product",
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default Product;
