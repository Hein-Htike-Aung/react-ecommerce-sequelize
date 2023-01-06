import pkg from "lodash";
import { ParsedQs } from "../../types";

const { get } = pkg;

const getPaginationData = (query: ParsedQs) => {
  const pageSize = get(query, "pageSize");
  const page = get(query, "page");

  const offset = Number(page) * Number(pageSize);
  const limit = Number(pageSize);

  return {
    offset,
    limit,
    isPagination: !Number.isNaN(offset) && !Number.isNaN(limit),
  };
};

export default getPaginationData;
