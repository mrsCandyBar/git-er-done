
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
  | { status: "pending"; promise: Promise<unknown>; timestamp: number }
  | { status: "done"; response: unknown; error?: unknown; timestamp: number };
const inflightRequests = new Map<string, InflightCacheEntry>();
const DEDUPE_WINDOW_MS = 1000;

// LocalStorage cache helpers (refactored)
const STORAGE_KEY = "httpClientDedupeCache";
type StorageCacheEntry = { response?: unknown; error?: string; timestamp: number };

function loadStorageCache(): Record<string, StorageCacheEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStorageCache(cache: Record<string, StorageCacheEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
}

function getCacheEntry(key: string, now: number) {
  // Check in-memory cache
  const cached = inflightRequests.get(key);
  if (cached && now - cached.timestamp < DEDUPE_WINDOW_MS) {
    return cached;
  }
  // Check localStorage
  const storageCache = loadStorageCache();
  const storageEntry = storageCache[key];
  if (storageEntry && now - storageEntry.timestamp < DEDUPE_WINDOW_MS) {
    if (storageEntry.error !== undefined) {
      inflightRequests.set(key, { status: "done", response: undefined, error: storageEntry.error, timestamp: storageEntry.timestamp });
    } else {
      inflightRequests.set(key, { status: "done", response: storageEntry.response, timestamp: storageEntry.timestamp });
    }
    return inflightRequests.get(key);
  }
  return undefined;
}

function setCacheEntry(key: string, entry: { response?: unknown; error?: string; timestamp: number }) {
  inflightRequests.set(key, { status: "done", response: entry.response, error: entry.error, timestamp: entry.timestamp });
  const storageCache = loadStorageCache();
  storageCache[key] = { response: entry.response, error: entry.error, timestamp: entry.timestamp };
  saveStorageCache(storageCache);
}

function cleanupCacheEntry(key: string) {
  inflightRequests.delete(key);
  const storageCache = loadStorageCache();
  if (storageCache[key]) {
    delete storageCache[key];
    saveStorageCache(storageCache);
  }
}

type QueryPrimitive = string | number | boolean | null | undefined;
type QueryValue = QueryPrimitive | QueryPrimitive[];

export type QueryParams = Record<string, QueryValue>;

export type RequestConfig = {
  query?: QueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

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


async function request<TResponse>(
  method: RequestMethod,
  path: string,
  config: RequestConfig & { body?: unknown } = {}
): Promise<TResponse> {
  const { query, body, headers, signal } = config;
  const key = getRequestKey(method, path, body, query);
  console.log("[httpClient dedupe] key:", key);
  const now = Date.now();



  // Unified cache check
  const cacheEntry = getCacheEntry(key, now);
  if (cacheEntry) {
    console.log("[httpClient dedupe] cache hit", cacheEntry.status);
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

  console.log("[httpClient dedupe] cache miss, making network request");
  const reqPromise = (async () => {
    let ts = Date.now();
    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers,
        },
        body: body === undefined ? undefined : isFormData ? (body as BodyInit) : JSON.stringify(body),
        signal,
      });
      const payload = await parseResponsePayload(response);
      if (!response.ok) {
        throw new HttpError(`Request failed with status ${response.status}`, response.status, payload);
      }
      // On success, cache the response for the dedupe window
      ts = Date.now();
      setCacheEntry(key, { response: payload, timestamp: ts });
      setTimeout(() => {
        cleanupCacheEntry(key);
      }, DEDUPE_WINDOW_MS);
      return payload as TResponse;
    } catch (err) {
      // On error, cache the error for the dedupe window
      ts = Date.now();
      const serialized = serializeError(err);
      setCacheEntry(key, { error: serialized, timestamp: ts });
      setTimeout(() => {
        cleanupCacheEntry(key);
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

export function httpGet<TResponse>(path: string, config: RequestConfig = {}) {
  const response = SHOULD_USE_DUMMY_DATA ? 
    returnDummyData("GET", path, config) : 
    request<TResponse>("GET", path, config);
  
  console.log(`HTTP GET: ${path} with config:`, config);  
  console.log(`HTTP GET RESPONSE:`, response);  
  return response;
}

export function httpPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config: RequestConfig = {}
) {
  console.log(`HTTP POST: ${path} with payload:`, body);
  const response = SHOULD_USE_DUMMY_DATA ?
    <TResponse>returnDummyData("POST", path, body) :
    request<TResponse>("POST", path, { ...config, body });

  console.log(`HTTP POST: ${path} with payload:`, body);  
  console.log(`HTTP POST RESPONSE:`, response); 
  return response;
}

export function httpPut<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config: RequestConfig = {}
) {
  const response = SHOULD_USE_DUMMY_DATA ?
    <TResponse>returnDummyData("PUT", path, body) :
    request<TResponse>("PUT", path, { ...config, body });

  console.log(`HTTP PUT: ${path} with payload:`, body);  
  console.log(`HTTP PUT RESPONSE:`, response); 
  return response;
}
