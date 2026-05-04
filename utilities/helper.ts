// --- HTTP Client Cache Helpers ---
const STORAGE_KEY = "httpClientDedupeCache";
export type StorageCacheEntry = { response?: unknown; error?: string; timestamp: number };

export function loadStorageCache(): Record<string, StorageCacheEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveStorageCache(cache: Record<string, StorageCacheEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
}

export function getCacheEntry(
  key: string,
  now: number,
  inflightRequests: Map<string, any>,
  DEDUPE_WINDOW_MS: number
): any {
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

export function setCacheEntry(
  key: string,
  entry: { response?: unknown; error?: string; timestamp: number },
  inflightRequests: Map<string, any>
) {
  inflightRequests.set(key, { status: "done", response: entry.response, error: entry.error, timestamp: entry.timestamp });
  const storageCache = loadStorageCache();
  storageCache[key] = { response: entry.response, error: entry.error, timestamp: entry.timestamp };
  saveStorageCache(storageCache);
}

export function cleanupCacheEntry(
  key: string,
  inflightRequests: Map<string, any>
) {
  inflightRequests.delete(key);
  const storageCache = loadStorageCache();
  if (storageCache[key]) {
    delete storageCache[key];
    saveStorageCache(storageCache);
  }
}

// Repeated utility functions

export function getPropFromUrl(propName: string): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return params.get(propName) ?? undefined;
}

export const formatUpdatedDate = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function closeModal(router: any, navigateTo: string = "/tasks") {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push(navigateTo);
};