import { setCache } from "../../../../utils/setCache";
import Product from "../../../../models/product";
import restoreCache from "../../../../utils/restoreCache";
import { removeCache } from "../../../../utils/removeCache";

class ProductCache {
  // update product
  static updateProduct = async (product: Product) => {
    setCache(`product:${product.id}`, product);
  };

  // remove product
  static removeProduct = async (id: number) => {
    removeCache(`product:${id}`);
  };

  // get product
  static getProduct = async (
    id: number,
    freshDataFn: () => Promise<null | Product>
  ) => {
    return (await restoreCache<Product, Product | null>(
      `product:${id}`,
      async () => freshDataFn()
    )) as Product | null;
  };
}

export default ProductCache;
