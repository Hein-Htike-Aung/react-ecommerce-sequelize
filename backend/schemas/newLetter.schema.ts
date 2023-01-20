import { object, string } from "yup";

export const newLetterId = {
  params: object({
    newLetterId: string().required(),
  }),
};

const payload = {
  body: object({
    title: string().required(),
    description: string().required(),
    link: string(),
  }),
};

export const createNewLetterSchema = object({ ...payload });

export const updateNewLetterSchema = object({ ...newLetterId, ...payload });

export const newLetterIdParam = object({ ...newLetterId });
