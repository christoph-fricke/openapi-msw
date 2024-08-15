import axios from "axios";
import { beforeAll, describe, expect, test } from "vitest";
import { OpenApiAxios } from "../src/index.js";
import {
  QuerySerializerStyle,
  type QuerySerializationParams,
} from "../src/types/schemeTypes.js";
import {
  PathsMultiQueryGetParametersQuerySortBy,
  PathsSingleQueryGetParametersQuerySort,
  type paths,
} from "./fixtures/query-params.api.js";

const BASE_URI = "http://api.test/";
let api: OpenApiAxios<paths, "axios">;

beforeAll(() => {
  const client = axios.create({ baseURL: BASE_URI });
  api = new OpenApiAxios<paths, "axios">(client, {
    validStatus: "axios",
  });
});

describe("GetUrl tests", () => {
  test("Check get url method", async () => {
    const url = await api.getUri("get", "/");
    expect(url).toBe(BASE_URI);
  });
});

describe("Query serializer style: form, explode: true tests", () => {
  test("Check single query is default", async () => {
    const page = 2;
    const query = "test";
    const sort = PathsSingleQueryGetParametersQuerySort.asc;

    const url = await api.getUri("get", "/single-query", {
      query: { page, query, sort },
    });
    const url2 = await api.getUri("get", "/single-query", {
      query: { page, query, sort },
      querySerializationParams: {
        explode: true,
        style: QuerySerializerStyle.From,
      },
    });
    expect(url).toBe(url2);
  });

  test("Check single query", async () => {
    const page = 2;
    const query = "test";
    const sort = PathsSingleQueryGetParametersQuerySort.asc;

    const url = await api.getUri("get", "/single-query", {
      query: { page, query, sort },
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}single-query?page=${page}&query=${query}&sort=${sort}`,
    );
  });

  test("Check array query is default", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
    });
    const url2 = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
      querySerializationParams: {
        explode: true,
        style: QuerySerializerStyle.From,
      },
    });
    expect(url).toBe(url2);
  });

  test("Check array query", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}multi-query?${id.map((val) => `id=${val}`).join("&")}&sortBy=${sortBy[0]}`,
    );
  });

  test("Check object query is default", async () => {
    const user = {
      id: "qwe",
      test: 123,
    };

    const url = await api.getUri("get", "/object-query", {
      query: { user },
    });

    const url2 = await api.getUri("get", "/object-query", {
      query: { user },
      querySerializationParams: {
        explode: true,
        style: QuerySerializerStyle.From,
      },
    });
    expect(url).toBe(url2);
  });

  test("Check object query", async () => {
    const user = {
      id: "qwe",
      test: 123,
    };

    const url = await api.getUri("get", "/object-query", {
      query: { user },
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}object-query?id=${user.id}&test=${user.test}`,
    );
  });
});

describe("Query serializer style: form, explode: false tests", () => {
  const querySerializationParams: QuerySerializationParams = {
    explode: false,
    style: QuerySerializerStyle.From,
  };

  test("Check single query", async () => {
    const page = 2;
    const query = "test";
    const sort = PathsSingleQueryGetParametersQuerySort.asc;

    const url = await api.getUri("get", "/single-query", {
      query: { page, query, sort },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}single-query?page=${page}&query=${query}&sort=${sort}`,
    );
  });

  test("Check array query", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}multi-query?id=${id.join(",")}&sortBy=${sortBy[0]}`,
    );
  });

  test("Check object query", async () => {
    const user = {
      id: "qwe",
      test: 123,
    };

    const url = await api.getUri("get", "/object-query", {
      query: { user },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}object-query?user=id,${user.id},test,${user.test}`,
    );
  });
});

// there's no difference with default
describe("Query serializer style: spaceDelimited, explode: true tests", () => {
  const querySerializationParams: QuerySerializationParams = {
    explode: true,
    style: QuerySerializerStyle.SpaceDelimited,
  };

  test("Check array query", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}multi-query?${id.map((val) => `id=${val}`).join("&")}&sortBy=${sortBy[0]}`,
    );
  });
});

describe("Query serializer style: spaceDelimited, explode: false tests", () => {
  const querySerializationParams: QuerySerializationParams = {
    explode: false,
    style: QuerySerializerStyle.SpaceDelimited,
  };

  test("Check array query", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}multi-query?id=${id.join(" ")}&sortBy=${sortBy[0]}`,
    );
  });
});

// there's no difference with default
describe("Query serializer style: pipeDelimited, explode: true tests", () => {
  const querySerializationParams: QuerySerializationParams = {
    explode: true,
    style: QuerySerializerStyle.PipeDelimited,
  };

  test("Check array query", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
      querySerializationParams,
    });
    expect(url).toBe(
      `${BASE_URI}multi-query?${id.map((val) => `id=${val}`).join("&")}&sortBy=${sortBy[0]}`,
    );
  });
});

describe("Query serializer style: pipeDelimited, explode: false tests", () => {
  const querySerializationParams: QuerySerializationParams = {
    explode: false,
    style: QuerySerializerStyle.PipeDelimited,
  };

  test("Check array query", async () => {
    const id = [1, 2, 3];
    const sortBy = [PathsMultiQueryGetParametersQuerySortBy.asc];

    const url = await api.getUri("get", "/multi-query", {
      query: { id, sortBy },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}multi-query?id=${id.join("|")}&sortBy=${sortBy[0]}`,
    );
  });
});

describe("Query serializer style: form, explode: false tests", () => {
  const querySerializationParams: QuerySerializationParams = {
    style: QuerySerializerStyle.DeepObject,
    explode: true,
  };

  test("Check object query", async () => {
    const user = {
      id: "qwe",
      test: {
        prop: "test",
      },
    };

    const url = await api.getUri("get", "/deep-object-query", {
      query: { user },
      querySerializationParams,
    });
    expect(decodeURIComponent(url)).toBe(
      `${BASE_URI}deep-object-query?user[id]=${user.id}&user[test][prop]=${user.test.prop}`,
    );
  });
});
