import { BrowserRouter } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import { useLang } from './hooks/useLang'
import AppRoutes from './routes'
import './App.css'

export default function App() {
  const [lang, setLang] = useLang()

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LangProvider lang={lang} setLang={setLang}>
        <AppRoutes />
      </LangProvider>
    </BrowserRouter>
  )
}
