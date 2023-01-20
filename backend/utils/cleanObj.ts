import { isEmpty, omitBy } from "lodash";
import { ErrorResponseObj, ResponseObj } from "../types";

const cleanObj = (obj: ResponseObj | ErrorResponseObj) => omitBy(obj, isEmpty);

export default cleanObj;
