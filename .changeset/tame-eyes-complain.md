---
"openapi-msw": patch
---

Fixed a type mismatch between path fragment types and the values provided at runtime, which are always strings. Now all path-fragments are typed as string. If a fragment's schema is a string constrained by an enum, the resulting string literals are preserved. This fixes bug [#22](https://github.com/christoph-fricke/openapi-msw/issues/22).

```typescript
const handler = http.get("/resource/{id}", ({ params }) => {
  // Previously calling "parseInt(...)" caused a type error
  // when the schema type for "id" is defined as number.
  const id = parseInt(params.id);

  return HttpResponse.json({ id });
});
```
