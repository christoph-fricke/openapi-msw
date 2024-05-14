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

    http.get("/resource", ({ response }) => {
      return response(200).text("Hello");
    });

    http.get("/resource", ({ response }) => {
      return response(200).json({ id: "test-id", name: "Test", value: 16 });
    });

    http.get("/text-resource", ({ response }) => {
      return response(200).text("Some Text");
    });

    http.get("/resource", ({ response }) => {
      return response(418).json({
        error: "Strict typed exception occurred.",
        code: 9000,
      });
    });

    http.get("/resource", ({ response }) => {
      return response("5XX").json({ code: 1, error: "" }, { status: 502 });
    });
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
