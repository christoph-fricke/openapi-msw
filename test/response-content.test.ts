import { getResponse, HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expect, suite, test } from "vitest";
import type { paths } from "./fixtures/response-content.api.ts";

suite("Mocking responses in resolver functions", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("returns JSON responses that contain the expected content", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", () => {
      return HttpResponse.json({ id: "test-id", name: "Test", value: 16 });
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.json();
    expect(response?.status).toBe(200);
    expect(responseBody).toStrictEqual({
      id: "test-id",
      name: "Test",
      value: 16,
    });
  });

  test("returns TEXT responses that contain the expected content", async () => {
    const request = new Request("http://localhost:3000/text-resource");

    const handler = http.get("/text-resource", () => {
      return HttpResponse.text("Hello World");
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.text();
    expect(response?.status).toBe(200);
    expect(responseBody).toBe("Hello World");
  });

  test("returns JSON responses when the response helper is used with a exact status code", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", ({ response }) => {
      return response(418).json({ code: 123, error: "Something wrong." });
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.json();
    expect(response?.status).toBe(418);
    expect(responseBody).toStrictEqual({
      code: 123,
      error: "Something wrong.",
    });
  });

  test("returns TEXT responses when the response helper is used with a exact status code", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", ({ response }) => {
      return response(200).text("Hello");
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.text();
    expect(response?.status).toBe(200);
    expect(responseBody).toBe("Hello");
  });

  test("returns EMPTY responses when the response helper is used with a exact status code", async () => {
    const request = new Request(new URL("/resource", "http://localhost:3000"), {
      method: "get",
    });

    const handler = http.get("/resource", ({ response }) => {
      return response(204).empty();
    });
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(204);
    expect(response?.body).toBeNull();
  });

  test("includes a 'content-length' header for empty responses", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", ({ response }) => {
      return response(204).empty();
    });
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(204);
    expect(response?.headers.has("content-length")).toBeTruthy();
    expect(response?.headers.get("content-length")).toBe("0");
  });

  test("uses a explicitly provided 'content-length' header for empty responses", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", ({ response }) => {
      return response(204).empty({ headers: { "content-length": "32" } });
    });
    const response = await getResponse([handler], request);

    expect(response?.status).toBe(204);
    expect(response?.headers.has("content-length")).toBeTruthy();
    expect(response?.headers.get("content-length")).toBe("32");
  });

  test("enforces a status code when the response helper is used with a wildcard status code", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", ({ response }) => {
      return response("5XX").json(
        { code: 123, error: "Something wrong." },
        { status: 503 },
      );
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.json();
    expect(response?.status).toBe(503);
    expect(responseBody).toStrictEqual({
      code: 123,
      error: "Something wrong.",
    });
  });

  test("allows any response when the fallback helper is used", async () => {
    const request = new Request("http://localhost:3000/resource");

    const handler = http.get("/resource", ({ response }) => {
      return response.untyped(
        HttpResponse.text("Unexpected Error", { status: 500 }),
      );
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.text();
    expect(response?.status).toBe(500);
    expect(responseBody).toBe("Unexpected Error");
  });
});
