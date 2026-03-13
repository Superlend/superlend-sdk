import { ResultAsync } from "neverthrow";
import { FetchError, ofetch } from "ofetch";
import type { HttpError, RequestOptions } from "../types";

const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_RETRIES = 2;

const mapFetchError = (error: unknown, timeout: number): HttpError => {
  if (!(error instanceof FetchError)) {
    return {
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Unknown network error",
    };
  }

  if (error.cause instanceof Error) {
    if (error.cause.name === "TimeoutError") {
      return {
        code: "TIMEOUT",
        message: `Request timed out after ${timeout}ms`,
      };
    }

    if (error.cause.name === "AbortError") {
      return { code: "ABORT", message: "Request was aborted" };
    }
  }

  if (error.statusCode) {
    return {
      code: "API_ERROR",
      message: `HTTP ${error.statusCode}: ${error.statusMessage ?? error.message}`,
      status: error.statusCode,
    };
  }

  return { code: "NETWORK_ERROR", message: error.message };
};

export const request = <T>(
  url: string,
  options: RequestOptions = {},
): ResultAsync<T, HttpError> => {
  const {
    method = "GET",
    body,
    headers = {},
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
  } = options;

  return ResultAsync.fromPromise(
    ofetch<T>(url, { method, body, headers, timeout, retry: retries }),
    (error) => mapFetchError(error, timeout),
  );
};
