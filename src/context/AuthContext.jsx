import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

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

  const login = async (email, password) => {
    if (email === 'admin@cafeikigai.com' && password === 'admin123') {
      const userData = { email, name: 'Admin', role: 'admin' }
      setUser(userData)
      localStorage.setItem('ikigai_admin_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password.' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ikigai_admin_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
