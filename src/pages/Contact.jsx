import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ExternalLink } from 'lucide-react'
import { CONTACT_INFO } from '../data/menuData'
import { WhatsAppContact } from '../components/whatsapp/WhatsAppWidgets'

export default function Contact() {
  return (
    <div className="min-h-screen" style={{background:'#fffbfc'}}>
      <div className="bg-brand-gradient pt-28 pb-14 text-center">
        <span className="text-blush-300 text-xs font-mono tracking-[0.25em] uppercase">Come Say Hello</span>
        <h1 className="font-display text-5xl md:text-6xl text-white mt-3 mb-2">Contact Us</h1>
        <div className="w-14 h-0.5 bg-blush-300 mx-auto mt-5" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl text-brand-900 mb-8">Find Us</h2>
            <div className="space-y-6">
              <InfoRow icon={MapPin} label="Address">
                <a href={CONTACT_INFO.maps} target="_blank" rel="noreferrer"
                  className="flex items-start gap-1.5 text-brand-700 hover:text-brand-500 transition-colors group text-sm leading-relaxed">
                  <span>{CONTACT_INFO.address}</span>
                  <ExternalLink size={13} className="mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="mt-1.5 inline-flex items-center gap-1.5 bg-blush-100 text-brand-600 text-xs px-2.5 py-1 rounded-full">
                  📍 Ground Floor, PRIME Building, Kondapur
                </div>
              </InfoRow>
              <InfoRow icon={Phone} label="Phone">
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-brand-700 hover:text-brand-500 transition-colors text-sm">
                  {CONTACT_INFO.phone}
                </a>
              </InfoRow>
              <InfoRow icon={Mail} label="Email">
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-700 hover:text-brand-500 transition-colors text-sm">
                  {CONTACT_INFO.email}
                </a>
              </InfoRow>
              <InfoRow icon={Clock} label="Opening Hours">
                <div className="text-sm text-brand-700 space-y-1">
                  <div>{CONTACT_INFO.weekdays}</div>
                  <div>{CONTACT_INFO.weekends}</div>
                </div>
              </InfoRow>
            </div>

            {/* WhatsApp */}
            <div className="mt-8"><WhatsAppContact /></div>

            {/* Social */}
            <div className="mt-8">
              <h3 className="font-display text-xl text-brand-900 mb-4">Follow Our Journey</h3>
              <div className="flex flex-wrap gap-3">
                <a href={CONTACT_INFO.instagram} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-white border border-blush-200 rounded-xl px-4 py-2.5 text-sm text-brand-700 hover:bg-blush-50 hover:border-brand-400 transition-all">
                  <Instagram size={16} className="text-pink-500" /> @cafeikigaihyd
                </a>
                <a href={CONTACT_INFO.facebook} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-white border border-blush-200 rounded-xl px-4 py-2.5 text-sm text-brand-700 hover:bg-blush-50 hover:border-brand-400 transition-all">
                  <Facebook size={16} className="text-blue-500" /> Café Ikigai
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-blush-100 flex-1 min-h-72">
              <iframe title="Café Ikigai Location" width="100%" height="100%"
                style={{ border: 0, minHeight: '300px', display: 'block' }}
                loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Kondapur+Hyderabad+PRIME+Building&output=embed" />
            </div>
            <a href={CONTACT_INFO.maps} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-white border border-blush-200 text-brand-700 py-3 rounded-xl text-sm font-medium hover:bg-blush-50 hover:border-brand-400 transition-all">
              <MapPin size={15} /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={17} className="text-brand-600" />
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-mono text-brand-400 uppercase tracking-widest mb-1.5">{label}</div>
        {children}
      </div>
    </div>
  )
}
