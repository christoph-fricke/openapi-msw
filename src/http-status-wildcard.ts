/**
 * Mapping of status wildcards allowed in the OpenAPI specification to defined
 * HTTP status codes.
 *
 * @see Allowed Wildcards: https://spec.openapis.org/oas/v3.1.0#patterned-fields-0
 * @see Default Code: https://spec.openapis.org/oas/v3.1.0#fixed-fields-13
 * @see Specified Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export interface Wildcard {
  "1XX": 100 | 101 | 102 | 103;
  "2XX": 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
  "3XX": 300 | 301 | 302 | 303 | 304 | 307 | 308;
  "5XX": 500 | 501 | 502 | 503 | 504 | 507 | 508 | 510 | 511;
  "4XX":
    | 400
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 409
    | 410
    | 411
    | 412
    | 413
    | 414
    | 415
    | 416
    | 417
    | 418
    | 421
    | 422
    | 423
    | 424
    | 425
    | 426
    | 428
    | 429
    | 431
    | 451;
  // Follows OpenAPI-TS in considering "default" as only being 4XX or 5XX.
  default: Wildcard["4XX"] | Wildcard["5XX"];
}
