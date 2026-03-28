import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus, Link as LinkIcon, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useMenu } from '../../context/MenuContext'
import { CATEGORIES } from '../../data/menuData'
import AdminLayout from '../../components/admin/AdminLayout'

// Default images per category for easy selection
const CATEGORY_IMAGES = {
  'Hot Coffee': 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=500&q=80',
  'Cold Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
  'Cold Brew': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80',
  'Matcha Bar': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&q=80',
  'Hot Chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&q=80',
  'Bubble Tea': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  'Shakes': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80',
  'Teas': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&q=80',
  'Lemonades & Mojitos': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  'Protein & Healthy': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&q=80',
  'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80',
  'Sandwiches & Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
  'Small Platters': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
  'Soups & Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  'Sushi & Dim Sum': 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=500&q=80',
  'Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
  'Pasta & Risotto': 'https://images.unsplash.com/photo-1551183053-bf91798b4ac3?w=500&q=80',
  'Asian & Wok': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
  'Mains': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'

export default function AdminAddItem() {
  const { menuItems } = useMenu()
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { available: true, featured: false }
  })

  const selectedCategory = watch('category')

  // Auto-set image when category changes
  const autoImage = CATEGORY_IMAGES[selectedCategory] || DEFAULT_IMAGE
  const finalImage = imageUrl.trim() || autoImage

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      // Validate image URL is not base64 (too large for Firestore)
      const imgToSave = imageUrl.trim()
      if (imgToSave && imgToSave.startsWith('data:')) {
        toast.error('Please use an image URL, not an uploaded file. Firestore has a 1MB limit.')
        setSubmitting(false)
        return
      }

      const newItem = {
        name: String(data.name).trim(),
        description: String(data.description).trim(),
        category: String(data.category),
        price: Number(data.price),
        available: Boolean(data.available),
        featured: Boolean(data.featured),
        image: imgToSave || CATEGORY_IMAGES[data.category] || DEFAULT_IMAGE,
        order: Number(menuItems.length),
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'menu'), newItem)
      toast.success(`"${data.name}" added to menu!`)
      navigate('/admin')
    } catch (error) {
      console.error('Add error:', error)
      toast.error('Error: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin')}
            className="w-9 h-9 rounded-xl border border-blush-200 flex items-center justify-center text-blush-500 hover:bg-blush-50 transition-colors">
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="font-display text-3xl text-brand-900">Add Menu Item</h1>
            <p className="text-brand-400 text-sm mt-0.5">Saves to Firebase instantly ⚡</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Image URL section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blush-50">
            <h2 className="font-display text-lg text-brand-900 mb-2">Item Image</h2>
            <p className="text-brand-400 text-xs mb-4">
              Paste an image URL from Google Images, Unsplash, etc. If left blank, a default image for the category will be used automatically.
            </p>

            <div className="flex items-center gap-2 mb-3">
              <LinkIcon size={16} className="text-brand-400 flex-shrink-0" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-...?w=500"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 border border-blush-200 rounded-xl text-sm text-brand-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all"
              />
            </div>

            {/* Preview */}
            <div className="mt-4 flex items-center gap-4">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-blush-200 bg-blush-50 flex-shrink-0">
                <img
                  src={finalImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = DEFAULT_IMAGE }}
                />
              </div>
              <div>
                <div className="text-xs text-brand-400 mb-1">
                  {imageUrl ? 'Using your URL' : selectedCategory ? `Auto: ${selectedCategory} default` : 'Auto: default image'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blush-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <Image size={12} className="text-amber-500" />
                  Use URL only — uploading files is not supported (too large for database)
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blush-50 space-y-5">
            <h2 className="font-display text-lg text-brand-900">Item Details</h2>

            <div>
              <label className="block text-xs font-mono text-blush-500 uppercase tracking-widest mb-2">Item Name *</label>
              <input type="text" placeholder="e.g. Signature Espresso"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                className="w-full px-4 py-3 border border-blush-200 rounded-xl text-sm text-brand-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all" />
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono text-blush-500 uppercase tracking-widest mb-2">Description *</label>
              <textarea rows={3} placeholder="Describe the item, flavour notes..."
                {...register('description', { required: 'Description is required', minLength: { value: 5, message: 'Min 5 characters' } })}
                className="w-full px-4 py-3 border border-blush-200 rounded-xl text-sm text-brand-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all resize-none" />
              {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-blush-500 uppercase tracking-widest mb-2">Category *</label>
                <select {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-3 border border-blush-200 rounded-xl text-sm text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all bg-white">
                  <option value="">Select category...</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-blush-500 uppercase tracking-widest mb-2">Price (₹) *</label>
                <input type="number" min="1" max="9999" placeholder="e.g. 180"
                  {...register('price', { required: 'Price is required', min: { value: 1, message: 'Min ₹1' }, valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-blush-200 rounded-xl text-sm text-brand-800 placeholder-blush-300 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 transition-all" />
                {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { field: 'available', label: 'Available', desc: 'Show on public menu', activeColor: 'peer-checked:bg-blush-500' },
                { field: 'featured', label: 'Featured', desc: 'Show on homepage', activeColor: 'peer-checked:bg-amber-400' },
              ].map(({ field, label, desc, activeColor }) => (
                <label key={field} className="flex items-center justify-between p-4 rounded-xl border border-blush-200 cursor-pointer hover:bg-blush-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-brand-800">{label}</div>
                    <div className="text-xs text-brand-400 mt-0.5">{desc}</div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" {...register(field)} className="sr-only peer" />
                    <div className={`w-11 h-6 bg-blush-200 ${activeColor} rounded-full transition-colors`} />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/admin')}
              className="flex-1 border border-blush-200 text-brand-600 py-3 rounded-xl text-sm font-medium hover:bg-blush-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2">
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><Plus size={16} /> Add to Menu</>}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
