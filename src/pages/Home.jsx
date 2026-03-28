import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Coffee, Leaf, Award, Star, ChevronDown } from 'lucide-react'
import { useMenu } from '../context/MenuContext'

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, className = '' }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

export default function Home() {
  const { menuItems } = useMenu()
  const featured = menuItems.filter(i => i.featured && i.available).slice(0, 4)

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url('/cafe-hero.png')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-900/50 to-brand-950/95" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img src="/logo.png" alt="Café Ikigai" className="h-40 md:h-52 w-auto mx-auto object-contain drop-shadow-2xl" />
          </div>

          <p className="text-blush-200/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-2">
            Handcrafted specialty coffee in the heart of Kondapur —
            your cozy corner to sip, savor, and discover your purpose.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
            <Link to="/menu"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-full font-medium text-base transition-all hover:scale-105 shadow-xl group">
              Explore Menu <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/90 hover:bg-white/10 px-8 py-4 rounded-full font-medium text-base transition-all backdrop-blur-sm">
              <MapPin size={17} /> Visit Us
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto animate-fade-up stagger-4">
            {[['100%','Arabica'],['Fresh','Daily'],['5 ★','Rated']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-bold text-blush-300">{v}</div>
                <div className="text-blush-200/60 text-xs font-mono mt-1 tracking-widest uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-soft text-white/40 hover:text-white/70 transition-colors">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── WHY IKIGAI ── */}
      <section id="about" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="text-brand-500 text-xs font-mono tracking-[0.25em] uppercase">Why Ikigai</span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-900 mt-3">More Than Just Coffee</h2>
            <div className="w-14 h-0.5 bg-brand-500 mx-auto mt-5" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Coffee, title: 'Single Origin Beans', desc: 'Sourced from the finest estates across India and beyond — every origin tells a story.' },
              { icon: Leaf, title: 'Sustainable Brewing', desc: 'Eco-conscious from seed to cup. We care about the planet as much as the flavour.' },
              { icon: Award, title: 'Expert Baristas', desc: 'Trained to precision, passionate about every pour. Science meets artistry.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-blush-100 card-lift h-full">
                  <div className="w-14 h-14 rounded-2xl bg-blush-100 flex items-center justify-center mx-auto mb-5">
                    <Icon size={26} className="text-brand-600" />
                  </div>
                  <h3 className="font-display text-xl text-brand-900 mb-3">{title}</h3>
                  <p className="text-brand-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <span className="text-brand-500 text-xs font-mono tracking-[0.25em] uppercase">Staff Picks</span>
              <h2 className="font-display text-4xl md:text-5xl text-brand-900 mt-3">Featured Favorites</h2>
              <div className="w-14 h-0.5 bg-brand-500 mx-auto mt-5" />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((item) => (
                <Reveal key={item.id}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-blush-100 card-lift group">
                    <div className="relative h-52 img-zoom">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' }} />
                      <div className="absolute top-3 right-3 bg-brand-900/80 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-full">
                        ₹{item.price}
                      </div>
                      <div className="absolute top-3 left-3 bg-blush-200 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={9} fill="currentColor" /> Featured
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-brand-400 text-[10px] font-mono uppercase tracking-widest">{item.category}</span>
                      <h3 className="font-display text-lg text-brand-900 mt-1 mb-2 leading-tight">{item.name}</h3>
                      <p className="text-brand-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="text-center mt-12">
              <Link to="/menu" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-medium transition-colors group border-b border-brand-300 hover:border-brand-700 pb-px">
                View the full menu <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── VISIT CTA ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80')` }} />
        <Reveal className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <img src="/logo.png" alt="Café Ikigai" className="h-24 w-auto mx-auto mb-6 opacity-90" />
          <p className="text-blush-300 text-lg mb-10 leading-relaxed">
            Kondapur, Hyderabad — your neighbourhood coffee sanctuary, open every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 px-8 py-4 rounded-full font-semibold hover:bg-blush-100 transition-all hover:scale-105 shadow-xl">
              <MapPin size={17} /> Get Directions
            </Link>
            <Link to="/menu"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all">
              Browse Menu <ArrowRight size={17} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
