import { useState, useCallback, useEffect } from 'react'
import { DEFAULT_MENU, MENU_JSON_PATH } from '../constants'

export function useMenuData() {
  const [menuData, setMenuData] = useState(DEFAULT_MENU)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetch(MENU_JSON_PATH)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed')
        return res.json()
      })
      .then((data) => {
        setMenuData(data)
        setError(false)
      })
      .catch(() => {
        setMenuData(DEFAULT_MENU)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    sections: menuData.sections,
    dishes: menuData.dishes,
    loading,
    error,
    retry: load,
  }
}
