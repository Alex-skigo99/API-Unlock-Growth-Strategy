const isDev = process.env.NODE_ENV === "development";

const shortenStack = (stack) => stack?.split?.("\n    ")?.[1] ?? stack;
const crumpleStack = (stack) => (shortenStack(stack)?.split?.("\\api")?.[1] || shortenStack(stack))?.replaceAll?.("\\", "/");
export const getShortenedStacktrace = (stack) => (isDev ? shortenStack(stack) : crumpleStack(stack));

export const convertStatusToErrorCode = (status) => {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 402:
      return "PAYMENT_REQUIRED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 405:
      return "METHOD_NOT_ALLOWED";
    case 406:
      return "NOT_ACCEPTABLE";
    case 407:
      return "PROXY_AUTHENTICATION_REQUIRED";
    case 408:
      return "REQUEST_TIMEOUT";
    case 409:
      return "CONFLICT";
    case 410:
      return "GONE";
    case 411:
      return "LENGTH_REQUIRED";
    case 412:
      return "PRECONDITION_FAILED";
    case 413:
      return "PAYLOAD_TOO_LARGE";
    case 414:
      return "URI_TOO_LONG";
    case 415:
      return "UNSUPPORTED_MEDIA_TYPE";
    case 416:
      return "RANGE_NOT_SATISFIABLE";
    case 417:
      return "EXPECTATION_FAILED";
    case 421:
      return "MISDIRECTED_REQUEST";
    case 422:
      return "UNPROCESSABLE_ENTITY";
    case 423:
      return "LOCKED";
    case 424:
      return "FAILED_DEPENDENCY";
    case 426:
      return "UPGRADE_REQUIRED";
    case 428:
      return "PRECONDITION_REQUIRED";
    case 429:
      return "TOO_MANY_REQUESTS";
    case 431:
      return "REQUEST_HEADER_FIELDS_TOO_LARGE";
    case 451:
      return "UNAVAILABLE_FOR_LEGAL_REASONS";
    case 500:
      return "INTERNAL_SERVER_ERROR";
    case 501:
      return "NOT_IMPLEMENTED";
    case 503:
      return "SERVICE_UNAVAILABLE";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
};
