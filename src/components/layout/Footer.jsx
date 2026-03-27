import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Coffee } from 'lucide-react'
import { CONTACT_INFO } from '../../data/menuData'
import { WhatsAppFooterLink } from '../whatsapp/WhatsAppWidgets'

export default function Footer() {
  return (
    <footer className="bg-coffee-950 text-coffee-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-full bg-coffee-gradient flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Coffee size={18} className="text-amber-100" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-white">Cafe Ikigai</div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-coffee-500 uppercase">Hyderabad</div>
              </div>
            </Link>
            <p className="text-coffee-400 text-sm leading-relaxed mb-5">
              Sip. Savor. Discover Purpose. — your cozy corner for specialty coffee in Kondapur, Hyderabad.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-coffee-800 hover:bg-coffee-700 flex items-center justify-center transition-colors group">
                <Instagram size={15} className="text-coffee-300 group-hover:text-white" />
              </a>
              <a href={CONTACT_INFO.facebook} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-coffee-800 hover:bg-coffee-700 flex items-center justify-center transition-colors group">
                <Facebook size={15} className="text-coffee-300 group-hover:text-white" />
              </a>
              <WhatsAppFooterLink />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">Explore</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/menu', 'Our Menu'], ['/about', 'About Us'], ['/contact', 'Visit Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-coffee-400 text-sm hover:text-coffee-300 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-coffee-600 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">Opening Hours</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-coffee-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">Weekdays</div>
                  <div className="text-coffee-400 text-sm mt-0.5">{CONTACT_INFO.weekdays}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-coffee-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">Weekends</div>
                  <div className="text-coffee-400 text-sm mt-0.5">{CONTACT_INFO.weekends}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact — DO NOT CHANGE */}
          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">Find Us</h4>
            <div className="space-y-4">
              <a href={CONTACT_INFO.maps} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <MapPin size={15} className="text-coffee-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-coffee-400 text-sm leading-relaxed group-hover:text-coffee-300 transition-colors block">
                    {CONTACT_INFO.address}
                  </span>
                  <span className="text-coffee-600 text-xs mt-1 block">📍 Ground Floor, PRIME Building, Kondapur</span>
                </div>
              </a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 group">
                <Phone size={15} className="text-coffee-500 flex-shrink-0" />
                <span className="text-coffee-400 text-sm group-hover:text-coffee-300 transition-colors">{CONTACT_INFO.phone}</span>
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 group">
                <Mail size={15} className="text-coffee-500 flex-shrink-0" />
                <span className="text-coffee-400 text-sm group-hover:text-coffee-300 transition-colors">{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-coffee-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-coffee-600 text-sm">© {new Date().getFullYear()} Cafe Ikigai. All rights reserved.</p>
          <p className="text-coffee-600 text-sm font-mono tracking-wide">Made with ☕ in Hyderabad</p>
        </div>
      </div>
    </footer>
  )
}
