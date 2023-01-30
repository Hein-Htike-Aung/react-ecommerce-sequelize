import { queryParam } from "../types";

export const likeParam = (value: queryParam) => `%${value || ""}%`;
