import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Coffee, Leaf, Award, Star, ChevronDown } from 'lucide-react'
import { useMenu } from '../context/MenuContext'

function useReveal() {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, v]
}

function Reveal({ children, className = '' }) {
  const [ref, v] = useReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  )
}

export default function Home() {
  const { menuItems } = useMenu()
  const featured = menuItems.filter(i => i.featured && i.available).slice(0, 4)

  return (
    <div className="overflow-hidden">

      {/* ── HERO — warm dark, not pink ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Warm dark background */}
        <div className="absolute inset-0" style={{background:'linear-gradient(160deg,#1c0d08 0%,#2a1208 40%,#1a0e0a 100%)'}} />
        {/* Cafe photo overlay */}
        <div className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{backgroundImage:`url('/cafe-hero.png')`}} />
        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at center,rgba(0,0,0,0) 40%,rgba(0,0,0,0.6) 100%)'}} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Transparent logo — no white box */}
          <div className="animate-fade-in mb-6">
            <img src="/logo.png" alt="Café Ikigai"
              className="h-44 md:h-56 w-auto mx-auto object-contain drop-shadow-2xl"
              style={{filter:'drop-shadow(0 4px 24px rgba(242,196,206,0.3))'}} />
          </div>

          <p className="text-warm-100 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-2"
            style={{color:'rgba(255,240,235,0.85)'}}>
            Handcrafted specialty coffee in the heart of Kondapur —
            your cozy corner to sip, savor, and discover your purpose.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
            <Link to="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 shadow-xl group"
              style={{background:'#8B3A52',color:'white'}}>
              Explore Menu <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white/90 hover:bg-white/10 px-8 py-4 rounded-full font-medium text-base transition-all">
              <MapPin size={17} /> Visit Us
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xs mx-auto animate-fade-up stagger-4">
            {[['100%','Arabica'],['Fresh','Daily'],['5 ★','Rated']].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-xl font-bold" style={{color:'#F2C4CE'}}>{v}</div>
                <div className="text-xs font-mono mt-1 tracking-widest uppercase" style={{color:'rgba(242,196,206,0.5)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft text-white/30 hover:text-white/60 transition-colors">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── WHY IKIGAI — light cream background ── */}
      <section id="about" className="py-20" style={{background:'#fdfaf8'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="text-brand-500 text-xs font-mono tracking-[0.25em] uppercase">Why Ikigai</span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-900 mt-3">More Than Just Coffee</h2>
            <div className="w-14 h-0.5 mx-auto mt-5" style={{background:'#8B3A52'}} />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Coffee, title: 'Single Origin Beans', desc: 'Sourced from the finest estates across India and beyond — every origin tells a story.' },
              { icon: Leaf, title: 'Sustainable Brewing', desc: 'Eco-conscious from seed to cup. We care about the planet as much as the flavour.' },
              { icon: Award, title: 'Expert Baristas', desc: 'Trained to precision, passionate about every pour. Science meets artistry.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Reveal key={title}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-blush-100 card-lift h-full">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{background:'#fdf0f3'}}>
                    <Icon size={26} style={{color:'#8B3A52'}} />
                  </div>
                  <h3 className="font-display text-xl text-brand-900 mb-3">{title}</h3>
                  <p className="text-brand-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED — white background ── */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <span className="text-brand-500 text-xs font-mono tracking-[0.25em] uppercase">Staff Picks</span>
              <h2 className="font-display text-4xl md:text-5xl text-brand-900 mt-3">Featured Favorites</h2>
              <div className="w-14 h-0.5 mx-auto mt-5" style={{background:'#8B3A52'}} />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((item) => (
                <Reveal key={item.id}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-blush-100 card-lift group">
                    <div className="relative h-52 img-zoom">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' }} />
                      <div className="absolute top-3 right-3 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-full" style={{background:'rgba(45,18,25,0.85)'}}>
                        ₹{item.price}
                      </div>
                      <div className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{background:'#F2C4CE',color:'#6B2D3E'}}>
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
              <Link to="/menu" className="inline-flex items-center gap-2 font-medium transition-colors group pb-px border-b"
                style={{color:'#8B3A52',borderColor:'#F2C4CE'}}>
                View the full menu <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── VISIT CTA — warm section ── */}
      <section className="relative py-24 overflow-hidden" style={{background:'linear-gradient(135deg,#4a1f2b 0%,#6B2D3E 60%,#8B3A52 100%)'}}>
        <div className="absolute inset-0 opacity-8 bg-cover bg-center"
          style={{backgroundImage:`url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80')`,opacity:0.08}} />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{background:'#F2C4CE',transform:'translate(30%,-30%)'}} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{background:'#F2C4CE',transform:'translate(-30%,30%)'}} />

        <Reveal className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <img src="/logo.png" alt="Café Ikigai"
            className="h-20 w-auto mx-auto mb-6"
            style={{filter:'brightness(0) invert(1) opacity(0.9)'}} />
          <p className="text-blush-200 text-lg mb-10 leading-relaxed" style={{color:'rgba(242,196,206,0.85)'}}>
            Kondapur, Hyderabad — your neighbourhood coffee sanctuary, open every day 11AM – 11PM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-full font-semibold hover:bg-cream-100 transition-all hover:scale-105 shadow-xl"
              style={{color:'#6B2D3E'}}>
              <MapPin size={17} /> Get Directions
            </Link>
            <Link to="/menu"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all">
              Browse Menu <ArrowRight size={17} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
