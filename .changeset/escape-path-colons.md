---
"openapi-msw": patch
---

Fixed OpenAPI paths with literal colons, such as `/resource/{id}:archive`. Previously, MSW interpreted them as path parameters. Now, those colons are escaped and matched literally as static parts of the path.
