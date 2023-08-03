export async function fetchWithTimeout(url: string, options = {}) {
  const controller = new AbortController();
  // 20 seconds timeout
  const id = setTimeout(() => controller.abort(), 1000 * 20);
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}
