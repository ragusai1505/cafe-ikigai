import { Link } from 'react-router-dom'
import { Coffee, Leaf, Heart, Users, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-coffee-gradient pt-28 pb-14 text-center">
        <span className="text-coffee-300 text-xs font-mono tracking-[0.25em] uppercase">Our Story</span>
        <h1 className="font-display text-5xl md:text-6xl text-white mt-3 mb-2">About Us</h1>
        <div className="w-14 h-0.5 bg-coffee-500 mx-auto mt-5" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-coffee-500 text-xs font-mono tracking-widest uppercase">Since 2019</span>
            <h2 className="font-display text-4xl text-coffee-900 mt-3 mb-6 leading-tight">
              Where Every Cup Has a <em className="text-gradient not-italic">Purpose</em>
            </h2>
            <p className="text-coffee-600 text-lg leading-relaxed mb-4">
              <em>Ikigai</em> — the Japanese concept of finding your reason for being. For us, that reason is
              simple: crafting exceptional coffee experiences in the heart of Hyderabad.
            </p>
            <p className="text-coffee-500 leading-relaxed mb-8">
              Founded with a passion for specialty coffee, Cafe Ikigai brings together the finest
              single-origin beans, expert baristas, and a warm community space where every cup tells a story.
              We believe great coffee is not just a beverage — it is a ritual, a connection, a moment of joy.
            </p>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-coffee-600 text-white px-6 py-3 rounded-full font-medium hover:bg-coffee-700 transition-colors group">
              <Coffee size={16} /> Explore Our Menu
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <img
              src="/cafe-hero.png"
              alt="Café Ikigai signage"
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
            {/* Signage overlay card */}
            <div className="absolute -top-5 -right-5 bg-coffee-900 rounded-2xl p-4 shadow-xl border border-coffee-700 max-w-[160px]">
              <div className="text-center">
                <div className="font-display text-lg italic text-amber-300 leading-none">Café</div>
                <div className="font-display text-xl font-bold text-white tracking-widest leading-none">IKIGAI</div>
                <div className="text-coffee-400 text-[9px] mt-1 tracking-wider">Sip. Savor. Discover Purpose.</div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-5 shadow-xl border border-coffee-100">
              <div className="font-display text-3xl text-coffee-600 font-bold">5+</div>
              <div className="text-coffee-400 text-sm mt-0.5">Years of Crafting</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
          {[
            { icon: Coffee, value: '50+', label: 'Menu Items' },
            { icon: Users, value: '10K+', label: 'Happy Guests' },
            { icon: Leaf, value: '100%', label: 'Sustainable' },
            { icon: Heart, value: '5 ★', label: 'Rating' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-coffee-50 card-lift">
              <div className="w-11 h-11 bg-coffee-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-coffee-600" />
              </div>
              <div className="font-display text-2xl font-bold text-coffee-900">{value}</div>
              <div className="text-coffee-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <div className="bg-coffee-gradient rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <span className="text-coffee-400 text-xs font-mono tracking-widest uppercase block mb-4">Our Philosophy</span>
            <h2 className="font-display text-3xl text-white mb-6">The Ikigai Way</h2>
            <p className="text-coffee-300 text-xl leading-relaxed max-w-2xl mx-auto italic font-display">
              "Every bean has a journey. Every cup has a story. Our role is simply to honour both."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
