export function buildAsyncDataKey(
  resource: string,
  locale: string,
  query: Record<string, string | number | boolean | null | undefined> = {},
) {
  const normalizedQuery = Object.entries(query)
    .filter(([, value]) => value !== null && value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${resource}:${locale}:${normalizedQuery}`;
}
