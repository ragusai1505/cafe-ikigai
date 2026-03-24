# ☕ Cafe Ikigai — Full Stack Website

A modern, production-ready cafe website with admin panel, intelligent chatbot, and full menu management.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🏠 Public Site | Home, Menu, About, Contact |
| 🤖 Smart Chatbot | Menu-aware bot — answers price, category, location queries |
| 👨‍💼 Admin Panel | Dashboard, Add/Edit/Delete items, availability & featured toggles |
| 🔒 Auth | Protected admin routes, localStorage-based auth |
| 📱 Responsive | Mobile-first, works on all screen sizes |
| 🎨 Design | Playfair Display + Lato, coffee brown palette, smooth animations |
| ⚡ Performance | Vite, lazy images, minimal dependencies |

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Firebase credentials (optional — see below)
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production
```bash
npm run build
```

---

## 🔑 Default Admin Credentials

```
URL:      /admin/login
Email:    admin@cafeikigai.com
Password: admin123
```

> **Change these before going live!** Edit `src/context/AuthContext.jsx`

---

## 📁 Project Structure

```
cafe-ikigai/
├── public/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminLayout.jsx       # Sidebar layout
│   │   ├── chatbot/
│   │   │   └── Chatbot.jsx           # Intelligent chatbot
│   │   └── layout/
│   │       ├── Navbar.jsx            # Responsive navbar
│   │       └── Footer.jsx            # Footer with contact info
│   ├── context/
│   │   ├── AuthContext.jsx           # Admin authentication
│   │   └── MenuContext.jsx           # Menu CRUD state
│   ├── data/
│   │   └── menuData.js               # Default menu + contact info
│   ├── pages/
│   │   ├── Home.jsx                  # Landing page
│   │   ├── Menu.jsx                  # Public menu with filters
│   │   ├── About.jsx                 # About page
│   │   ├── Contact.jsx               # Contact + map
│   │   └── admin/
│   │       ├── Login.jsx             # Admin login
│   │       ├── Dashboard.jsx         # Menu management table
│   │       ├── AddItem.jsx           # Add new item form
│   │       └── EditItem.jsx          # Edit existing item
│   ├── App.jsx                       # Routes
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json                       # Vercel deployment config
└── .env.example
```

---

## 🧠 Data Storage

**Without Firebase (default):** Menu data is stored in `localStorage`. Changes persist across browser sessions on the same device.

**With Firebase:** Replace the `MenuContext.jsx` localStorage calls with Firestore operations. The context API is designed to be swappable.

### Firebase Setup (optional)
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Firestore** and **Storage**
3. Copy your config to `.env`

---

## 🤖 Chatbot Capabilities

The chatbot understands natural language and can answer:

| Query | Example |
|---|---|
| Greetings | "Hi", "Hello", "Good morning" |
| Menu overview | "What do you serve?", "Show me the menu" |
| Category items | "Show cold drinks", "What hot coffees do you have?" |
| Item prices | "Price of latte", "How much is tiramisu?" |
| Featured items | "What's popular?", "Recommend something" |
| Opening hours | "When are you open?", "What time do you close?" |
| Location | "Where are you?", "How do I get there?" |
| Dietary | "Do you have vegan options?" |
| Amenities | "Is there wifi?", "Do you have parking?" |

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The `vercel.json` is already configured for SPA routing.

---

## 🎨 Customization

### Change branding colors
Edit `tailwind.config.js` → `theme.extend.colors.coffee`

### Change contact info
Edit `src/data/menuData.js` → `CONTACT_INFO`

### Add menu categories
Edit `src/data/menuData.js` → `CATEGORIES` array

### Change admin credentials
Edit `src/context/AuthContext.jsx` → constants at top of `login` function

---

## 📦 Tech Stack

- **React 18** + Vite
- **React Router 6** — client-side routing
- **React Hook Form** — form validation
- **Tailwind CSS 3** — styling
- **Lucide React** — icons
- **React Hot Toast** — notifications
- **localStorage** — data persistence (Firebase-ready)

---

## 📍 Contact Info (DO NOT CHANGE)

As configured in `src/data/menuData.js`:

- **Address:** 8-2-293/82/A/270, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
- **Phone:** +91 98765 43210
- **Email:** hello@cafeikigai.com

---

Made with ☕ in Hyderabad
