import { object, string } from "yup";

export const paginationQuery = object({
  query: object({
    page: string().required(),
    pageSize: string().required(),
  }),
});

export const paginationPayload = {
  page: string().required(),
  pageSize: string().required(),
};
