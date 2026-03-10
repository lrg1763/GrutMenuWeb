import { createContext } from 'react'

const ThemeContext = createContext('light')

export function ThemeProvider({ theme, setTheme, children }) {
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
