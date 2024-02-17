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
      {
        method: "get",
      },
    );

    const handler = http.get("/text-resource", () => {
      return HttpResponse.text("Hello World");
    });
    const result = await handler.run({ request });

    const responseBody = await result?.response?.text();
    expect(responseBody).toBe("Hello World");
    expect(result?.response?.status).toBe(200);
  });

  test("When an endpoint return multiple media types or error codes, Then responses for all of them can be returned", async () => {
    // TODO: Temporary test for playing with the new response helper...

    http.get("/multi-resource", ({ response }) => {
      // TS is able to provide hints on literal string responses. Not possible before. :chefkiss:
      return response(200).text("Hello");
    });

    http.get("/multi-resource", ({ response }) => {
      return response(200).json({ id: "test-id", name: "Test", value: 16 });
    });

    http.get("/multi-resource", ({ response }) => {
      return response(418).json({
        error: "Strict typed exception occurred.",
        code: 9000,
      });
    });

    http.get("/multi-resource", ({ response }) => {
      // TODO: Will be changed to not require casting...
      return response.untyped.text("Unexpected Error" as "Hello", {
        status: 500,
      });
    });
  });
});
