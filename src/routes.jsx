import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import { APP_LAYOUT_ROUTES } from './routeDefinitions'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {APP_LAYOUT_ROUTES.map(({ path, Component }) => (
          <Route key={path} path={path.slice(1)} element={<Component />} />
        ))}
      </Route>
    </Routes>
  )
}
