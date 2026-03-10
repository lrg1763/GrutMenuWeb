import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { ThemeProvider } from './context/ThemeContext'
import { useLang } from './hooks/useLang'
import { useTheme } from './hooks/useTheme'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CocktailsPage from './pages/CocktailsPage'
import { NAV_ROUTES } from './constants'
import './App.css'

const ROUTE_COMPONENTS = {
  '/menu': MenuPage,
  '/cocktails': CocktailsPage,
}

function AppContent() {
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

export default function App() {
  const [lang, setLang] = useLang()
  const [theme, setTheme] = useTheme()

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <LangProvider lang={lang} setLang={setLang}>
          <AppContent />
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
