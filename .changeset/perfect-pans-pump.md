---
"openapi-msw": minor
---

Added enhanced typing for the `request` object. Now, `request.json()` and `request.text()` infer their return type from the given OpenAPI request-body content schema. Previously, only `request.json()` has been inferred without considering the content-type.
