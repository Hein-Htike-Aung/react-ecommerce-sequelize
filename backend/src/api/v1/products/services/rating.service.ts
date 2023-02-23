import { QueryTypes } from "sequelize";
import { sequelize } from "../../../../models";

class RatingService {
  static getRatingForProduct = async (productId: number) => {
    const q = `select avg(r.rating) as rate from rating r where r.productId = ?`;

    const [{ rate }] = await sequelize.query(q, {
      replacements: [productId],
      type: QueryTypes.SELECT,
    });

    return rate;
  };
}

export default RatingService;
