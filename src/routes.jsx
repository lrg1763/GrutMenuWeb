import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CocktailsPage from './pages/CocktailsPage'
import ContactsPage from './pages/ContactsPage'
import { NAV_ROUTES } from './constants'

const ROUTE_COMPONENTS = {
  '/menu': MenuPage,
  '/cocktails': CocktailsPage,
  '/contacts': ContactsPage,
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {NAV_ROUTES.map(({ path }) => {
          const Component = ROUTE_COMPONENTS[path]
          return (
            <Route
              key={path}
              path={path.slice(1)}
              element={Component ? <Component /> : null}
            />
          )
        })}
      </Route>
    </Routes>
  )
}
