import { UserProfile } from "@/models/userProfile";
import { dummyCurrentUser, dummyTasks } from "./dummyData";
import { CompleteTaskPayload, TaskRecord } from "./taskStore";

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
  if (SHOULD_USE_DUMMY_DATA) {
    if (path.includes("/api/users/get/")) {
      dummySelectedUser = dummyCurrentUser;
      return <TResponse>dummySelectedUser;

    } else if (path.includes("/api/tasks/getAll")) {
      dummyTaskListCache = dummyTasks
      return <TResponse>dummyTaskListCache;

    } else if (path.includes("/api/tasks/")) {
      const taskId = path.split("/").pop();
      const foundTask = dummyTasks.find((entry) => entry.id === taskId);
			if (!foundTask) { throw new Error(`Task ${taskId} not found`); }
      dummySelectedTask = foundTask;
      return <TResponse>dummySelectedTask;
    }
    
  } else {
    return request<TResponse>("GET", path, config);
  }
}

let dummySelectedUser: UserProfile | null = null;
let dummySelectedTask: TaskRecord | null = null;
let dummyTaskListCache: TaskRecord[] = [];

export function httpPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config: RequestConfig = {}
) {
  if (SHOULD_USE_DUMMY_DATA) {
    if (path.includes("/api/users/login/google")) {
      dummySelectedUser = dummyCurrentUser;
      return <TResponse>dummySelectedUser;

    } else if (path.includes("/api/tasks")) {
      dummyTaskListCache = [...body as unknown as TaskRecord[], ...dummyTasks];
      return <TResponse>dummyTaskListCache;
    }
    
  } else {
    return request<TResponse>("POST", path, { ...config, body });
  }
}

export function httpPut<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  config: RequestConfig = {}
) {

  if (SHOULD_USE_DUMMY_DATA) {
    if (path.includes("/api/users/me") || path.includes("/api/users/updateStatus/")) {
      dummySelectedUser = dummySelectedUser ?  {
				...dummySelectedUser,
				...body,
			} : {
        ...dummyCurrentUser,
        ...body,
      }
      return <TResponse>dummySelectedUser;

    } else if (path.includes("/api/tasks/start/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				status: "busy"
			} : {
        ...dummyTasks[0],
        status: "busy"
      };

      return <TResponse>dummySelectedTask;
      
    } else if (path.includes("/api/tasks/pause/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				status: "waiting"
			} : {
        ...dummyTasks[0],
        status: "waiting"
      };

      return <TResponse>dummySelectedTask;
      
    } else if (path.includes("/api/tasks/")) {
      dummySelectedTask = dummySelectedTask ? {
				...dummySelectedTask,
				...body
			} : {
        ...dummyTasks[0],
        ...body
      };

      return <TResponse>dummySelectedTask;

    } else if (path.includes("/complete")) {
      if (body) {
        dummySelectedTask = dummySelectedTask ? {
          ...dummySelectedTask,
          status: "complete",
          completed: { ...body },
        } : {
          ...dummyTasks[0],
          status: "complete",
          completed: { ...body },
        };
        return <TResponse>dummySelectedTask;
      }
    }

  } else {
    return request<TResponse>("PUT", path, { ...config, body });
  }
}
