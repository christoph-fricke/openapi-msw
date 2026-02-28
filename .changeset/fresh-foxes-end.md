---
"openapi-msw": minor
---

Added support for _readOnly_/_writeOnly_ annotations in OpenAPI schemas. When OpenAPI-TS is configured to generate `$Read<T>`/`$Write<T>` markers, OpenAPI-MSW will process them in request and response types. Request types will not contain properties marked with _readOnly_, and response types will not contain properties marked with _writeOnly_.
