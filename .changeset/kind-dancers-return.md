---
"openapi-msw": patch
---

Fixed type inference for extended JSON mime types, such as `application/problem+json`. Previously, APIs like `response(...).json` would be typed as `never` for such mime types. Now, they will be properly typed.
