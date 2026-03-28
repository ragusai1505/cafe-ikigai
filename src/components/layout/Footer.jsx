import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'
import { CONTACT_INFO } from '../../data/menuData'
import { WhatsAppFooterLink } from '../whatsapp/WhatsAppWidgets'

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-blush-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand with logo */}
          <div>
            <Link to="/" className="block mb-5 group">
              <img src="/logo.png" alt="Café Ikigai" className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 brightness-0 invert opacity-90" />
            </Link>
            <p className="text-brand-400 text-sm leading-relaxed mb-5">
              Sip. Savor. Discover Purpose. — your cozy corner for specialty coffee in Kondapur, Hyderabad.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-brand-800 hover:bg-brand-600 flex items-center justify-center transition-colors group">
                <Instagram size={15} className="text-brand-300 group-hover:text-white" />
              </a>
              <a href={CONTACT_INFO.facebook} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-brand-800 hover:bg-brand-600 flex items-center justify-center transition-colors group">
                <Facebook size={15} className="text-brand-300 group-hover:text-white" />
              </a>
              <WhatsAppFooterLink />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">Explore</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/menu', 'Our Menu'], ['/about', 'About Us'], ['/contact', 'Visit Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-brand-400 text-sm hover:text-blush-300 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-brand-600 flex-shrink-0" />
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
                <Clock size={15} className="text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">Every Day</div>
                  <div className="text-brand-400 text-sm mt-0.5">11:00 AM – 11:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white font-semibold text-base mb-5">Find Us</h4>
            <div className="space-y-4">
              <a href={CONTACT_INFO.maps} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                <MapPin size={15} className="text-brand-500 mt-0.5 flex-shrink-0" />
                <span className="text-brand-400 text-sm leading-relaxed group-hover:text-brand-300 transition-colors">
                  {CONTACT_INFO.address}
                </span>
              </a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 group">
                <Phone size={15} className="text-brand-500 flex-shrink-0" />
                <span className="text-brand-400 text-sm group-hover:text-brand-300 transition-colors">{CONTACT_INFO.phone}</span>
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 group">
                <Mail size={15} className="text-brand-500 flex-shrink-0" />
                <span className="text-brand-400 text-sm group-hover:text-brand-300 transition-colors">{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-600 text-sm">© {new Date().getFullYear()} Café Ikigai. All rights reserved.</p>
          <p className="text-brand-600 text-sm font-mono tracking-wide">Made with ☕ in Hyderabad</p>
        </div>
      </div>
    </footer>
  )
}
