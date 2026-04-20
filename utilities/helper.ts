
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