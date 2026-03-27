import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Chatbot from './components/chatbot/Chatbot'
import WhatsAppButton from './components/whatsapp/WhatsAppButton'
import ScrollToTop from './components/ui/ScrollToTop'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAddItem from './pages/admin/AddItem'
import AdminEditItem from './pages/admin/EditItem'
import AdminSettings from './pages/admin/Settings'

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'Lato, sans-serif', borderRadius: '10px', fontSize: '14px' },
        success: { iconTheme: { primary: '#c8851f', secondary: '#fff' } }
      }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AdminAddItem /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><AdminEditItem /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
