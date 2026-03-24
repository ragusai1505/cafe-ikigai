import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Coffee, RotateCcw, ChevronDown } from 'lucide-react'
import { useMenu } from '../../context/MenuContext'

// ── Intent detection + response engine ───────────────────────────────────────

const GREETINGS = ['hi', 'hello', 'hey', 'hola', 'sup', 'good morning', 'good evening', 'good afternoon', 'namaste']
const THANKS = ['thanks', 'thank you', 'ty', 'thankyou', 'thx', 'great', 'awesome', 'perfect']
const FAREWELLS = ['bye', 'goodbye', 'see you', 'cya', 'take care', 'later']

function detectIntent(msg, menuItems) {
  const m = msg.toLowerCase().trim()

  // Greeting
  if (GREETINGS.some(g => m.includes(g))) return { type: 'greeting' }

  // Thanks
  if (THANKS.some(t => m.includes(t))) return { type: 'thanks' }

  // Farewell
  if (FAREWELLS.some(f => m.includes(f))) return { type: 'farewell' }

  // Hours / open
  if (m.match(/\b(hour|open|close|timing|time|when)\b/)) return { type: 'hours' }

  // Location / address
  if (m.match(/\b(where|location|address|find|directions?|map|come|visit)\b/)) return { type: 'location' }

  // Price of specific item
  const priceMatch = m.match(/price\s+of\s+(.+)|how much\s+(?:is|for|does)\s+(.+)|cost\s+of\s+(.+)|(.+)\s+price/)
  if (priceMatch) {
    const query = (priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4] || '').replace(/\?/g, '').trim()
    if (query) {
      const found = fuzzyFindItem(query, menuItems)
      if (found.length) return { type: 'item_price', items: found }
    }
  }

  // Category queries
  if (m.match(/\b(hot\s+coffee|cappuccino|latte|espresso|flat white|americano)\b/)) return { type: 'category', category: 'Hot Coffee' }
  if (m.match(/\b(cold\s+(coffee|brew)|iced|dalgona|macchiato|frappe)\b/)) return { type: 'category', category: 'Cold Coffee' }
  if (m.match(/\b(tea|chai|matcha|herbal)\b/)) return { type: 'category', category: 'Tea' }
  if (m.match(/\b(snack|food|eat|bite|croissant|toast|muffin|sandwich)\b/)) return { type: 'category', category: 'Snacks' }
  if (m.match(/\b(dessert|sweet|cake|tiramisu|lava|chocolate)\b/)) return { type: 'category', category: 'Desserts' }
  if (m.match(/\b(special|today|recommend|suggest|popular|best|favourite|favorite|signature)\b/)) return { type: 'featured' }

  // Menu / what do you have
  if (m.match(/\b(menu|items?|drinks?|beverages?|offer|serve|available|options?|list)\b/)) return { type: 'menu_overview' }

  // Vegan / dietary
  if (m.match(/\b(vegan|vegetarian|dairy.free|gluten.free|allerg)\b/)) return { type: 'dietary' }

  // Wifi / seating
  if (m.match(/\b(wifi|wi-fi|internet|seat|table|parking|pets?)\b/)) return { type: 'amenities' }

  // Fuzzy item search
  const fuzzy = fuzzyFindItem(m, menuItems)
  if (fuzzy.length) return { type: 'item_search', items: fuzzy }

  return { type: 'unknown' }
}

function fuzzyFindItem(query, items) {
  const q = query.toLowerCase()
  return items.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    q.split(' ').some(word => word.length > 2 && item.name.toLowerCase().includes(word))
  ).slice(0, 4)
}

function generateResponse(intent, menuItems) {
  const avail = menuItems.filter(i => i.available)

  switch (intent.type) {
    case 'greeting':
      return {
        text: "Hey there! ☕ Welcome to Cafe Ikigai! I'm your friendly barista bot. I can help you explore our menu, find prices, or tell you anything about our cafe.\n\nWhat can I brew up for you today?",
        suggestions: ['Show me the menu', 'What\'s featured?', 'Opening hours', 'Where are you located?']
      }

    case 'thanks':
      return {
        text: "Happy to help! ☕ Is there anything else you'd like to know? Our baristas are always here to make your visit special.",
        suggestions: ['Show me the full menu', 'Opening hours', 'Visit us']
      }

    case 'farewell':
      return {
        text: "See you soon at Cafe Ikigai! ☕✨ We'll have a fresh cup waiting for you at Jubilee Hills. Have a wonderful day!",
        suggestions: []
      }

    case 'hours':
      return {
        text: "⏰ **Our Opening Hours:**\n\n• **Every Day:** 11:00 AM – 11:00 PM\n\n📍 Below Jubilee Hills Check Post Metro Station\n📞 +91 80689 75800",
        suggestions: ['Where are you located?', 'Show me the menu']
      }

    case 'location':
      return {
        text: "📍 **Find Us Here:**\n\nGround Floor of M.R, PRIME Building (LEEWAY)\nKondapur, Laxmi Cyber City\nGachibowli, Hyderabad, Telangana 500084\n\n📞 +91 80689 75800",
        suggestions: ['Opening hours', 'Show me the menu', 'What\'s featured?']
      }

    case 'item_price': {
      const items = intent.items
      if (items.length === 1) {
        const it = items[0]
        return {
          text: `**${it.name}** is priced at **₹${it.price}** 🏷️\n\n_${it.description}_\n\n${!it.available ? '⚠️ This item is currently unavailable.' : '✅ Available now!'}`,
          suggestions: ['Show more items', 'What\'s featured?', 'Show cold drinks']
        }
      }
      const list = items.map(i => `• **${i.name}** — ₹${i.price}`).join('\n')
      return {
        text: `Here are the prices I found:\n\n${list}`,
        suggestions: ['Show full menu', 'What\'s featured?']
      }
    }

    case 'category': {
      const cat = intent.category
      const items = avail.filter(i => i.category === cat)
      if (!items.length) return { text: `Hmm, we don't have any ${cat} items available right now. Try asking about our other categories! ☕`, suggestions: ['Show all categories', 'What\'s featured?'] }
      const list = items.map(i => `• **${i.name}** — ₹${i.price}`).join('\n')
      return {
        text: `☕ **${cat}** (${items.length} items):\n\n${list}\n\nWant to know more about any of these?`,
        items,
        suggestions: [`Price of ${items[0]?.name}`, 'Show snacks', 'What\'s featured?']
      }
    }

    case 'featured': {
      const items = avail.filter(i => i.featured).slice(0, 5)
      if (!items.length) return { text: "We're updating our featured items. Ask me about our menu categories instead!", suggestions: ['Show hot coffees', 'Show cold drinks'] }
      const list = items.map(i => `⭐ **${i.name}** (${i.category}) — ₹${i.price}`).join('\n')
      return {
        text: `✨ **Our Featured Favorites:**\n\n${list}\n\nEvery single one is handcrafted by our expert baristas!`,
        items,
        suggestions: ['Tell me more about Cold Brew', 'Show full menu', 'Where are you located?']
      }
    }

    case 'menu_overview': {
      const cats = [...new Set(avail.map(i => i.category))]
      const summary = cats.map(c => {
        const count = avail.filter(i => i.category === c).length
        return `• **${c}** — ${count} item${count > 1 ? 's' : ''}`
      }).join('\n')
      return {
        text: `☕ **Cafe Ikigai Menu Overview**\n\nWe have ${avail.length} delicious items available:\n\n${summary}\n\nAsk me about any category or specific item!`,
        suggestions: ['Show hot coffees', 'Show cold drinks', 'Show snacks', 'What\'s featured?']
      }
    }

    case 'dietary':
      return {
        text: "🌱 We have several vegan and vegetarian-friendly options! Our plant-based milk alternatives (oat, almond) are available for any coffee drink.\n\nFor specific dietary requirements, we recommend speaking directly with our baristas at the cafe — they'll be happy to guide you!",
        suggestions: ['Show hot coffees', 'Show snacks', 'Where are you located?']
      }

    case 'amenities':
      return {
        text: "🏠 **At Cafe Ikigai you'll find:**\n\n• Free high-speed Wi-Fi\n• Comfortable indoor seating\n• Cozy outdoor seating\n• Ample nearby parking\n• Warm, pet-friendly atmosphere\n\nCome as you are — we've got your corner ready! ☕",
        suggestions: ['Opening hours', 'Where are you located?', 'Show me the menu']
      }

    case 'item_search': {
      const items = intent.items.filter(i => i.available)
      if (!items.length) return { text: "I couldn't find that item — it may be unavailable or we might not carry it. Let me show you what's available!", suggestions: ['Show full menu', 'What\'s featured?'] }
      if (items.length === 1) {
        const it = items[0]
        return {
          text: `Found it! ☕\n\n**${it.name}** (${it.category})\n₹${it.price}\n\n_${it.description}_`,
          items: [it],
          suggestions: [`Price of ${it.name}`, 'Show more in ' + it.category, 'What\'s featured?']
        }
      }
      const list = items.map(i => `• **${i.name}** (${i.category}) — ₹${i.price}`).join('\n')
      return {
        text: `Here's what I found:\n\n${list}`,
        items,
        suggestions: ['Show full menu', 'What\'s featured?']
      }
    }

    default:
      return {
        text: "Hmm, I'm not sure I understood that! ☕ I'm best at answering questions about our menu, prices, opening hours, or location. What would you like to know?",
        suggestions: ['Show me the menu', 'What\'s featured?', 'Opening hours', 'Where are you located?']
      }
  }
}

// ── Message renderer ──────────────────────────────────────────────────────────

function parseMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
      return `<span key="${i}">${formatted}</span>`
    })
    .join('<br/>')
}

function MessageBubble({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-coffee-gradient flex items-center justify-center flex-shrink-0 mt-auto mb-0.5 shadow-sm">
          <Coffee size={12} className="text-amber-100" />
        </div>
      )}
      <div className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${isBot ? 'chat-bubble-bot text-coffee-800' : 'chat-bubble-user text-white'}`}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
      />
    </div>
  )
}

// ── Main Chatbot Component ────────────────────────────────────────────────────

export default function Chatbot() {
  const { menuItems } = useMenu()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'bot',
      text: "Hey there! ☕ Welcome to Cafe Ikigai!\n\nI'm your friendly barista bot — ask me anything about our menu, prices, or how to find us!",
      suggestions: ['Show me the menu', "What's featured?", 'Opening hours', 'Where are you?']
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [hasNewMsg, setHasNewMsg] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      setTimeout(() => inputRef.current?.focus(), 100)
      setHasNewMsg(false)
    }
  }, [open, messages])

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), suggestions: [] }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const intent = detectIntent(text, menuItems)
      const response = generateResponse(intent, menuItems)
      const botMsg = { id: Date.now() + 1, role: 'bot', text: response.text, suggestions: response.suggestions || [] }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
      if (!open) setHasNewMsg(true)
    }, 600 + Math.random() * 400)
  }, [menuItems, open])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const clearChat = () => {
    setMessages([{
      id: Date.now(), role: 'bot',
      text: "Chat cleared! ☕ How can I help you?",
      suggestions: ['Show me the menu', "What's featured?", 'Opening hours']
    }])
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!open && hasNewMsg && (
          <div className="bg-white border border-coffee-200 rounded-2xl px-3 py-2 shadow-lg text-coffee-700 text-xs font-medium animate-fade-in max-w-44 text-right">
            Ask me anything! ☕
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-coffee-gradient text-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center relative animate-pulse-glow"
          style={{ animation: 'pulseGlow 2s infinite' }}
          aria-label="Open chat"
        >
          {open ? <ChevronDown size={22} /> : <MessageCircle size={22} />}
          {!open && hasNewMsg && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-coffee-100 flex flex-col overflow-hidden animate-slide-up"
          style={{ maxHeight: '520px' }}>

          {/* Header */}
          <div className="bg-coffee-gradient px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <Coffee size={16} className="text-white" />
              </div>
              <div>
                <div className="font-display text-base text-white font-semibold">Ikigai Bot</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-coffee-300 text-xs">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" title="Clear chat">
                <RotateCcw size={13} className="text-white" />
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X size={15} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-coffee-50/30" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id}>
                <MessageBubble msg={msg} />
                {/* Suggestions */}
                {msg.role === 'bot' && msg.suggestions?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 ml-9 mb-2">
                    {msg.suggestions.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s)}
                        className="text-xs bg-white border border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50 text-coffee-600 px-2.5 py-1 rounded-full transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2 items-end mb-2">
                <div className="w-7 h-7 rounded-full bg-coffee-gradient flex items-center justify-center flex-shrink-0">
                  <Coffee size={12} className="text-amber-100" />
                </div>
                <div className="chat-bubble-bot px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-coffee-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-coffee-50 border border-coffee-200 rounded-2xl px-4 py-2.5 focus-within:border-coffee-400 focus-within:ring-2 focus-within:ring-coffee-400/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our menu…"
                className="flex-1 bg-transparent text-coffee-800 text-sm placeholder-coffee-300 focus:outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className="w-7 h-7 rounded-full bg-coffee-500 hover:bg-coffee-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
            <p className="text-center text-coffee-300 text-[10px] mt-2 font-mono">Cafe Ikigai · Jubilee Hills, Hyderabad</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 133, 31, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(200, 133, 31, 0); }
        }
      `}</style>
    </>
  )
}
