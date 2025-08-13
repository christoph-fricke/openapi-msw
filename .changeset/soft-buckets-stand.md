---
"openapi-msw": major
---

Removed CommonJS compilation and exports. OpenAPI-MSW now publishes ESM only. All actively maintained Node.js versions support requiring ESM, so `const { createOpenApiHttp } = require("openapi-msw");` will still work.
