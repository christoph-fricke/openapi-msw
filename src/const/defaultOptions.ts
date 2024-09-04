import type { IOpenApiAxiosOptions } from "../types/options.js";
import { QuerySerializerStyle } from "../types/serializer.js";

/**
 * @description Default options for OpenAPI requests using Axios.
 */
export const defaultOptions: IOpenApiAxiosOptions<"axios"> = {
  validStatus: "axios",
  querySerializationParams: {
    style: QuerySerializerStyle.From,
    explode: true,
  },
};
