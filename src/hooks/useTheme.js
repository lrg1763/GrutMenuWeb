import { useState, useEffect } from 'react'
import { THEMES } from '../constants'

export function useTheme() {
  const [theme] = useState(THEMES.DARK)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES.DARK)
  }, [])

  return [theme, () => {}]
}
