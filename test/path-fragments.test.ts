import { getResponse, HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import { expect, suite, test } from "vitest";
import type { paths } from "./fixtures/path-fragments.api.ts";

suite("Mocking paths with fragments", () => {
  const http = createOpenApiHttp<paths>({ baseUrl: "*" });

  test("provides usable params to the resolver function", async () => {
    const request = new Request(
      "http://localhost:3000/resource/test-id/test-name",
    );

    const handler = http.get("/resource/{id}/{name}", ({ params }) => {
      return HttpResponse.json({ id: params.id, name: params.name });
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.json();
    expect(responseBody?.id).toBe("test-id");
    expect(responseBody?.name).toBe("test-name");
  });

  test("can parse fragments as number when the fragment is specified as a number fragment", async () => {
    const request = new Request("http://localhost:3000/resource/42");

    const handler = http.get("/resource/{count}", ({ params }) => {
      return HttpResponse.json({ count: parseInt(params.count) });
    });
    const response = await getResponse([handler], request);

    const responseBody = await response?.json();
    expect(responseBody?.count).toBe(42);
  });
});
