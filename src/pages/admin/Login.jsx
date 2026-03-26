import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Coffee, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export default function AdminLogin() {
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  if (isAdmin) return <Navigate to="/admin" replace />

  const onSubmit = async ({ email, password }) => {
    setError("")
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate("/admin")
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-coffee-gradient flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=60')",
        backgroundSize: "cover"
      }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-coffee-gradient p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="font-display text-2xl text-white font-bold">Admin Access</h1>
            <p className="text-coffee-300 text-sm mt-1">Cafe Ikigai Management Portal</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter admin email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
                  })}
                  className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-coffee-800 text-sm placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    {...register("password", { required: "Password is required" })}
                    className="w-full px-4 py-3 pr-12 border border-coffee-200 rounded-xl text-coffee-800 text-sm placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600 transition-colors">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coffee-600 hover:bg-coffee-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <><ShieldCheck size={16} /> Sign In</>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <a href="/" className="text-coffee-400 hover:text-coffee-600 text-sm transition-colors flex items-center justify-center gap-1.5">
                <Coffee size={13} /> Back to Cafe Ikigai
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
