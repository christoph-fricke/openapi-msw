import type { CustomParamsSerializer } from "axios";

import queryString from "query-string";
import {
  QuerySerializerStyle,
  type QuerySerializationParams,
} from "../types/serializer.js";

export function getQuerySerializer({
  style,
  explode,
}: QuerySerializationParams): CustomParamsSerializer {
  return (params) => {
    switch (style) {
      case QuerySerializerStyle.From:
        // form true: simple  /users?id=5, arr: /users?id=3&id=4&id=5, obj: /users?role=admin&firstName=Alex
        if (explode) {
          return queryString.stringify(flatObjects(params), { encode: true });
        }
        // form false: simple  /users?id=5, arr: /users?id=3,4,5, obj: /users?id=role,admin,firstName,Alex
        else {
          return queryString.stringify(ObjectsToArray(params), {
            arrayFormat: "comma",
            encode: true,
          });
        }
      case QuerySerializerStyle.SpaceDelimited:
        // spaceDelimited true: simple  n/a, arr: /users?id=3&id=4&id=5, obj: n/a
        if (explode) {
          return queryString.stringify(flatObjects(params), { encode: true });
        }
        // spaceDelimited false: simple  n/a, arr: /users?id=3 4 5, obj: n/a
        else {
          return queryString.stringify(params, {
            encode: true,
            arrayFormat: "separator",
            arrayFormatSeparator: " ",
          });
        }
      case QuerySerializerStyle.PipeDelimited:
        // pipeDelimited true: simple  n/a, arr: /users?id=3&id=4&id=5, obj: n/a
        if (explode) {
          return queryString.stringify(flatObjects(params), { encode: true });
        }
        // pipeDelimited false: simple  n/a, arr: /users?id=3|4|5, obj: n/a
        else {
          return queryString.stringify(params, {
            encode: true,
            arrayFormat: "separator",
            arrayFormatSeparator: "|",
          });
        }
      case QuerySerializerStyle.DeepObject:
        // deepObject true: simple  n/a, arr: n/a, obj: /users?id[role]=admin&id[firstName]=Alex
        return queryString.stringify(toDeepObject(params), { encode: true });
    }
  };
}

function flatObjects(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => {
        if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          value !== null
        ) {
          return Object.entries(value);
        }

        return [[key, value]];
      })
      .flat(),
  );
}

function ObjectsToArray(
  params: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        return [
          key,
          Object.entries(value)
            .map(([innerKey, innerValue]) => `${innerKey},${innerValue}`)
            .join(","),
        ];
      }

      return [key, value];
    }),
  );
}

function toDeepObject(
  params: Record<string, unknown>,
  prevKeys: string[] = [],
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => {
        if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          value !== null
        ) {
          return Object.entries(
            toDeepObject(value as Record<string, unknown>, [...prevKeys, key]),
          );
        }

        const [firstKey, ...restKeys] = [...prevKeys, key];
        const resKey = `${firstKey}${restKeys.map((k) => `[${k}]`).join("")}`;

        return [[resKey, value]];
      })
      .flat(),
  );
}
