import { default as Axios, default as axios, type AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, test } from "vitest";
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

      const { status, data } = await api.get("/get-data-success");

      expect(status).toBe(200);
      expect(data).toEqual(userMock);
    });

    test("Interceptor with 4xx response", async () => {
      axiosInstance.interceptors.response.use(
        (response) => response,
        () => Promise.reject("Not based error"),
      );
      const api = new OpenApiAxios<paths, "axios">(axiosInstance, {
        validStatus: "axios",
      });

      try {
        await api.get("/get-data-bad-request");
      } catch (err) {
        if (!axios.isAxiosError(err)) {
          expect(err).toBe("Not based error");
          return;
        }
      }
      expect(false).toBe("Test isn't passed.");
    });

    test("Request error response", async () => {
      const api = new OpenApiAxios<paths, "axios">(axiosInstance, {
        validStatus: "axios",
      });

      try {
        await api.get("/get-data-bad-request");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (typeof err.response?.status === "number") {
            expect(err.response?.status).toBe(400);
            return;
          }
        }
      }
      expect(false).toBe("Test isn't passed.");
    });

    test("Timeout error", async () => {
      const api = new OpenApiAxios<paths, "axios">(axiosInstance, {
        validStatus: "axios",
      });

      try {
        await api.get("/get-timeout-error", {});
      } catch (err) {
        if (axios.isAxiosError(err)) {
          expect(err.code).toBe("ECONNABORTED");
          return;
        }
      }
      expect(false).toBe("Test isn't passed.");
    });
  });

  describe("fetch mode", () => {
    test("Success response", async () => {
      const api = new OpenApiAxios<paths, "fetch">(axiosInstance, {
        validStatus: "fetch",
      });

      const { status, data } = await api.get("/get-data-success");

      expect(status).toBe(200);
      expect(data).toEqual(userMock);
    });

    test("Interceptor with 4xx response", async () => {
      axiosInstance.interceptors.response.use(
        (response) => response,
        () => Promise.reject("Not based error"),
      );
      const api = new OpenApiAxios<paths, "fetch">(axiosInstance, {
        validStatus: "fetch",
      });

      try {
        await api.get("/get-data-bad-request");
      } catch (err) {
        if (!axios.isAxiosError(err)) {
          expect(err).toBe("Not based error");
          return;
        }
      }
      expect(false).toBe("Test isn't passed.");
    });

    test("Request error response", async () => {
      const api = new OpenApiAxios<paths, "fetch">(axiosInstance, {
        validStatus: "fetch",
      });

      const { error, status } = await api.get("/get-data-bad-request");
      if (status === 400 && axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);
        return;
      }

      expect(false).toBe("Test isn't passed.");
    });

    test("Timeout error", async () => {
      const api = new OpenApiAxios<paths, "fetch">(axiosInstance, {
        validStatus: "fetch",
      });

      try {
        await api.get("/get-timeout-error", {});
      } catch (err) {
        if (axios.isAxiosError(err)) {
          expect(err.code).toBe("ECONNABORTED");
          return;
        }
      }
      expect(false).toBe("Test isn't passed.");
    });
  });

  describe("all mode", () => {
    test("Success response", async () => {
      const api = new OpenApiAxios<paths, "all">(axiosInstance, {
        validStatus: "all",
      });

      const { status, data } = await api.get("/get-data-success");

      expect(status).toBe(200);
      expect(data).toEqual(userMock);
    });

    test("Interceptor with 4xx response", async () => {
      axiosInstance.interceptors.response.use(
        (response) => response,
        () => Promise.reject("Not based error"),
      );
      const api = new OpenApiAxios<paths, "all">(axiosInstance, {
        validStatus: "all",
      });

      const { error } = await api.get("/get-data-bad-request");
      if (!axios.isAxiosError(error)) {
        expect(error).toBe("Not based error");
        return;
      }
      expect(false).toBe("Test isn't passed.");
    });

    test("Request error response", async () => {
      const api = new OpenApiAxios<paths, "all">(axiosInstance, {
        validStatus: "all",
      });

      const { error, status } = await api.get("/get-data-bad-request");
      if (status === 400 && axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(400);
        return;
      }

      expect(false).toBe("Test isn't passed.");
    });

    test("Timeout error", async () => {
      const api = new OpenApiAxios<paths, "all">(axiosInstance, {
        validStatus: "all",
      });

      const { error } = await api.get("/get-timeout-error", {});
      expect(axios.isAxiosError(error) && error.code).toBe("ECONNABORTED");
    });
  });
});
