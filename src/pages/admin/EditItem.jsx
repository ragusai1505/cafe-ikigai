import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMenu } from '../../context/MenuContext'
import { CATEGORIES } from '../../data/menuData'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminEditItem() {
  const { id } = useParams()
  const { menuItems, updateItem } = useMenu()
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadMode, setUploadMode] = useState('url')
  const [submitting, setSubmitting] = useState(false)

  const item = menuItems.find(i => i.id === id)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (item) {
      reset({ name:item.name, description:item.description, category:item.category, price:item.price, available:item.available, featured:item.featured })
      setImageUrl(item.image||'')
      setImagePreview(item.image||'')
    }
  }, [item, reset])

  if (!item) return (
    <AdminLayout>
      <div className="p-8 text-center">
        <p className="text-coffee-400">Item not found.</p>
        <button onClick={()=>navigate('/admin')} className="mt-4 text-coffee-600 underline text-sm">Back</button>
      </div>
    </AdminLayout>
  )

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setImagePreview(reader.result); setImageUrl(reader.result) }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await updateItem(id, {
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category,
        price: parseInt(data.price, 10),
        available: data.available,
        featured: data.featured,
        image: imageUrl || item.image,
      })
      toast.success(`"${data.name}" updated!`)
      navigate('/admin')
    } catch {
      toast.error('Failed to update. Check Firebase connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={()=>navigate('/admin')}
            className="w-9 h-9 rounded-xl border border-coffee-200 flex items-center justify-center text-coffee-500 hover:bg-coffee-50 transition-colors">
            <ArrowLeft size={17}/>
          </button>
          <div>
            <h1 className="font-display text-3xl text-coffee-900">Edit Item</h1>
            <p className="text-coffee-400 text-sm mt-0.5">{item.name} — saves to Firebase instantly ⚡</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-50">
            <h2 className="font-display text-lg text-coffee-900 mb-4">Item Image</h2>
            <div className="flex bg-coffee-50 rounded-lg p-1 mb-4 w-fit">
              {['url','file'].map(mode=>(
                <button key={mode} type="button" onClick={()=>setUploadMode(mode)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${uploadMode===mode?'bg-white text-coffee-800 shadow-sm':'text-coffee-500'}`}>
                  {mode==='url'?'Image URL':'Upload File'}
                </button>
              ))}
            </div>
            {uploadMode==='url' ? (
              <input type="url" placeholder="https://…" value={imageUrl}
                onChange={e=>{setImageUrl(e.target.value);setImagePreview(e.target.value)}}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"/>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-coffee-200 rounded-xl p-8 cursor-pointer hover:border-coffee-400 transition-all">
                <Upload size={28} className="text-coffee-300 mb-2"/>
                <span className="text-coffee-500 text-sm">Click to upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
              </label>
            )}
            {imagePreview && (
              <div className="mt-4 relative w-fit">
                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl border border-coffee-200" onError={()=>setImagePreview('')}/>
                <button type="button" onClick={()=>{setImagePreview('');setImageUrl('')}}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 shadow-sm">
                  <X size={12}/>
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-50 space-y-5">
            <h2 className="font-display text-lg text-coffee-900">Item Details</h2>

            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Item Name *</label>
              <input type="text" {...register('name',{required:'Name is required'})}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"/>
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Description *</label>
              <textarea rows={3} {...register('description',{required:'Description is required'})}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all resize-none"/>
              {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Category *</label>
                <select {...register('category',{required:true})}
                  className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all bg-white">
                  {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Price (₹) *</label>
                <input type="number" min="1" {...register('price',{required:true,min:1})}
                  className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                {field:'available',label:'Available',desc:'Show on public menu',activeColor:'peer-checked:bg-coffee-500'},
                {field:'featured',label:'Featured',desc:'Show on homepage',activeColor:'peer-checked:bg-amber-400'},
              ].map(({field,label,desc,activeColor})=>(
                <label key={field} className="flex items-center justify-between p-4 rounded-xl border border-coffee-200 cursor-pointer hover:bg-coffee-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-coffee-800">{label}</div>
                    <div className="text-xs text-coffee-400 mt-0.5">{desc}</div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" {...register(field)} className="sr-only peer"/>
                    <div className={`w-11 h-6 bg-coffee-200 ${activeColor} rounded-full transition-colors`}/>
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"/>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={()=>navigate('/admin')}
              className="flex-1 border border-coffee-200 text-coffee-600 py-3 rounded-xl text-sm font-medium hover:bg-coffee-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-coffee-600 hover:bg-coffee-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2">
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>
                : <><Save size={15}/>Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
