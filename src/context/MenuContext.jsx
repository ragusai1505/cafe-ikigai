import { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_MENU } from '../data/menuData'

const MenuContext = createContext(null)

// Change this version number every time you update menuData.js
// This forces ALL browsers to reload fresh data automatically
const MENU_VERSION = 'v6'

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('ikigai_menu_version')
      const stored = localStorage.getItem('ikigai_menu_v2')

      // Version mismatch or no data = load fresh from menuData.js
      if (storedVersion !== MENU_VERSION || !stored) {
        localStorage.setItem('ikigai_menu_version', MENU_VERSION)
        localStorage.setItem('ikigai_menu_v2', JSON.stringify(DEFAULT_MENU))
        setMenuItems(DEFAULT_MENU)
      } else {
        setMenuItems(JSON.parse(stored))
      }
    } catch {
      setMenuItems(DEFAULT_MENU)
    }
    setLoading(false)
  }, [])

  const persist = (items) => {
    setMenuItems(items)
    localStorage.setItem('ikigai_menu_v2', JSON.stringify(items))
  }

  const addItem = (data) => {
    const item = { ...data, id: `item_${Date.now()}`, featured: data.featured || false }
    persist([...menuItems, item])
    return item
  }

  const updateItem = (id, data) => {
    persist(menuItems.map(i => i.id === id ? { ...i, ...data } : i))
  }

  const deleteItem = (id) => {
    persist(menuItems.filter(i => i.id !== id))
  }

  const toggleAvailability = (id) => {
    const item = menuItems.find(i => i.id === id)
    if (item) updateItem(id, { available: !item.available })
  }

  const toggleFeatured = (id) => {
    const item = menuItems.find(i => i.id === id)
    if (item) updateItem(id, { featured: !item.featured })
  }

  const resetToDefault = () => {
    localStorage.setItem('ikigai_menu_version', MENU_VERSION)
    persist(DEFAULT_MENU)
  }

  return (
    <MenuContext.Provider value={{ menuItems, loading, addItem, updateItem, deleteItem, toggleAvailability, toggleFeatured, resetToDefault }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)
