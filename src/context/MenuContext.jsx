import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc,
  deleteDoc, doc, setDoc, onSnapshot, writeBatch
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { DEFAULT_MENU } from '../data/menuData'
import toast from 'react-hot-toast'

const MenuContext = createContext(null)
const COLLECTION = 'menu'

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    let seeding = false

    const unsub = onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        if (snapshot.empty && !seeding) {
          seeding = true
          seedDefaultMenu()
        } else if (!snapshot.empty) {
          // Clear localStorage — always use Firebase as source of truth
          localStorage.removeItem('ikigai_menu_v2')
          localStorage.removeItem('ikigai_menu_version')

          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
          setMenuItems(items)
          setFirebaseReady(true)
          setLoading(false)
        }
      },
      (error) => {
        console.error('Firebase error:', error)
        // Fallback to default menu if Firebase fails
        setMenuItems(DEFAULT_MENU)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [])

  const seedDefaultMenu = async () => {
    try {
      const batch = writeBatch(db)
      DEFAULT_MENU.forEach((item, index) => {
        const { id, ...data } = item
        const ref = doc(db, COLLECTION, id)
        batch.set(ref, { ...data, order: index })
      })
      await batch.commit()
    } catch (error) {
      console.error('Seed error:', error)
      setMenuItems(DEFAULT_MENU)
      setLoading(false)
    }
  }

  const addItem = async (data) => {
    try {
      const newItem = {
        ...data,
        featured: data.featured || false,
        available: data.available !== false,
        order: menuItems.length,
        createdAt: new Date().toISOString()
      }
      const docRef = await addDoc(collection(db, COLLECTION), newItem)
      return { id: docRef.id, ...newItem }
    } catch (error) {
      console.error('Add error:', error)
      throw error
    }
  }

  const updateItem = async (id, data) => {
    try {
      const ref = doc(db, COLLECTION, id)
      await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() })
    } catch (error) {
      console.error('Update error:', error)
      throw error
    }
  }

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id))
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  const toggleAvailability = async (id) => {
    const item = menuItems.find(i => i.id === id)
    if (item) await updateItem(id, { available: !item.available })
  }

  const toggleFeatured = async (id) => {
    const item = menuItems.find(i => i.id === id)
    if (item) await updateItem(id, { featured: !item.featured })
  }

  const resetToDefault = async () => {
    try {
      // Delete all existing docs
      const batch = writeBatch(db)
      const snapshot = await import('firebase/firestore').then(({ getDocs }) => getDocs(collection(db, COLLECTION)))
      snapshot.docs.forEach(d => batch.delete(doc(db, COLLECTION, d.id)))
      await batch.commit()
      // Re-seed
      await seedDefaultMenu()
      toast.success('Menu reset to defaults!')
    } catch (error) {
      console.error('Reset error:', error)
      toast.error('Reset failed.')
    }
  }

  return (
    <MenuContext.Provider value={{
      menuItems, loading, firebaseReady,
      addItem, updateItem, deleteItem,
      toggleAvailability, toggleFeatured,
      resetToDefault
    }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)
