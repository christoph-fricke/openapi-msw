import {
  QuerySerializerStyle,
  type IOpenApiAxiosOptions,
} from "../types/types.js";

export const defaultOptions: IOpenApiAxiosOptions<"axios"> = {
  validStatus: "axios",
  querySerializationParams: {
    style: QuerySerializerStyle.From,
    explode: true,
  },
};
