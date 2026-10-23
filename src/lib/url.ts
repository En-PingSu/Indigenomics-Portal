// Supplier-entered website links. Only http(s) URLs are stored or rendered, so a
// `javascript:` or `data:` value can never become a clickable link on a public page.

/** The URL if it's http(s), otherwise undefined. Use when rendering a stored link. */
export function safeHttpUrl(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Normalize a submitted website: add https:// to a bare domain; "" if not a valid http(s) URL. */
export function normalizeWebsite(input: string): string {
  const value = input.trim();
  if (!value) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  const safe = safeHttpUrl(withScheme);
  // A bare word ("not a url") parses as a hostname; require a dot so it isn't stored.
  return safe && new URL(safe).hostname.includes(".") ? safe : "";
}
