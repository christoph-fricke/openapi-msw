import { default as Axios, type AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expectTypeOf, test } from "vitest";
import { OpenApiAxios } from "../src/index.js";
import type { paths } from "./fixtures/fetcher-modes.api.js";

let axiosInstance: AxiosInstance;
let mockAdapter: MockAdapter;

const userMock = { id: 1, name: "John Smith", description: "123" };
const error4xxMock = { error: "I'm 403" };
const error5xxMock = undefined;

beforeEach(() => {
  axiosInstance = Axios.create({});

  // @ts-expect-error @TODO See issue #4 - https://github.com/web-bee-ru/openapi-axios/issues/4
  mockAdapter = new MockAdapter(axiosInstance);

  mockAdapter.onGet("/get-data-success").reply(200, userMock);
  mockAdapter.onGet("/get-data-bad-request").reply(400, error4xxMock);
  mockAdapter.onGet("/get-data-server-error").reply(503, error5xxMock);
  mockAdapter.onGet("/get-timeout-error").timeout();
  mockAdapter.onGet("/get-network-error").reply(200, null);
});

describe("Checking all mods for correct works.", () => {
  describe("Axios mode", () => {
    test("Success response", async () => {
      const api = new OpenApiAxios<paths, "axios">(axiosInstance, {
        validStatus: "axios",
      });

      const { status } = await api.get("/get-data-success");

      expectTypeOf(status).toMatchTypeOf<200>();
    });

    test("Interceptor with 4xx response", async () => {
      axiosInstance.interceptors.response.use(
        (response) => response,
        () => Promise.reject("Not based error"),
      );
      const api = new OpenApiAxios<paths, "axios">(axiosInstance, {
        validStatus: "axios",
      });

      const { status } = await api.get("/get-data-bad-request");
      expectTypeOf(status).toMatchTypeOf<never>();
    });
  });

  describe("fetch mode", () => {
    test("Success response", async () => {
      const api = new OpenApiAxios<paths, "fetch">(axiosInstance, {
        validStatus: "fetch",
      });

      const { status } = await api.get("/get-data-success");

      expectTypeOf(status).toMatchTypeOf<200>();
    });

    test("Request error response", async () => {
      const api = new OpenApiAxios<paths, "fetch">(axiosInstance, {
        validStatus: "fetch",
      });

      const { status } = await api.get("/get-data-bad-request");

      expectTypeOf(status).toMatchTypeOf<400>();
    });
  });

  describe("all mode", () => {
    test("Success response", async () => {
      const api = new OpenApiAxios<paths, "all">(axiosInstance, {
        validStatus: "all",
      });

      const { status } = await api.get("/get-data-success");

      expectTypeOf(status).toMatchTypeOf<200 | undefined>();
    });

    test("Request error response", async () => {
      const api = new OpenApiAxios<paths, "all">(axiosInstance, {
        validStatus: "all",
      });

      const { status } = await api.get("/get-data-bad-request");
      expectTypeOf(status).toMatchTypeOf<400 | undefined>();
    });
  });
});
