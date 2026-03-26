import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ShieldCheck, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminSettings() {
  const { user, changePassword } = useAuth()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  const onSubmit = (data) => {
    setMessage(null)
    const result = changePassword(data.currentPassword, data.newEmail, data.newPassword)
    if (result.success) {
      setMessage({ type: 'success', text: 'Credentials updated successfully!' })
      reset()
    } else {
      setMessage({ type: 'error', text: result.error })
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-coffee-900">Settings</h1>
          <p className="text-coffee-400 text-sm mt-1">Manage your admin credentials</p>
        </div>

        {/* Current credentials info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <ShieldCheck size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-amber-800 text-sm font-medium">Current Admin Email</div>
            <div className="text-amber-700 text-sm mt-0.5">{user?.email}</div>
          </div>
        </div>

        {/* Change credentials form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-50">
          <h2 className="font-display text-xl text-coffee-900 mb-6">Change Login Credentials</h2>

          {message && (
            <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 mb-5 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success'
                ? <CheckCircle size={16} className="flex-shrink-0" />
                : <AlertCircle size={16} className="flex-shrink-0" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Email */}
            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">
                New Email (leave blank to keep current)
              </label>
              <input
                type="email"
                placeholder={user?.email}
                {...register('newEmail')}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
              />
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  {...register('currentPassword', { required: 'Current password is required' })}
                  className="w-full px-4 py-3 pr-12 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600">
                  {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1.5">{errors.currentPassword.message}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Min 6 characters' }
                  })}
                  className="w-full px-4 py-3 pr-12 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600">
                  {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1.5">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: val => val === newPassword || 'Passwords do not match'
                  })}
                  className="w-full px-4 py-3 pr-12 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit"
              className="w-full bg-coffee-600 hover:bg-coffee-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-2">
              <Save size={16} /> Update Credentials
            </button>
          </form>
        </div>

        <p className="text-coffee-400 text-xs text-center mt-5">
          ⚠️ Credentials are stored locally. Write down your new password before saving.
        </p>
      </div>
    </AdminLayout>
  )
}
