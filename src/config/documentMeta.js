import { LEGAL_ROUTE_ENTRIES, ROUTE_ENTRIES, UTILITY_ROUTE_ENTRIES } from '../routeDefinitions'

function metaByPathFromEntries(entries) {
  return Object.fromEntries(entries.map((e) => [e.path, e.meta]))
}

/** Maps canonical path → translation keys for document.title and meta description. */
export const DOCUMENT_META_BY_PATH = {
  '/': { titleKey: 'pageTitleHome', descriptionKey: 'pageDescriptionHome' },
  ...metaByPathFromEntries(ROUTE_ENTRIES),
  ...metaByPathFromEntries(UTILITY_ROUTE_ENTRIES),
  ...metaByPathFromEntries(LEGAL_ROUTE_ENTRIES),
}
