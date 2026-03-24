import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Coffee, Leaf, Award, Star, ChevronDown } from 'lucide-react'
import { useMenu } from '../context/MenuContext'

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function RevealSection({ children, className = '' }) {
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
        {/* Background */}
        <div className="absolute inset-0 bg-coffee-950" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/cafe-hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/75 via-coffee-950/55 to-coffee-950/90" />

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-5 py-2 text-amber-200/90 text-sm font-mono mb-8 animate-fade-in">
            <Coffee size={13} className="text-coffee-400" />
            <span>Specialty Coffee · Kondapur, Hyderabad</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[1.08] mb-4 animate-fade-up">
            <em className="not-italic italic font-display" style={{fontFamily:'Georgia,serif'}}>Café</em> Ikigai
          </h1>
          <p className="text-coffee-300 text-xl md:text-2xl font-display italic mb-4 animate-fade-up stagger-1 tracking-wide">
            Sip. Savor. Discover Purpose.
          </p>

          <p className="text-cream-200/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-2">
            Handcrafted specialty coffee in the heart of Kondapur —
            your cozy corner to sip, savor, and discover your purpose.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
            <Link to="/menu"
              className="inline-flex items-center justify-center gap-2 bg-coffee-500 hover:bg-coffee-600 text-white px-8 py-4 rounded-full font-medium text-base transition-all hover:scale-105 shadow-xl shadow-coffee-900/40 group">
              Explore Menu
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/90 hover:bg-white/8 hover:border-white/40 px-8 py-4 rounded-full font-medium text-base transition-all backdrop-blur-sm">
              <MapPin size={17} /> Visit Us
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto animate-fade-up stagger-4">
            {[['100%','Arabica'],['Fresh','Daily'],['5 ★','Rated']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-bold text-coffee-400">{v}</div>
                <div className="text-cream-300/60 text-xs font-mono mt-1 tracking-widest uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-soft text-white/40 hover:text-white/60 transition-colors">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── WHY IKIGAI ── */}
      <section id="about" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-14">
            <span className="text-coffee-500 text-xs font-mono tracking-[0.25em] uppercase">Why Ikigai</span>
            <h2 className="font-display text-4xl md:text-5xl text-coffee-900 mt-3">More Than Just Coffee</h2>
            <div className="w-14 h-0.5 bg-coffee-400 mx-auto mt-5" />
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Coffee, title: 'Single Origin Beans', desc: 'Sourced from the finest estates across India and beyond — every origin tells a story.' },
              { icon: Leaf, title: 'Sustainable Brewing', desc: 'Eco-conscious from seed to cup. We care about the planet as much as the flavour.' },
              { icon: Award, title: 'Expert Baristas', desc: 'Trained to precision, passionate about every pour. Science meets artistry.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <RevealSection key={title} className={`stagger-${i + 1}`}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-coffee-50 card-lift h-full">
                  <div className="w-14 h-14 rounded-2xl bg-coffee-100 flex items-center justify-center mx-auto mb-5">
                    <Icon size={26} className="text-coffee-600" />
                  </div>
                  <h3 className="font-display text-xl text-coffee-900 mb-3">{title}</h3>
                  <p className="text-coffee-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ITEMS ── */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection className="text-center mb-14">
              <span className="text-coffee-500 text-xs font-mono tracking-[0.25em] uppercase">Staff Picks</span>
              <h2 className="font-display text-4xl md:text-5xl text-coffee-900 mt-3">Featured Favorites</h2>
              <div className="w-14 h-0.5 bg-coffee-400 mx-auto mt-5" />
            </RevealSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((item, i) => (
                <RevealSection key={item.id} className={`stagger-${i + 1}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-coffee-50 card-lift group">
                    <div className="relative h-52 img-zoom">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' }}
                      />
                      <div className="absolute top-3 right-3 bg-coffee-900/80 backdrop-blur-sm text-white text-xs font-mono font-bold px-2.5 py-1 rounded-full">
                        ₹{item.price}
                      </div>
                      <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={9} fill="currentColor" /> Featured
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-coffee-400 text-[11px] font-mono uppercase tracking-wider">{item.category}</span>
                      <h3 className="font-display text-lg text-coffee-900 mt-1 mb-2 leading-tight">{item.name}</h3>
                      <p className="text-coffee-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>

            <RevealSection className="text-center mt-12">
              <Link to="/menu" className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-800 font-medium transition-colors group border-b border-coffee-300 hover:border-coffee-700 pb-px">
                View the full menu <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealSection>
          </div>
        </section>
      )}

      {/* ── VISIT CTA ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-coffee-gradient" />
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-coffee-950/60" />
        <RevealSection className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <span className="text-coffee-400 text-xs font-mono tracking-[0.25em] uppercase block mb-4">Come As You Are</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5 leading-tight">
            Your table is waiting
          </h2>
          <p className="text-coffee-300 text-lg mb-10 leading-relaxed">
            Jubilee Hills, Hyderabad — your neighbourhood coffee sanctuary, open every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-coffee-900 px-8 py-4 rounded-full font-semibold hover:bg-cream-100 transition-all hover:scale-105 shadow-xl">
              <MapPin size={17} /> Get Directions
            </Link>
            <Link to="/menu"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/8 transition-all backdrop-blur-sm">
              Browse Menu <ArrowRight size={17} />
            </Link>
          </div>
        </RevealSection>
      </section>
    </div>
  )
}
