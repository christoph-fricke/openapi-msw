import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { describe, expect, test } from "vitest";
import type { paths } from "./fixtures/response-content.api.js";

describe("Given an OpenAPI schema endpoint with response content", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("When a JSON endpoint is mocked, Then a fitting response content can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", () => {
      return HttpResponse.json({ id: "test-id", name: "Test", value: 16 });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody).toStrictEqual({
      id: "test-id",
      name: "Test",
      value: 16,
    });
    expect(result?.response?.status).toBe(200);
  });

  test("When a TEXT endpoint is mocked, Then text response content can be returned", async () => {
    const request = new Request(
      new URL("/text-resource", "http://localhost:3000"),
      { method: "get" },
    );

    const handler = http.get("/text-resource", () => {
      return HttpResponse.text("Hello World");
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.text();
    expect(responseBody).toBe("Hello World");
    expect(result?.response?.status).toBe(200);
  });

  test("When the response helper is used for fix status codes, Then a JSON response can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response(418).json({ code: 123, error: "Something wrong." });
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody).toStrictEqual({
      code: 123,
      error: "Something wrong.",
    });
    expect(result?.response?.status).toBe(418);
  });

  test("When the response helper is used for fix status codes, Then a TEXT response can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response(200).text("Hello");
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.text();
    expect(responseBody).toBe("Hello");
    expect(result?.response?.status).toBe(200);
  });

  test("When the response helper is used for fix status codes, Then a EMPTY response can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response(204).empty();
    });
    const result = await handler.run({ request });

    expect(result?.response?.body).toBeNull();
    expect(result?.response?.status).toBe(204);
  });

  test("When an empty response is created, Then the responses includes a content-length header", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response(204).empty();
    });
    const result = await handler.run({ request });

    expect(result?.response?.status).toBe(204);
    expect(result?.response?.headers.has("content-length")).toBeTruthy();
    expect(result?.response?.headers.get("content-length")).toBe("0");
  });

  test("When an empty response with content-length is created, Then the provided a content-length header is used", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response(204).empty({ headers: { "content-length": "32" } });
    });
    const result = await handler.run({ request });

    expect(result?.response?.status).toBe(204);
    expect(result?.response?.headers.has("content-length")).toBeTruthy();
    expect(result?.response?.headers.get("content-length")).toBe("32");
  });

  test("When the response helper is used for wildcard status codes, Then a specific response status must be chosen", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response("5XX").json(
        { code: 123, error: "Something wrong." },
        { status: 503 },
      );
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.json();
    expect(responseBody).toStrictEqual({
      code: 123,
      error: "Something wrong.",
    });
    expect(result?.response?.status).toBe(503);
  });

  test("When an endpoint is mocked with the fallback helper, Then any response can be returned", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });
    const handler = http.get("/resource", ({ response }) => {
      return response.untyped(
        HttpResponse.text("Unexpected Error", { status: 500 }),
      );
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.text();
    expect(result?.response?.status).toBe(500);
    expect(responseBody).toBe("Unexpected Error");
  });
});
