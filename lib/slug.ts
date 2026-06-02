export function toUsernameSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function isReservedUsername(username: string) {
  return [
    "api",
    "admin",
    "apple-touch-icon",
    "dashboard",
    "favicon",
    "favicon-ico",
    "favicon-png",
    "login",
    "logout",
    "auth",
    "robots",
    "robots-txt",
    "settings",
    "sitemap",
    "sitemap-xml",
    "pricing",
    "terms",
    "privacy"
  ].includes(username.toLowerCase());
}

export function isProfileUsernameCandidate(value: string) {
  const trimmed = value.trim();
  const username = toUsernameSlug(trimmed);

  return Boolean(trimmed) && !trimmed.includes(".") && Boolean(username) && !isReservedUsername(username);
}
