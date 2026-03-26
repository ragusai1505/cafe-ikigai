import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Coffee, RotateCcw, ChevronDown } from 'lucide-react'
import { useMenu } from '../../context/MenuContext'
import { CONTACT_INFO } from '../../data/menuData'

// ── Smart Intent Engine ──────────────────────────────────────────────────────

function buildMenuContext(menuItems) {
  const available = menuItems.filter(i => i.available)
  const categories = [...new Set(available.map(i => i.category))]
  const lines = categories.map(cat => {
    const items = available.filter(i => i.category === cat)
    return `${cat}: ${items.map(i => `${i.name} (₹${i.price})`).join(', ')}`
  })
  return lines.join('\n')
}

function detectIntent(msg, menuItems) {
  const m = msg.toLowerCase().trim()
  const available = menuItems.filter(i => i.available)

  // Greeting
  if (/^(hi|hello|hey|hola|good\s*(morning|evening|afternoon)|namaste|howdy)/i.test(m))
    return { type: 'greeting' }

  // Thanks
  if (/thank|thanks|ty|great|awesome|perfect|wonderful/i.test(m))
    return { type: 'thanks' }

  // Bye
  if (/bye|goodbye|see you|cya|take care|later/i.test(m))
    return { type: 'farewell' }

  // Hours
  if (/hour|open|close|timing|when|time/i.test(m))
    return { type: 'hours' }

  // Location
  if (/where|location|address|find|direction|map|come|visit|how to reach/i.test(m))
    return { type: 'location' }

  // Wifi/amenities
  if (/wifi|wi-fi|internet|seat|parking|pet|facility|amenity/i.test(m))
    return { type: 'amenities' }

  // Vegan/dietary
  if (/vegan|vegetarian|dairy|gluten|allerg|diet|healthy/i.test(m))
    return { type: 'dietary' }

  // Price query
  const priceMatch = m.match(/price\s+(?:of\s+)?(.+)|how much\s+(?:is|for|does)?\s*(.+)|cost\s+of\s+(.+)|(.+)\s+(?:price|cost|rate)\??/)
  if (priceMatch) {
    const query = (priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4] || '').replace(/[?]/g, '').trim()
    if (query.length > 1) {
      const found = fuzzyFind(query, available)
      if (found.length) return { type: 'price', items: found }
    }
  }

  // Category matching - expanded keywords
  const catMap = [
    { keys: ['hot coffee','espresso','cappuccino','latte','flat white','americano','cortado','macchiato','bombon','mocha','affogato','bullet','shroom','irish'], cat: 'Hot Coffee' },
    { keys: ['cold coffee','iced coffee','cold latte','vietnamese','tiramisu latte','tonic espresso','orange espresso','far east'], cat: 'Cold Coffee' },
    { keys: ['cold brew','cranberry brew','cold fusion','honey cinnamon','watermelon brew','brew tonic'], cat: 'Cold Brew' },
    { keys: ['matcha','matcha bar','dalgona matcha','hojicha','iced matcha'], cat: 'Matcha Bar' },
    { keys: ['hot chocolate','choco','chocolate','brownie hot','paris hot','london choc'], cat: 'Hot Chocolate' },
    { keys: ['bubble tea','boba','taro','blueberry bubble','coconut bubble','blue hawaii'], cat: 'Bubble Tea' },
    { keys: ['shake','milkshake','oreo','kitkat','pina colada','banana shake','berry shake'], cat: 'Shakes' },
    { keys: ['tea','chai','jasmine','hibiscus','chamomile','lavender','butterfly pea','kahwa','lemongrass','ginger tea','apple cider'], cat: 'Teas' },
    { keys: ['lemonade','mojito','lime soda','ice tea','iced tea','fresh lime'], cat: 'Lemonades & Mojitos' },
    { keys: ['protein','healthy','abc juice','berry beet','protein latte','protein shake'], cat: 'Protein & Healthy' },
    { keys: ['breakfast','egg','toast','pancake','french toast','shakshuka','buddha bowl','quinoa','keema pav','croissant sandwich','guac','benedict'], cat: 'Breakfast' },
    { keys: ['sandwich','burger','club','panini','chicken burger','veg burger','lamb','wrap'], cat: 'Sandwiches & Burgers' },
    { keys: ['snack','starter','platter','small plate','fries','kataifi','arancini','tempura','spring roll','honey chilli','crispy'], cat: 'Small Platters' },
    { keys: ['soup','salad','caesar','greek salad','ghost pepper','manchow','mushroom soup','laksha'], cat: 'Soups & Salads' },
    { keys: ['sushi','dim sum','bao','roll','maki','prawn tempura roll','avocado roll','truffle roll'], cat: 'Sushi & Dim Sum' },
    { keys: ['pizza','margherita','woodfire','peri peri pizza','kodi','keema pizza','fungi','mushroom pizza'], cat: 'Pizza' },
    { keys: ['pasta','risotto','spaghetti','penne','fettuccine','lasagne','aglio','arrabbiata','alfredo','bolognese','pesto','parma rosa'], cat: 'Pasta & Risotto' },
    { keys: ['asian','wok','fried rice','noodle','thai','pad thai','hakka','gongura','kung pao','chilli garlic'], cat: 'Asian & Wok' },
    { keys: ['main','mains','grilled','fish chips','prawns portofino','chicken parmigiano','steak','peri peri chicken'], cat: 'Mains' },
    { keys: ['dessert','sweet','cake','tiramisu','cheesecake','brownie','banoffee','tres leches','korean bun'], cat: 'Desserts' },
  ]

  for (const { keys, cat } of catMap) {
    if (keys.some(k => m.includes(k))) {
      const items = available.filter(i => i.category === cat)
      if (items.length) return { type: 'category', category: cat, items }
    }
  }

  // Recommendation intents
  if (/recommend|suggest|what.*good|popular|best|favourite|special|what.*try|what.*have/i.test(m)) {
    if (/cold|cool|refresh|iced|chill/i.test(m)) return { type: 'recommend', tag: 'cold' }
    if (/hot|warm/i.test(m)) return { type: 'recommend', tag: 'hot' }
    if (/sweet|dessert|sugary/i.test(m)) return { type: 'recommend', tag: 'sweet' }
    if (/strong|bold|kick|energy|boost/i.test(m)) return { type: 'recommend', tag: 'strong' }
    if (/light|mild|gentle/i.test(m)) return { type: 'recommend', tag: 'light' }
    if (/eat|food|snack|hungry/i.test(m)) return { type: 'recommend', tag: 'food' }
    return { type: 'featured' }
  }

  // Featured
  if (/featured|today.*special|chef.*pick|top item/i.test(m))
    return { type: 'featured' }

  // Full menu
  if (/menu|what.*serve|what.*offer|what.*have|full list|all items|show.*menu/i.test(m))
    return { type: 'menu_overview' }

  // Fuzzy item search
  const found = fuzzyFind(m, available)
  if (found.length) return { type: 'item_search', items: found }

  return { type: 'unknown' }
}

function fuzzyFind(query, items) {
  const q = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const words = q.split(/\s+/).filter(w => w.length > 2)
  return items.filter(item => {
    const name = item.name.toLowerCase()
    const desc = item.description.toLowerCase()
    const cat = item.category.toLowerCase()
    return name.includes(q) || desc.includes(q) || cat.includes(q) ||
      words.some(w => name.includes(w) || cat.includes(w))
  }).slice(0, 5)
}

function generateResponse(intent, menuItems) {
  const available = menuItems.filter(i => i.available)

  switch (intent.type) {
    case 'greeting':
      return {
        text: "Hey there! Welcome to Café Ikigai ☕\n\nI'm your café assistant. I can help you explore our menu, find prices, get recommendations, or answer anything about our café.\n\nWhat can I help you with today?",
        suggestions: ['Show me the menu', "What's featured?", 'Recommend something', 'Opening hours']
      }

    case 'thanks':
      return {
        text: "Happy to help! ☕ Is there anything else I can assist you with?",
        suggestions: ['Show me the menu', 'Opening hours', 'Where are you located?']
      }

    case 'farewell':
      return {
        text: "See you soon at Café Ikigai! ☕✨ We'll have a fresh cup ready for you at Kondapur. Have a wonderful day!",
        suggestions: []
      }

    case 'hours':
      return {
        text: "⏰ We're open every day!\n\n📅 Monday to Sunday\n🕐 11:00 AM – 11:00 PM\n\n📍 Kondapur, Hyderabad\n📞 +91 80689 75800",
        suggestions: ['Where are you located?', 'Show me the menu']
      }

    case 'location':
      return {
        text: "📍 Find us here:\n\nGround Floor, PRIME Building (LEEWAY)\nKondapur, Laxmi Cyber City\nGachibowli, Hyderabad 500084\n\n📞 +91 80689 75800\n🕐 Open daily: 11AM – 11PM",
        suggestions: ['Opening hours', 'Show me the menu', "What's featured?"]
      }

    case 'amenities':
      return {
        text: "🏠 At Café Ikigai you'll find:\n\n• Free high-speed Wi-Fi\n• Comfortable indoor seating\n• Cozy outdoor seating\n• Ample nearby parking\n• Pet-friendly atmosphere\n\nCome as you are! ☕",
        suggestions: ['Opening hours', 'Where are you located?', 'Show me the menu']
      }

    case 'dietary':
      return {
        text: "🌱 We have plenty of vegetarian, vegan-friendly and healthy options!\n\nCheck out our:\n• **Protein & Healthy** section — protein shakes, ABC juice\n• **Breakfast** — Buddha Bowl, Quinoa Bowl\n• **Soups & Salads** — Caesar, Greek Salad\n\nPlant-based milk (oat, almond) available for any coffee drink. For specific allergies, please ask our baristas directly!",
        suggestions: ['Show healthy options', 'Show breakfast', 'Show salads']
      }

    case 'price': {
      const items = intent.items
      if (items.length === 1) {
        const it = items[0]
        return {
          text: `**${it.name}** is priced at **₹${it.price}** ☕\n\n_${it.description}_\n\n${it.available ? '✅ Available now!' : '❌ Currently unavailable'}`,
          suggestions: [`Show more in ${it.category}`, "What's featured?", 'Show me the menu']
        }
      }
      const list = items.map(i => `• **${i.name}** — ₹${i.price}`).join('\n')
      return {
        text: `Here are the matching items:\n\n${list}`,
        suggestions: ['Show me the menu', "What's featured?"]
      }
    }

    case 'category': {
      const { category, items } = intent
      if (!items.length) return { text: `Sorry, no ${category} items available right now. Try another category!`, suggestions: ['Show me the menu'] }
      const list = items.slice(0, 6).map(i => `• **${i.name}** — ₹${i.price}`).join('\n')
      const more = items.length > 6 ? `\n\n_...and ${items.length - 6} more items_` : ''
      return {
        text: `☕ **${category}** (${items.length} items):\n\n${list}${more}\n\nWant to know more about any of these?`,
        suggestions: items.slice(0, 2).map(i => `Price of ${i.name}`).concat(["What's featured?"])
      }
    }

    case 'recommend': {
      const { tag } = intent
      let items = []
      let message = ''
      if (tag === 'cold') {
        items = available.filter(i => ['Cold Coffee', 'Cold Brew', 'Bubble Tea', 'Shakes', 'Lemonades & Mojitos'].includes(i.category)).slice(0, 4)
        message = "Here are some refreshing cold options:"
      } else if (tag === 'hot') {
        items = available.filter(i => ['Hot Coffee', 'Hot Chocolate', 'Teas'].includes(i.category)).slice(0, 4)
        message = "Here are some warming hot drinks:"
      } else if (tag === 'sweet') {
        items = available.filter(i => ['Desserts', 'Hot Chocolate', 'Shakes', 'Bubble Tea'].includes(i.category)).slice(0, 4)
        message = "Here are some sweet treats:"
      } else if (tag === 'strong') {
        items = available.filter(i => i.name.toLowerCase().includes('espresso') || i.name.toLowerCase().includes('americano') || i.name.toLowerCase().includes('bullet') || i.category === 'Cold Brew').slice(0, 4)
        message = "For a strong coffee kick:"
      } else if (tag === 'light') {
        items = available.filter(i => ['Teas', 'Lemonades & Mojitos', 'Matcha Bar'].includes(i.category)).slice(0, 4)
        message = "Here are some light refreshing options:"
      } else if (tag === 'food') {
        items = available.filter(i => ['Breakfast', 'Sandwiches & Burgers', 'Small Platters', 'Soups & Salads'].includes(i.category)).slice(0, 4)
        message = "Here are some food options:"
      }
      if (!items.length) return { type: 'featured' }
      const list = items.map(i => `• **${i.name}** (${i.category}) — ₹${i.price}`).join('\n')
      return {
        text: `${message} ☕\n\n${list}\n\nWould you like to know more about any of these?`,
        suggestions: items.slice(0, 2).map(i => `Price of ${i.name}`).concat(['Show me the menu'])
      }
    }

    case 'featured': {
      const items = available.filter(i => i.featured).slice(0, 5)
      if (!items.length) return { text: "Ask me about any category — we have over 100 items!", suggestions: ['Show hot coffees', 'Show cold drinks', 'Show desserts'] }
      const list = items.map(i => `⭐ **${i.name}** (${i.category}) — ₹${i.price}`).join('\n')
      return {
        text: `✨ **Our Featured Favorites:**\n\n${list}\n\nAll handcrafted by our expert baristas!`,
        suggestions: ['Tell me about Cold Brew', 'Show desserts', 'Where are you located?']
      }
    }

    case 'menu_overview': {
      const cats = [...new Set(available.map(i => i.category))]
      const summary = cats.map(c => {
        const count = available.filter(i => i.category === c).length
        return `• **${c}** — ${count} item${count > 1 ? 's' : ''}`
      }).join('\n')
      return {
        text: `☕ **Café Ikigai Menu** — ${available.length} items available:\n\n${summary}\n\nAsk me about any category or item!`,
        suggestions: ['Show hot coffees', 'Show cold drinks', 'Show desserts', "What's featured?"]
      }
    }

    case 'item_search': {
      const items = intent.items.filter(i => i.available)
      if (!items.length) return { text: "I couldn't find that item. Let me show you what's available!", suggestions: ['Show me the menu', "What's featured?"] }
      if (items.length === 1) {
        const it = items[0]
        return {
          text: `Found it! ☕\n\n**${it.name}** (${it.category})\n₹${it.price}\n\n_${it.description}_`,
          suggestions: [`Show more in ${it.category}`, "What's featured?", 'Show me the menu']
        }
      }
      const list = items.map(i => `• **${i.name}** (${i.category}) — ₹${i.price}`).join('\n')
      return {
        text: `Here's what I found:\n\n${list}`,
        suggestions: ['Show me the menu', "What's featured?"]
      }
    }

    default:
      return {
        text: "Hmm, I didn't quite catch that! ☕\n\nI can help you with:\n• Menu browsing\n• Item prices\n• Recommendations\n• Opening hours\n• Location & directions\n\nWhat would you like to know?",
        suggestions: ['Show me the menu', "What's featured?", 'Opening hours', 'Where are you?']
      }
  }
}

// ── Markdown renderer ────────────────────────────────────────────────────────
function renderText(text) {
  return text.split('\n').map((line, i) => {
    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
  }).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <br key={`br-${i}`} />, el], [])
}

// ── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-coffee-gradient flex items-center justify-center flex-shrink-0 mt-auto mb-0.5 shadow-sm">
          <Coffee size={12} className="text-amber-100" />
        </div>
      )}
      <div className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${isBot ? 'chat-bubble-bot text-coffee-800' : 'chat-bubble-user text-white'}`}>
        {renderText(msg.text)}
      </div>
    </div>
  )
}

// ── Main Chatbot ─────────────────────────────────────────────────────────────
export default function Chatbot() {
  const { menuItems } = useMenu()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'bot',
      text: "Hey there! Welcome to Café Ikigai ☕\n\nI'm your café assistant — ask me about our menu, prices, recommendations, or how to find us!",
      suggestions: ['Show me the menu', "What's featured?", 'Opening hours', 'Where are you?']
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [hasNew, setHasNew] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      setTimeout(() => inputRef.current?.focus(), 100)
      setHasNew(false)
    }
  }, [open, messages])

  const sendMessage = useCallback((text) => {
    if (!text.trim() || typing) return
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
      if (!open) setHasNew(true)
    }, 500 + Math.random() * 400)
  }, [menuItems, typing, open])

  const handleKey = (e) => {
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
        {!open && hasNew && (
          <div className="bg-white border border-coffee-200 rounded-2xl px-3 py-2 shadow-lg text-coffee-700 text-xs font-medium animate-fade-in max-w-44 text-right">
            Ask me anything! ☕
          </div>
        )}
        <button onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-coffee-gradient text-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center relative"
          style={{ animation: 'pulseGlow 2s infinite' }}
          aria-label="Open chat">
          {open ? <ChevronDown size={22} /> : <MessageCircle size={22} />}
          {!open && hasNew && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-coffee-100 flex flex-col overflow-hidden animate-slide-up"
          style={{ maxHeight: '540px' }}>

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
                  <span className="text-coffee-300 text-xs">Online · {menuItems.filter(i=>i.available).length} items available</span>
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
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-coffee-50/30" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id}>
                <MessageBubble msg={msg} />
                {msg.role === 'bot' && msg.suggestions?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 ml-9 mb-3">
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

            {typing && (
              <div className="flex gap-2 items-end mb-2">
                <div className="w-7 h-7 rounded-full bg-coffee-gradient flex items-center justify-center flex-shrink-0">
                  <Coffee size={12} className="text-amber-100" />
                </div>
                <div className="chat-bubble-bot px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-1.5 h-1.5 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-coffee-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-coffee-50 border border-coffee-200 rounded-2xl px-4 py-2.5 focus-within:border-coffee-400 focus-within:ring-2 focus-within:ring-coffee-400/20 transition-all">
              <input ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about our menu..."
                className="flex-1 bg-transparent text-coffee-800 text-sm placeholder-coffee-300 focus:outline-none" />
              <button onClick={() => sendMessage(input)} disabled={!input.trim() || typing}
                className="w-7 h-7 rounded-full bg-coffee-500 hover:bg-coffee-600 disabled:opacity-40 flex items-center justify-center transition-all flex-shrink-0">
                <Send size={13} className="text-white" />
              </button>
            </div>
            <p className="text-center text-coffee-300 text-[10px] mt-2 font-mono">Café Ikigai · Kondapur, Hyderabad</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,133,31,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(200,133,31,0); }
        }
      `}</style>
    </>
  )
}
