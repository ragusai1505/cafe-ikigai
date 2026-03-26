import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, StarOff, Package, Coffee, TrendingUp, AlertCircle, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMenu } from '../../context/MenuContext'
import { CATEGORIES } from '../../data/menuData'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminDashboard() {
  const { menuItems, deleteItem, toggleAvailability, toggleFeatured, resetToDefault } = useMenu()
  const [filterCat, setFilterCat] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [processing, setProcessing] = useState(null)

  const filtered = filterCat === 'All' ? menuItems : menuItems.filter(i => i.category === filterCat)

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.available).length,
    featured: menuItems.filter(i => i.featured).length,
    categories: [...new Set(menuItems.map(i => i.category))].length,
  }

  const handleDelete = async (id) => {
    setProcessing(id)
    await deleteItem(id)
    toast.success('Item deleted')
    setDeleteConfirm(null)
    setProcessing(null)
  }

  const handleToggleAvail = async (item) => {
    setProcessing(item.id)
    await toggleAvailability(item.id)
    toast.success(`${item.name} marked ${item.available ? 'unavailable' : 'available'}`)
    setProcessing(null)
  }

  const handleToggleFeatured = async (item) => {
    setProcessing(item.id)
    await toggleFeatured(item.id)
    toast.success(`${item.name} ${item.featured ? 'removed from' : 'added to'} featured`)
    setProcessing(null)
  }

  const handleReset = async () => {
    if (window.confirm('Reset all menu items to defaults? This cannot be undone.')) {
      await resetToDefault()
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-coffee-900">Dashboard</h1>
            <p className="text-coffee-400 text-sm mt-1">Changes save to Firebase instantly ⚡</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleReset}
              className="flex items-center gap-2 text-sm text-coffee-400 hover:text-coffee-600 border border-coffee-200 hover:border-coffee-400 px-4 py-2 rounded-xl transition-all">
              <RotateCcw size={14} /> Reset Menu
            </button>
            <Link to="/admin/add"
              className="flex items-center gap-2 bg-coffee-600 hover:bg-coffee-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
              <Plus size={16} /> Add Item
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Total Items', value: stats.total, color: 'coffee' },
            { icon: Coffee, label: 'Available', value: stats.available, color: 'green' },
            { icon: Star, label: 'Featured', value: stats.featured, color: 'amber' },
            { icon: TrendingUp, label: 'Categories', value: stats.categories, color: 'blue' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-coffee-50">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color==='coffee'?'bg-coffee-100':color==='green'?'bg-green-100':color==='amber'?'bg-amber-100':'bg-blue-100'}`}>
                <Icon size={20} className={color==='coffee'?'text-coffee-600':color==='green'?'text-green-600':color==='amber'?'text-amber-600':'text-blue-600'} />
              </div>
              <div className="font-display text-2xl font-bold text-coffee-900">{value}</div>
              <div className="text-coffee-400 text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${filterCat===cat?'bg-coffee-600 text-white':'bg-white text-coffee-600 border border-coffee-200 hover:border-coffee-400'}`}>
              {cat} {cat !== 'All' && `(${menuItems.filter(i => i.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-coffee-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-coffee-100 bg-coffee-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-mono text-coffee-400 uppercase tracking-widest">Item</th>
                  <th className="text-left px-4 py-3.5 text-xs font-mono text-coffee-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-3.5 text-xs font-mono text-coffee-400 uppercase tracking-widest">Price</th>
                  <th className="text-center px-4 py-3.5 text-xs font-mono text-coffee-400 uppercase tracking-widest hidden sm:table-cell">Status</th>
                  <th className="text-center px-4 py-3.5 text-xs font-mono text-coffee-400 uppercase tracking-widest hidden sm:table-cell">Featured</th>
                  <th className="text-right px-5 py-3.5 text-xs font-mono text-coffee-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-50">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-coffee-50/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-coffee-100">
                          <img src={item.image||'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80'}
                            alt={item.name} className="w-full h-full object-cover"
                            onError={e=>{e.target.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80'}} />
                        </div>
                        <div>
                          <div className="font-medium text-coffee-900 text-sm">{item.name}</div>
                          <div className="text-coffee-400 text-xs line-clamp-1 max-w-xs hidden md:block">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs bg-coffee-100 text-coffee-700 px-2.5 py-1 rounded-full font-medium">{item.category}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-mono text-sm text-coffee-800 font-bold">₹{item.price}</span>
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <button onClick={() => handleToggleAvail(item)} disabled={processing===item.id}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium transition-all disabled:opacity-50 ${item.available?'bg-green-100 text-green-700 hover:bg-green-200':'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                        {item.available?<><Eye size={12}/>On</>:<><EyeOff size={12}/>Off</>}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <button onClick={() => handleToggleFeatured(item)} disabled={processing===item.id}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium transition-all disabled:opacity-50 ${item.featured?'bg-amber-100 text-amber-700 hover:bg-amber-200':'bg-coffee-100 text-coffee-500 hover:bg-coffee-200'}`}>
                        {item.featured?<><Star size={12}/>Yes</>:<><StarOff size={12}/>No</>}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/admin/edit/${item.id}`}
                          className="p-2 rounded-lg bg-coffee-100 hover:bg-coffee-200 text-coffee-600 transition-colors" title="Edit">
                          <Edit2 size={14}/>
                        </Link>
                        <button onClick={() => setDeleteConfirm(item.id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-coffee-400">
                <Package size={32} className="mx-auto mb-3 opacity-40"/>
                <p className="font-display text-lg">No items in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-950/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={22} className="text-red-500"/>
            </div>
            <h3 className="font-display text-xl text-coffee-900 text-center mb-2">Delete Item?</h3>
            <p className="text-coffee-400 text-sm text-center mb-6">
              "{menuItems.find(i=>i.id===deleteConfirm)?.name}" will be permanently removed from Firebase.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-coffee-200 text-coffee-600 py-2.5 rounded-xl text-sm font-medium hover:bg-coffee-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={processing===deleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                {processing===deleteConfirm ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
