import ProductCache from "../cache/product.cache";
import Product, { ProductWithImages, ProductWithRate } from "../models/product";
import ProductImage from "../models/productimage";
import RatingService from "./rating.service";

class ProductService {
  // get product
  static getProduct = async (id: number) => {
    return await ProductCache.getProduct(id, () =>
      Product.findByPk(id, { raw: true })
    );
  };

  // get product query
  static getProductQuery = async (id: number) => {
    const product = await Product.findByPk(id, { raw: true });

    if (!product) return null;

    const productImages = await ProductImage.findAll({
      where: { productId: id },
      raw: true,
    });

    return { ...product, productImages } as ProductWithImages;
  };

  static getProductImages = async (data: Product[]) => {
    await Promise.all(
      data.map(async (product: ProductWithImages | Product) => {
        const productImages = await ProductImage.findAll({
          where: { productId: product.id },
        });

        (product as ProductWithImages)["productImages"] = productImages;
      })
    );
  };

  static getProductRate = async (data: Product[]) => {
    await Promise.all(
      data.map(async (r: ProductWithRate | Product) => {
        (r as ProductWithRate)["rate"] =
          await RatingService.getRatingForProduct(r.id);
      })
    );
  };
}

export default ProductService;
