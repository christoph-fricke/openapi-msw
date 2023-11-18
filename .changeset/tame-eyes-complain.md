---
"openapi-msw": patch
---

Fixed a type mismatch between path fragments and the values provided at runtime, which are always strings. Now all path-fragments are typed as string, except for string literals which are preserved. This fixes bug [#22](https://github.com/christoph-fricke/openapi-msw/issues/22).

```typescript
const handler = http.get("/resource/{count}", ({ params }) => {
  // Previously calling "parseInt(...)" caused a type error when count was typed as number.
  const count = parseInt(params.count);

  return HttpResponse.json({ count });
});
```
