export function getClientSiteUrl() {
  const envSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envSite) {
    return envSite.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
}
