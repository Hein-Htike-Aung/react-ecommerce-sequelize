import moment from "moment";
import { Op } from "sequelize";

const today_date_finder = (() => {
  const start = moment().format("YYYY-MM-DD 00:00");
  const end = moment().format("YYYY-MM-DD 23:59");
  return {
    [Op.between]: [start, end],
  };
})();

export default today_date_finder;
