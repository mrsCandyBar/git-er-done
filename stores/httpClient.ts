import { returnDummyData } from "./dummyData";

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
  const url = `${joinUrl(path)}${toQueryString(query)}`;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
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
  return payload as TResponse;
}

export function httpGet<TResponse>(path: string, config: RequestConfig = {}) {
  console.log(`HTTP GET: ${path} with config:`, config);

  if (SHOULD_USE_DUMMY_DATA) {
    return <TResponse>returnDummyData("GET", path);
  } else {
    return request<TResponse>("GET", path, config);
  }
}

export function httpPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config: RequestConfig = {}
) {
  console.log(`HTTP POST: ${path} with config:`, body, config);

  if (SHOULD_USE_DUMMY_DATA) {
    return <TResponse>returnDummyData("POST", path, body);
  } else {
    return request<TResponse>("POST", path, { ...config, body });
  }
}

export function httpPut<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config: RequestConfig = {}
) {
  console.log(`HTTP PUT: ${path} with config:`, body, config);

  if (SHOULD_USE_DUMMY_DATA) {
    return <TResponse>returnDummyData("PUT", path, body);
  } else {
    return request<TResponse>("PUT", path, { ...config, body });
  }
}
