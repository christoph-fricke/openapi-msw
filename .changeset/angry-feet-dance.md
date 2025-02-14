---
"openapi-msw": minor
---

Added a `request.clone()` type override to continue returning type-safe `OpenApiRequest`s when called. With this, cloning the `request` in resolvers does not lose its type-safety on body parsing methods.
