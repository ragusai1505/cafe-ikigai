import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useMenu } from "../../context/MenuContext"
import { CATEGORIES } from "../../data/menuData"
import AdminLayout from "../../components/admin/AdminLayout"

export default function AdminAddItem() {
  const { menuItems } = useMenu()
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploadMode, setUploadMode] = useState("url")
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { available: true, featured: false }
  })

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return }
    const reader = new FileReader()
    reader.onload = () => { setImagePreview(reader.result); setImageUrl(reader.result) }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const newItem = {
        name: String(data.name).trim(),
        description: String(data.description).trim(),
        category: String(data.category),
        price: Number(data.price),
        available: Boolean(data.available),
        featured: Boolean(data.featured),
        image: imageUrl || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
        order: Number(menuItems.length),
        createdAt: new Date().toISOString()
      }
      console.log("Adding item:", newItem)
      const docRef = await addDoc(collection(db, "menu"), newItem)
      console.log("Added with ID:", docRef.id)
      toast.success(data.name + " added to menu!")
      navigate("/admin")
    } catch (error) {
      console.error("Add item error:", error)
      toast.error("Error: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/admin")}
            className="w-9 h-9 rounded-xl border border-coffee-200 flex items-center justify-center text-coffee-500 hover:bg-coffee-50 transition-colors">
            <ArrowLeft size={17}/>
          </button>
          <div>
            <h1 className="font-display text-3xl text-coffee-900">Add Menu Item</h1>
            <p className="text-coffee-400 text-sm mt-0.5">Saves directly to Firebase instantly</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-50">
            <h2 className="font-display text-lg text-coffee-900 mb-4">Item Image</h2>
            <div className="flex bg-coffee-50 rounded-lg p-1 mb-4 w-fit">
              {["url", "file"].map(mode => (
                <button key={mode} type="button" onClick={() => setUploadMode(mode)}
                  className={"px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize " + (uploadMode === mode ? "bg-white text-coffee-800 shadow-sm" : "text-coffee-500")}>
                  {mode === "url" ? "Image URL" : "Upload File"}
                </button>
              ))}
            </div>
            {uploadMode === "url" ? (
              <input type="url" placeholder="https://images.unsplash.com/..." value={imageUrl}
                onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value) }}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"/>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-coffee-200 rounded-xl p-8 cursor-pointer hover:border-coffee-400 hover:bg-coffee-50/50 transition-all">
                <Upload size={28} className="text-coffee-300 mb-2"/>
                <span className="text-coffee-500 text-sm font-medium">Click to upload</span>
                <span className="text-coffee-300 text-xs mt-1">PNG, JPG, WebP max 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/>
              </label>
            )}
            {imagePreview && (
              <div className="mt-4 relative w-fit">
                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl border border-coffee-200"
                  onError={() => setImagePreview("")}/>
                <button type="button" onClick={() => { setImagePreview(""); setImageUrl("") }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 shadow-sm">
                  <X size={12}/>
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-50 space-y-5">
            <h2 className="font-display text-lg text-coffee-900">Item Details</h2>
            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Item Name *</label>
              <input type="text" placeholder="e.g. Signature Espresso"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"/>
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Description *</label>
              <textarea rows={3} placeholder="Describe the item..."
                {...register("description", { required: "Description is required", minLength: { value: 5, message: "Min 5 characters" } })}
                className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all resize-none"/>
              {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Category *</label>
                <select {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all bg-white">
                  <option value="">Select category...</option>
                  {CATEGORIES.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-coffee-500 uppercase tracking-widest mb-2">Price (Rs) *</label>
                <input type="number" min="1" max="9999" placeholder="e.g. 180"
                  {...register("price", { required: "Price is required", min: { value: 1, message: "Min Rs 1" }, valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-coffee-200 rounded-xl text-sm text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 transition-all"/>
                {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { field: "available", label: "Available", desc: "Show on public menu", activeColor: "peer-checked:bg-coffee-500" },
                { field: "featured", label: "Featured", desc: "Show on homepage", activeColor: "peer-checked:bg-amber-400" }
              ].map(({ field, label, desc, activeColor }) => (
                <label key={field} className="flex items-center justify-between p-4 rounded-xl border border-coffee-200 cursor-pointer hover:bg-coffee-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-coffee-800">{label}</div>
                    <div className="text-xs text-coffee-400 mt-0.5">{desc}</div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" {...register(field)} className="sr-only peer"/>
                    <div className={"w-11 h-6 bg-coffee-200 " + activeColor + " rounded-full transition-colors"}/>
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"/>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate("/admin")}
              className="flex-1 border border-coffee-200 text-coffee-600 py-3 rounded-xl text-sm font-medium hover:bg-coffee-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-coffee-600 hover:bg-coffee-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2">
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Saving...</>
                : <><Plus size={16}/> Add to Menu</>}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
