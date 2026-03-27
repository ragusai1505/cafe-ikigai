// ─────────────────────────────────────────────────────────────
// WhatsApp Configuration — Edit this file to update number/messages
// ─────────────────────────────────────────────────────────────

export const WA_PHONE = '918068975800' // India +91 prefix + number (no spaces/dashes)

export const WA_MESSAGES = {
  default:   'Hi Café Ikigai! I would like to know more about your menu.',
  menu:      'Hi Café Ikigai! Could you please share your full menu?',
  price:     'Hi Café Ikigai! I wanted to ask about the prices of your items.',
  order:     'Hi Café Ikigai! I would like to place an order. Can you help?',
  location:  'Hi Café Ikigai! Could you share your location and opening hours?',
  reserve:   'Hi Café Ikigai! I would like to reserve a table. Is that possible?',
  catering:  'Hi Café Ikigai! I am interested in catering / bulk orders. Please share details.',
}

export const WA_QUICK_REPLIES = [
  { label: '📋 View Menu',        key: 'menu' },
  { label: '💰 Ask for Price',    key: 'price' },
  { label: '☕ Order Coffee',     key: 'order' },
  { label: '📍 Location & Timing', key: 'location' },
  { label: '🍽️ Reserve a Table', key: 'reserve' },
]

// Helper — builds the wa.me URL
export function waLink(key = 'default') {
  const text = encodeURIComponent(WA_MESSAGES[key] || WA_MESSAGES.default)
  return `https://wa.me/${WA_PHONE}?text=${text}`
}
