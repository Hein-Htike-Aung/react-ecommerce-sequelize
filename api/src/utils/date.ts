import moment from "moment";
import { Op, WhereAttributeHashValue } from "sequelize";

const formattedCurrentDate = (() =>
  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"))();

const today_date_finder = (() => {
  const start = moment().format("YYYY-MM-DD 00:00");
  const end = moment().format("YYYY-MM-DD 23:59");
  return {
    [Op.between]: [start, end],
  } as WhereAttributeHashValue<string>;
})();

export { formattedCurrentDate, today_date_finder };
