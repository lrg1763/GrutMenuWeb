import { createContext, useContext } from 'react'

const LangContext = createContext('ru')

export function useLangContext() {
  const context = useContext(LangContext)
  if (context === undefined) {
    throw new Error('useLangContext must be used within a LangProvider')
  }
  return context
}

export function LangProvider({ lang, setLang, children }) {
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}
