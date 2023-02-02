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

const formatISODate = (date: Date) => {
  return date.toISOString().substring(0, 10);
};

const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month, 1);

  const days = [];
  while (date.getMonth() === month) {
    const targetDate = new Date(date);
    days.push(
      formatISODate(new Date(targetDate.setDate(targetDate.getDate() + 1)))
    );
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export {
  formattedCurrentDate,
  today_date_finder,
  formatISODate as formatDate,
  getDaysInMonth,
};
