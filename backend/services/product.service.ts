import ProductCache from "../cache/product.cache";
import Product, { ProductWithImages } from "../models/product";
import ProductImage from "../models/productimage";

class ProductService {
  static getProduct = async (id: number) => {
    return await ProductCache.getProduct(id, () =>
      Product.findByPk(id, { raw: true })
    );
  };

  static getProductQuery = async (id: number) => {
    const product = await Product.findByPk(id, { raw: true });

    if (!product) return null;

    const productImages = await ProductImage.findAll({
      where: { productId: id },
      raw: true,
    });

    return { ...product, productImages } as ProductWithImages;
  };
}

export default ProductService;
