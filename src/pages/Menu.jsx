import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useMenu } from '../context/MenuContext'
import { CATEGORIES } from '../data/menuData'

function MenuCard({ item }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-coffee-50 card-lift group ${!item.available ? 'opacity-60' : ''}`}>
      <div className="relative h-48 img-zoom">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' }}
        />
        <div className="absolute top-3 right-3 bg-coffee-900/80 backdrop-blur-sm text-white text-xs font-mono font-bold px-2.5 py-1 rounded-full">
          ₹{item.price}
        </div>
        {item.featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✦ Featured
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-coffee-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-coffee-400 text-[10px] font-mono uppercase tracking-widest">{item.category}</span>
        <h3 className="font-display text-base font-semibold text-coffee-900 mt-1 mb-1.5 leading-tight">{item.name}</h3>
        <p className="text-coffee-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </div>
  )
}

export default function Menu() {
  const { menuItems, loading } = useMenu()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showUnavailable, setShowUnavailable] = useState(true)

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
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-coffee-200 border-t-coffee-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-coffee-400 font-mono text-sm">Brewing the menu…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-coffee-gradient pt-28 pb-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=60')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="relative z-10">
          <span className="text-coffee-300 text-xs font-mono tracking-[0.25em] uppercase">What We Brew</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mt-3 mb-2">Our Menu</h1>
          <p className="text-coffee-300 text-sm">{menuItems.filter(i => i.available).length} items available</p>
          <div className="w-14 h-0.5 bg-coffee-500 mx-auto mt-5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" />
            <input
              type="text"
              placeholder="Search items, categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-coffee-200 bg-white text-coffee-800 placeholder-coffee-300 focus:outline-none focus:ring-2 focus:ring-coffee-400/50 focus:border-coffee-400 text-sm transition-all"
            />
          </div>
          <button
            onClick={() => setShowUnavailable(!showUnavailable)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showUnavailable ? 'border-coffee-200 bg-white text-coffee-600 hover:bg-coffee-50' : 'border-coffee-500 bg-coffee-50 text-coffee-700'}`}
          >
            <SlidersHorizontal size={15} />
            {showUnavailable ? 'Hide Unavailable' : 'Show Unavailable'}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {CATEGORIES.map(cat => {
            const count = menuItems.filter(i => (cat === 'All' || i.category === cat) && i.available).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-coffee-600 text-white shadow-md shadow-coffee-200'
                    : 'bg-white text-coffee-700 border border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50'
                }`}
              >
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-coffee-500 text-white' : 'bg-coffee-100 text-coffee-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">☕</div>
            <h3 className="font-display text-2xl text-coffee-700 mb-2">Nothing found</h3>
            <p className="text-coffee-400 text-sm">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="mt-6 text-coffee-600 text-sm underline hover:text-coffee-800">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {available.map(item => <MenuCard key={item.id} item={item} />)}
              </div>
            )}

            {unavailable.length > 0 && showUnavailable && (
              <div className="mt-12">
                <h3 className="font-display text-lg text-coffee-400 mb-5 flex items-center gap-2">
                  <span className="w-4 h-px bg-coffee-300 inline-block" />
                  Currently Unavailable
                  <span className="w-4 h-px bg-coffee-300 inline-block" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {unavailable.map(item => <MenuCard key={item.id} item={item} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
