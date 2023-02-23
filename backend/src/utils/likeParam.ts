import { Op } from "sequelize";
import { queryParam } from "../../types";

const likeParam = (value: queryParam) => {
  return {
    [Op.like]: replaceLikeParam(value),
  };
};

const replaceLikeParam = (value: queryParam) => `%${value || ""}%`;

export { likeParam, replaceLikeParam };
