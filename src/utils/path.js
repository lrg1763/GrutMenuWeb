/** React Router pathname → canonical path for comparisons (no trailing slash; root is `/`). */
export function normalizePathname(pathname) {
  return pathname.replace(/\/$/, '') || '/'
}
