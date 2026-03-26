import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Default credentials — stored in localStorage so admin can change them
const DEFAULT_EMAIL = 'admin@cafeikigai.com'
const DEFAULT_PASSWORD = 'admin123'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ikigai_admin_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const getCredentials = () => {
    try {
      const stored = localStorage.getItem('ikigai_admin_credentials')
      if (stored) return JSON.parse(stored)
    } catch {}
    return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }
  }

  const login = async (email, password) => {
    const creds = getCredentials()
    if (email === creds.email && password === creds.password) {
      const userData = { email, name: 'Admin', role: 'admin' }
      setUser(userData)
      localStorage.setItem('ikigai_admin_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password.' }
  }

  const changePassword = (currentPassword, newEmail, newPassword) => {
    const creds = getCredentials()
    if (currentPassword !== creds.password) {
      return { success: false, error: 'Current password is incorrect.' }
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' }
    }
    const newCreds = { email: newEmail || creds.email, password: newPassword }
    localStorage.setItem('ikigai_admin_credentials', JSON.stringify(newCreds))
    // Update logged in user email
    const userData = { email: newCreds.email, name: 'Admin', role: 'admin' }
    setUser(userData)
    localStorage.setItem('ikigai_admin_user', JSON.stringify(userData))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ikigai_admin_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin', changePassword }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
