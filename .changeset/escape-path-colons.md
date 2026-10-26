---
"openapi-msw": patch
---

Fixed paths with a literal colon, such as the one before a custom method in `/resource/{id}:archive`. Previously, MSW read the colon as the start of a second path parameter: with MSW v3 such a handler also matched requests for other custom methods, and with MSW v2 it threw when a request was matched against it. Now, those colons are escaped and matched literally.
