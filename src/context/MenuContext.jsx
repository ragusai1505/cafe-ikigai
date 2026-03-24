import { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_MENU } from '../data/menuData'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ikigai_menu_v2')
      setMenuItems(stored ? JSON.parse(stored) : DEFAULT_MENU)
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
    persist(DEFAULT_MENU)
  }

  return (
    <MenuContext.Provider value={{ menuItems, loading, addItem, updateItem, deleteItem, toggleAvailability, toggleFeatured, resetToDefault }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)
