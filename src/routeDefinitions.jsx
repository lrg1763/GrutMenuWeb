import AboutPage from './pages/AboutPage'
import MenuPage from './pages/MenuPage'
import BanquetsPage from './pages/BanquetsPage'
import GalleryPage from './pages/GalleryPage'
import EventsPage from './pages/EventsPage'
import LoyaltyPage from './pages/LoyaltyPage'
import CocktailsPage from './pages/CocktailsPage'
import BookingPage from './pages/BookingPage'
import ContactsPage from './pages/ContactsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import PersonalDataPolicyPage from './pages/PersonalDataPolicyPage'
import DownloadMenuPage from './pages/DownloadMenuPage'

/** Path, i18n nav key, page component, document meta — single source for router + header nav + meta. */
export const ROUTE_ENTRIES = [
  {
    path: '/about',
    navKey: 'navAbout',
    Component: AboutPage,
    meta: { titleKey: 'pageTitleAbout', descriptionKey: 'pageDescriptionAbout' },
  },
  {
    path: '/menu',
    navKey: 'navMenu',
    Component: MenuPage,
    meta: { titleKey: 'pageTitleMenu', descriptionKey: 'pageDescriptionMenu' },
  },
  {
    path: '/banquets',
    navKey: 'navBankety',
    Component: BanquetsPage,
    meta: { titleKey: 'pageTitleBanquets', descriptionKey: 'pageDescriptionBanquets' },
  },
  {
    path: '/gallery',
    navKey: 'navGallery',
    Component: GalleryPage,
    meta: { titleKey: 'pageTitleGallery', descriptionKey: 'pageDescriptionGallery' },
  },
  {
    path: '/events',
    navKey: 'navEvents',
    Component: EventsPage,
    meta: { titleKey: 'pageTitleEvents', descriptionKey: 'pageDescriptionEvents' },
  },
  {
    path: '/loyalty',
    navKey: 'navLoyalty',
    Component: LoyaltyPage,
    meta: { titleKey: 'pageTitleLoyalty', descriptionKey: 'pageDescriptionLoyalty' },
  },
  {
    path: '/cocktails',
    navKey: 'navCocktails',
    Component: CocktailsPage,
    meta: { titleKey: 'pageTitleCocktails', descriptionKey: 'pageDescriptionCocktails' },
  },
  {
    path: '/booking',
    navKey: 'navBooking',
    Component: BookingPage,
    meta: { titleKey: 'pageTitleBooking', descriptionKey: 'pageDescriptionBooking' },
  },
  {
    path: '/contacts',
    navKey: 'navContacts',
    Component: ContactsPage,
    meta: { titleKey: 'pageTitleContacts', descriptionKey: 'pageDescriptionContacts' },
  },
]

/** Utility pages: not in main nav. */
export const UTILITY_ROUTE_ENTRIES = [
  {
    path: '/menu/download',
    Component: DownloadMenuPage,
    meta: { titleKey: 'pageTitleDownloadMenu', descriptionKey: 'pageDescriptionDownloadMenu' },
  },
]

/** Legal pages: not in main nav; footer links + router + meta from here. */
export const LEGAL_ROUTE_ENTRIES = [
  {
    path: '/privacy',
    Component: PrivacyPolicyPage,
    meta: { titleKey: 'pageTitlePrivacy', descriptionKey: 'pageDescriptionPrivacy' },
    footerLabelKey: 'footerPrivacy',
  },
  {
    path: '/personal-data',
    Component: PersonalDataPolicyPage,
    meta: { titleKey: 'pageTitlePersonalData', descriptionKey: 'pageDescriptionPersonalData' },
    footerLabelKey: 'footerPersonalData',
  },
]

export const APP_LAYOUT_ROUTES = [...ROUTE_ENTRIES, ...UTILITY_ROUTE_ENTRIES, ...LEGAL_ROUTE_ENTRIES]

export const NAV_ROUTES = ROUTE_ENTRIES.map(({ path, navKey }) => ({ path, navKey }))
