
// Repeated utility functions

export function getPropFromUrl(propName: string): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return params.get(propName) ?? undefined;
}