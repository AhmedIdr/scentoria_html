# 🕯️ Scentoria - Luxury Moroccan Candles

> Hand-poured luxury candles inspired by Morocco's diverse landscapes. 100% vegetable wax, artisanal fragrances for your home and spa.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)

## ✨ Features

- 🛒 **Full E-commerce** - Cart with localStorage persistence, quantity controls
- 🔍 **Product Search** - Full-text search across products
- 📊 **Smart Filtering** - Category, scent family, price sorting
- 🎨 **Beautiful Design** - Moroccan-inspired luxury aesthetic
- ♿ **Accessible** - WCAG AA compliant, keyboard navigation
- 📱 **Responsive** - Mobile-first design
- 🚀 **Fast** - Optimized images, lazy loading
- 🔔 **Toast Notifications** - Real-time feedback
- 🎯 **SEO Ready** - Open Graph, Twitter Cards, meta tags

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
npm run build
```

## 📦 Deploy to Cloudflare Pages

### Option 1: Dashboard (Easiest)

1. Visit [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create** → **Pages**
3. Connect your GitHub repo
4. Configure:
   - **Build command:** `npm run build`
   - **Build output:** `dist`
   - **Environment variable:** `NODE_VERSION=18`
5. Click **Deploy**

### Option 2: CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build and deploy
npm run build
wrangler pages deploy dist --project-name=scentoria
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🏗️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand (with persistence)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Fonts:** Inter, Playfair Display

## 📁 Project Structure

```
scentoria_html/
├── components/
│   ├── Layout.tsx        # Navbar, Footer, CartDrawer
│   ├── UI.tsx            # Reusable UI components
│   ├── Toast.tsx         # Notification system
│   ├── SEO.tsx           # Meta tags manager
│   └── GeneratedImage.tsx # Image component
├── pages/
│   ├── Home.tsx          # Landing page
│   ├── Shop.tsx          # Product listing
│   ├── ProductDetail.tsx # Product page
│   ├── CartCheckout.tsx  # Checkout
│   └── StaticPages.tsx   # About, Contact, etc.
├── constants.ts          # Product data
├── store.ts             # Zustand state
├── types.ts             # TypeScript types
└── App.tsx              # Main app component
```

## 🎨 Design System

### Colors
- **Sand:** `#F7F0E8` - Background
- **Clay:** `#E3B9A4` - Accents
- **Cedar:** `#6B4A35` - Primary text
- **Midnight:** `#0F2B2A` - Dark elements
- **Gold:** `#D2A667` - Highlights

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

## 🔄 Recent Improvements

✅ Removed custom cursor (accessibility fix)
✅ Replaced AI images with Unsplash placeholders
✅ Switched to BrowserRouter for SEO
✅ Added comprehensive accessibility features
✅ Implemented cart persistence
✅ Added toast notifications
✅ Built product search & sorting
✅ Added SEO meta tags
✅ Active page indicators in navigation

## 📝 TODO

- [ ] Breadcrumb navigation
- [ ] Related products section
- [ ] Newsletter signup functionality
- [ ] Error boundaries
- [ ] Parallax scroll optimization
- [ ] Image zoom on product pages
- [ ] Complete checkout flow
- [ ] Content pages (About, Rituals, Contact)
- [ ] Promo code support

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🌟 Credits

- Design inspired by Moroccan luxury aesthetics
- Images from [Unsplash](https://unsplash.com)
- Built with ❤️ for artisanal quality
