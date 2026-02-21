import { useState, useEffect } from 'react'
import { DEFAULT_MENU, MENU_JSON_PATH } from '../constants'

export function useMenuData() {
  const [menuData, setMenuData] = useState(DEFAULT_MENU)

  useEffect(() => {
    fetch(MENU_JSON_PATH)
      .then((res) => res.json())
      .then(setMenuData)
      .catch(() => setMenuData(DEFAULT_MENU))
  }, [])

  return {
    sections: menuData.sections,
    dishes: menuData.dishes,
  }
}
