
import { returnDummyData } from "./dummyData";

// Helper to create a stable, unique key for each request (sorts object keys)
function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys.map(k => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",")}}`;
}

function getRequestKey(method: string, path: string, body: unknown, query?: QueryParams) {
  return stableStringify({ method, path, body, query });
}

// In-flight and completed request cache (persists done responses in sessionStorage)
type InflightCacheEntry =
  | { status: "pending"; promise: Promise<any>; timestamp: number }
  | { status: "done"; response: any; error?: unknown; timestamp: number };
const inflightRequests = new Map<string, InflightCacheEntry>();
const DEDUPE_WINDOW_MS = 1000;

// Cache helpers moved to utilities/helper
import {
  loadStorageCache,
  saveStorageCache,
  getCacheEntry,
  setCacheEntry,
  cleanupCacheEntry,
  StorageCacheEntry
} from "../utilities/helper";

type QueryPrimitive = string | number | boolean | null | undefined;
type QueryValue = QueryPrimitive | QueryPrimitive[];

export type QueryParams = Record<string, QueryValue>;


export type GenericRequestConfig = {
  query?: QueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
  body?: any;
  method?: RequestMethod;
  path?: string;
};

const defaultConfig: Omit<GenericRequestConfig, "path"> = {
  headers: { "Content-Type": "application/json" },
};

// Helper to set the Authorization header globally
export function setAuthToken(token: string | null) {
  if (token) {
    defaultConfig.headers = {
      ...defaultConfig.headers,
      Authorization: `Bearer ${token}`,
    };
  } else {
    // Remove the Authorization header
    const { Authorization, ...rest } = defaultConfig.headers || {};
    defaultConfig.headers = rest;
  }
}

export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const SHOULD_USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true";

function joinUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function toQueryString(query?: QueryParams): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === null || rawValue === undefined) {
      continue;
    }

    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      if (value === null || value === undefined) {
        continue;
      }

      params.append(key, String(value));
    }
  }

  const search = params.toString();
  return search ? `?${search}` : "";
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

type RequestMethod = "GET" | "POST" | "PUT";


async function genericRequest<TResponse = any>(config: GenericRequestConfig): Promise<TResponse> {
  const method = config.method ?? "GET";
  const path = config.path ?? "";
  const query = config.query;
  const body = config.body;
  const headers = { ...defaultConfig.headers, ...config.headers };
  const signal = config.signal;
  const key = getRequestKey(method, path, body, query);
  const now = Date.now();

  // Unified cache check
  const cacheEntry = getCacheEntry(key, now, inflightRequests, DEDUPE_WINDOW_MS);
  if (cacheEntry) {
    if (cacheEntry.status === "pending") {
      return cacheEntry.promise as Promise<TResponse>;
    } else if (cacheEntry.status === "done") {
      if (cacheEntry.error !== undefined) {
        throw deserializeError(cacheEntry.error);
      }
      return Promise.resolve(cacheEntry.response as TResponse);
    }
  }

  const url = `${joinUrl(path)}${toQueryString(query)}`;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const reqPromise = (async () => {
    let ts = Date.now();
    try {
      const response = await fetch(url, {
        method,
        headers: isFormData ? { ...headers } : { "Content-Type": "application/json", ...headers },
        body: body === undefined ? undefined : isFormData ? (body as BodyInit) : JSON.stringify(body),
        signal,
      });
      const payload = await parseResponsePayload(response);
      if (!response.ok) {
        throw new HttpError(`Request failed with status ${response.status}`, response.status, payload);
      }
      // On success, cache the response for the dedupe window
      ts = Date.now();
      setCacheEntry(key, { response: payload, timestamp: ts }, inflightRequests);
      setTimeout(() => {
        cleanupCacheEntry(key, inflightRequests);
      }, DEDUPE_WINDOW_MS);
      return payload as TResponse;
    } catch (err) {
      // On error, cache the error for the dedupe window
      ts = Date.now();
      const serialized = serializeError(err);
      setCacheEntry(key, { error: serialized, timestamp: ts }, inflightRequests);
      setTimeout(() => {
        cleanupCacheEntry(key, inflightRequests);
      }, DEDUPE_WINDOW_MS);
      throw err;
    }
  })();
  inflightRequests.set(key, { status: "pending", promise: reqPromise, timestamp: now });
  return reqPromise;

// Serialize error to string for storage
function serializeError(err: unknown): string {
  if (err instanceof Error) {
    return JSON.stringify({
      name: err.name,
      message: err.message,
      stack: err.stack,
      status: (err as any).status,
      payload: (err as any).payload,
    });
  }
  return JSON.stringify({ message: String(err) });
}

// Deserialize error from string
function deserializeError(str: string): Error {
  try {
    const obj = JSON.parse(str);
    if (obj && obj.name === "HttpError") {
      const e = new HttpError(obj.message, obj.status, obj.payload);
      e.stack = obj.stack;
      return e;
    }
    const e = new Error(obj.message || "Unknown error");
    e.name = obj.name || "Error";
    e.stack = obj.stack;
    return e;
  } catch {
    return new Error(str);
  }
}
}

export function httpGet<TResponse = any>(path: string, config: GenericRequestConfig = {}) {
  if (SHOULD_USE_DUMMY_DATA) {
    const dummyResponse = returnDummyData("GET", path, config);
    return Promise.resolve(<TResponse>dummyResponse);
  }

  const mergedConfig = { ...defaultConfig, ...config, method: "GET", path };
  const response = genericRequest<TResponse>(mergedConfig);
  return response;
}

export function httpPost<TResponse = any, TBody = unknown>(
  path: string,
  body: TBody,
  config: GenericRequestConfig = {}
) {
  if (SHOULD_USE_DUMMY_DATA) {
    const dummyResponse = returnDummyData("POST", path, body);
    return Promise.resolve(<TResponse>dummyResponse);
  }

  const mergedConfig = { ...defaultConfig, ...config, method: "POST", path, body };
  const response = genericRequest<TResponse>(mergedConfig);
  return response;
}

export function httpPut<TResponse = any, TBody = unknown>(
  path: string,
  body: TBody,
  config: GenericRequestConfig = {}
) {
  if (SHOULD_USE_DUMMY_DATA) {
    const dummyResponse = returnDummyData("PUT", path, body);
    return Promise.resolve(<TResponse>dummyResponse);
  }

  const mergedConfig = { ...defaultConfig, ...config, method: "PUT", path, body };
  const response = genericRequest<TResponse>(mergedConfig);
  return response;
}

export function httpPatch<TResponse = any, TBody = unknown>(
  path: string,
  body: TBody,
  config: GenericRequestConfig = {}
) {
  if (SHOULD_USE_DUMMY_DATA) {
    const dummyResponse = returnDummyData("PATCH", path, body);
    return Promise.resolve(<TResponse>dummyResponse);
  }
  
  const mergedConfig = { ...defaultConfig, ...config, method: "PATCH", path, body };
  const response = genericRequest<TResponse>(mergedConfig);
  return response;
}
