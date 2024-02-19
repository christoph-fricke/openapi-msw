---
"openapi-msw": patch
---

Fixed endpoints with no specified query params allow any query key in the `query` helper. Now, providing any query key causes a type error.
