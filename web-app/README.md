# WhatsApp Bulk Sender - Web App 📱

A beautiful, modern web application for sending WhatsApp messages to multiple contacts with a stunning glassmorphism UI design.

![WhatsApp Bulk Sender](https://img.shields.io/badge/WhatsApp-Bulk_Sender-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

## ✨ Features

- 🎨 **Beautiful Glassmorphism UI** - Modern, clean design with glass effects
- 📱 **3-Step Process** - Connect → Add Contacts → Send Messages
- 📤 **CSV Upload** - Upload contacts from CSV files
- ✏️ **Manual Entry** - Add phone numbers one by one
- 🌍 **Auto Country Code** - Automatically adds +94 (Sri Lanka)
- 📊 **Progress Tracking** - See real-time sending progress
- 🎭 **Animations** - Smooth, delightful animations throughout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Navigate to the web-app folder:**
   ```bash
   cd web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deploy to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd web-app
   vercel
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set the root directory to `web-app`
5. Deploy!

## 🎨 UI Features

### Glassmorphism Design
- Frosted glass effect cards
- Subtle shadows and reflections
- Beautiful gradient backgrounds
- Animated floating bubbles

### Color Scheme
- Primary: Cool Sky Blue (#0ea5e9)
- Accent: Cyan (#06b6d4)
- Success: Emerald (#10b981)
- Background: Light blue gradient

### Step-by-Step Flow
1. **Connect** - Verify WhatsApp Web is logged in
2. **Add Contacts** - Upload CSV or enter numbers manually
3. **Send Message** - Compose and send to all contacts

## 📋 CSV Format

Create a CSV file with a column named `number`:

```csv
number
771234567
0761234567
94701234567
```

The app handles all formats:
- `771234567` → `+94771234567`
- `0771234567` → `+94771234567`
- `94771234567` → `+94771234567`

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **CSV Parsing:** PapaParse
- **Language:** TypeScript

## ⚠️ Important Notes

1. **Pop-ups Required** - The app opens WhatsApp Web links in new tabs
2. **WhatsApp Web** - Must be logged in before sending
3. **Browser Support** - Works best in Chrome/Edge
4. **Rate Limiting** - Don't send too many messages too quickly

## 📝 License

BSD 2-Clause License - See LICENSE file for details

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Made with 💙 by Samsudeen Ashad
