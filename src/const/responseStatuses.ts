export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export type MapHttpStatusCode<T> = 
    T extends 100 ? HttpStatusCode.Continue :
    T extends 101 ? HttpStatusCode.SwitchingProtocols :
    T extends 102 ? HttpStatusCode.Processing :
    T extends 103 ? HttpStatusCode.EarlyHints :
    T extends 200 ? HttpStatusCode.Ok :
    T extends 201 ? HttpStatusCode.Created :
    T extends 202 ? HttpStatusCode.Accepted :
    T extends 203 ? HttpStatusCode.NonAuthoritativeInformation :
    T extends 204 ? HttpStatusCode.NoContent :
    T extends 205 ? HttpStatusCode.ResetContent :
    T extends 206 ? HttpStatusCode.PartialContent :
    T extends 207 ? HttpStatusCode.MultiStatus :
    T extends 208 ? HttpStatusCode.AlreadyReported :
    T extends 226 ? HttpStatusCode.ImUsed :
    T extends 300 ? HttpStatusCode.MultipleChoices :
    T extends 301 ? HttpStatusCode.MovedPermanently :
    T extends 302 ? HttpStatusCode.Found :
    T extends 303 ? HttpStatusCode.SeeOther :
    T extends 304 ? HttpStatusCode.NotModified :
    T extends 305 ? HttpStatusCode.UseProxy :
    T extends 306 ? HttpStatusCode.Unused :
    T extends 307 ? HttpStatusCode.TemporaryRedirect :
    T extends 308 ? HttpStatusCode.PermanentRedirect :
    T extends 400 ? HttpStatusCode.BadRequest :
    T extends 401 ? HttpStatusCode.Unauthorized :
    T extends 402 ? HttpStatusCode.PaymentRequired :
    T extends 403 ? HttpStatusCode.Forbidden :
    T extends 404 ? HttpStatusCode.NotFound :
    T extends 405 ? HttpStatusCode.MethodNotAllowed :
    T extends 406 ? HttpStatusCode.NotAcceptable :
    T extends 407 ? HttpStatusCode.ProxyAuthenticationRequired :
    T extends 408 ? HttpStatusCode.RequestTimeout :
    T extends 409 ? HttpStatusCode.Conflict :
    T extends 410 ? HttpStatusCode.Gone :
    T extends 411 ? HttpStatusCode.LengthRequired :
    T extends 412 ? HttpStatusCode.PreconditionFailed :
    T extends 413 ? HttpStatusCode.PayloadTooLarge :
    T extends 414 ? HttpStatusCode.UriTooLong :
    T extends 415 ? HttpStatusCode.UnsupportedMediaType :
    T extends 416 ? HttpStatusCode.RangeNotSatisfiable :
    T extends 417 ? HttpStatusCode.ExpectationFailed :
    T extends 418 ? HttpStatusCode.ImATeapot :
    T extends 421 ? HttpStatusCode.MisdirectedRequest :
    T extends 422 ? HttpStatusCode.UnprocessableEntity :
    T extends 423 ? HttpStatusCode.Locked :
    T extends 424 ? HttpStatusCode.FailedDependency :
    T extends 425 ? HttpStatusCode.TooEarly :
    T extends 426 ? HttpStatusCode.UpgradeRequired :
    T extends 428 ? HttpStatusCode.PreconditionRequired :
    T extends 429 ? HttpStatusCode.TooManyRequests :
    T extends 431 ? HttpStatusCode.RequestHeaderFieldsTooLarge :
    T extends 451 ? HttpStatusCode.UnavailableForLegalReasons :
    T extends 500 ? HttpStatusCode.InternalServerError :
    T extends 501 ? HttpStatusCode.NotImplemented :
    T extends 502 ? HttpStatusCode.BadGateway :
    T extends 503 ? HttpStatusCode.ServiceUnavailable :
    T extends 504 ? HttpStatusCode.GatewayTimeout :
    T extends 505 ? HttpStatusCode.HttpVersionNotSupported :
    T extends 506 ? HttpStatusCode.VariantAlsoNegotiates :
    T extends 507 ? HttpStatusCode.InsufficientStorage :
    T extends 508 ? HttpStatusCode.LoopDetected :
    T extends 510 ? HttpStatusCode.NotExtended :
    T extends 511 ? HttpStatusCode.NetworkAuthenticationRequired :
    never;
