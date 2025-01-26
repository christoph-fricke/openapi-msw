---
"openapi-msw": minor
---

Removed dependency on `openapi-typescript-helpers`. We were depending on an older version without being able to easily update. With this refactoring, your projects should no longer resolve to multiple versions of `openapi-typescript-helpers`.
