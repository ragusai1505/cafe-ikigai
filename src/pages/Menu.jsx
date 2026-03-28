import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Star, CheckCircle, XCircle } from 'lucide-react'
import { useMenu } from '../context/MenuContext'
import { CATEGORIES } from '../data/menuData'
import { WhatsAppMenuBanner } from '../components/whatsapp/WhatsAppWidgets'

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'

function ItemModal({ item, onClose }) {
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/70 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full animate-scale-in"
        onClick={e => e.stopPropagation()}>
        <div className="relative h-64 overflow-hidden">
          <img src={item.image || DEFAULT_IMG} alt={item.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = DEFAULT_IMG }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <X size={18} />
          </button>
          {item.featured && (
            <div className="absolute top-4 left-4 bg-blush-200 text-brand-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </div>
          )}
          <div className="absolute bottom-4 right-4 bg-brand-900/80 backdrop-blur-sm text-white font-mono font-bold text-lg px-3 py-1 rounded-full">
            ₹{item.price}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-brand-400 text-xs font-mono uppercase tracking-widest">{item.category}</span>
              <h2 className="font-display text-2xl text-brand-900 mt-1 leading-tight">{item.name}</h2>
            </div>
            <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 mt-1 ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
              {item.available ? <><CheckCircle size={11} /> Available</> : <><XCircle size={11} /> Unavailable</>}
            </div>
          </div>
          <p className="text-brand-600 text-sm leading-relaxed">{item.description}</p>
          <button onClick={onClose}
            className="mt-6 w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item)}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-blush-100 card-lift group cursor-pointer ${!item.available ? 'opacity-60' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <img src={item.image || DEFAULT_IMG} alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = DEFAULT_IMG }} />
        <div className="absolute top-3 right-3 bg-brand-900/80 backdrop-blur-sm text-white text-xs font-mono font-bold px-2.5 py-1 rounded-full">
          ₹{item.price}
        </div>
        {item.featured && (
          <div className="absolute top-3 left-3 bg-blush-200 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✦ Featured
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="bg-brand-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">Unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/15 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-brand-900/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Tap to view
          </span>
        </div>
      </div>
      <div className="p-4">
        <span className="text-brand-400 text-[10px] font-mono uppercase tracking-widest">{item.category}</span>
        <h3 className="font-display text-base font-semibold text-brand-900 mt-1 mb-1.5 leading-tight">{item.name}</h3>
        <p className="text-brand-600 text-sm leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </div>
  )
}

export default function Menu() {
  const { menuItems, loading } = useMenu()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showUnavailable, setShowUnavailable] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      const catMatch = activeCategory === 'All' || item.category === activeCategory
      const searchMatch = !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      const availMatch = showUnavailable || item.available
      return catMatch && searchMatch && availMatch
    })
  }, [menuItems, activeCategory, search, showUnavailable])

  const available = filtered.filter(i => i.available)
  const unavailable = filtered.filter(i => !i.available)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#fffbfc'}}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blush-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-400 font-mono text-sm">Brewing the menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{background:'#fffbfc'}}>
      {/* Header */}
      <div className="bg-brand-gradient pt-28 pb-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=60')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="relative z-10">
          <span className="text-blush-300 text-xs font-mono tracking-[0.25em] uppercase">What We Brew</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-3 mb-2">Our Menu</h1>
          <p className="text-blush-300 text-sm">{menuItems.filter(i => i.available).length} items · Tap any item to view details</p>
          <div className="w-14 h-0.5 bg-blush-300 mx-auto mt-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
            <input type="text" placeholder="Search items, categories..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-blush-200 bg-white text-brand-800 placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400 text-sm transition-all" />
          </div>
          <button onClick={() => setShowUnavailable(!showUnavailable)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showUnavailable ? 'border-blush-200 bg-white text-brand-600 hover:bg-blush-50' : 'border-brand-400 bg-blush-50 text-brand-700'}`}>
            <SlidersHorizontal size={15} />
            {showUnavailable ? 'Hide Unavailable' : 'Show Unavailable'}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORIES.map(cat => {
            const count = menuItems.filter(i => (cat === 'All' || i.category === cat) && i.available).length
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white text-brand-700 border border-blush-200 hover:border-brand-400 hover:bg-blush-50'
                }`}>
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-brand-500 text-white' : 'bg-blush-100 text-brand-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* WhatsApp banner */}
        <div className="mb-8"><WhatsAppMenuBanner /></div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">☕</div>
            <h3 className="font-display text-2xl text-brand-700 mb-2">Nothing found</h3>
            <p className="text-brand-400 text-sm">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="mt-6 text-brand-600 text-sm underline hover:text-brand-800">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {available.map(item => <MenuCard key={item.id} item={item} onClick={setSelectedItem} />)}
            </div>
            {unavailable.length > 0 && showUnavailable && (
              <div className="mt-12">
                <h3 className="font-display text-lg text-brand-400 mb-5 flex items-center gap-2">
                  <span className="w-4 h-px bg-brand-300 inline-block" />
                  Currently Unavailable
                  <span className="w-4 h-px bg-brand-300 inline-block" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {unavailable.map(item => <MenuCard key={item.id} item={item} onClick={setSelectedItem} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
