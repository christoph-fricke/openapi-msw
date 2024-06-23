---
"openapi-msw": minor
---

Added "content-length" header for `response(...).empty()`. If no "content-length" header is provided in the response init, the "content-length" header is now set with the value "0". See #56 for more details.
