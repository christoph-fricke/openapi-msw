---
"openapi-msw": minor
---

Removed dependency on _openapi-typescript-helpers_. We were depending on an older version without being able to easily update. With this refactoring, your projects should no longer resolve to multiple versions of _openapi-typescript-helpers_.
