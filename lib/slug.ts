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
    "dashboard",
    "login",
    "logout",
    "auth",
    "settings",
    "pricing",
    "terms",
    "privacy"
  ].includes(username.toLowerCase());
}
