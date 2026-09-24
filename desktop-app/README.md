# WhatsApp Bulk Sender - Desktop App 🖥️

A beautiful Electron desktop application for sending WhatsApp messages to multiple contacts **automatically**!

## ✨ Features

- 🎨 **Stunning Glassmorphism UI** - Beautiful, modern design
- 🤖 **Fully Automatic Sending** - No manual intervention needed!
- 📱 **Real WhatsApp Web Integration** - Uses actual WhatsApp Web
- 📤 **CSV Upload** - Import contacts from CSV files
- ✏️ **Manual Entry** - Add phone numbers one by one
- 📊 **Live Progress** - See real-time sending progress
- 💾 **Saves Session** - WhatsApp stays logged in

## 🚀 How It Works

Unlike the web app, this desktop application:
1. Opens WhatsApp Web in a **controlled window**
2. **Automatically navigates** to each contact
3. **Types the message** and **presses send**
4. Shows you the progress in real-time

## 📦 Installation

1. **Install Node.js** (v18 or later)

2. **Navigate to the desktop-app folder:**
   ```bash
   cd desktop-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the app:**
   ```bash
   npm start
   ```

## 📋 Usage

### Step 1: Connect WhatsApp
- Click "Open WhatsApp Web"
- A new window opens with WhatsApp Web
- Scan the QR code with your phone
- The app will detect when you're logged in

### Step 2: Add Contacts
- **Upload CSV**: Click to upload a CSV file with a "number" column
- **Manual Entry**: Type numbers and click + to add

### Step 3: Send Messages
- Write your message (supports emojis! 🎉)
- Click "Send Messages"
- Watch the magic happen! ✨

## 📄 CSV Format

```csv
number
771234567
0761234567
94701234567
```

## 🔧 Building for Distribution

To create an executable:

```bash
npm run build
```

This creates installers in the `dist` folder.

## ⚠️ Important Notes

- Keep the WhatsApp Web window open while sending
- Don't send too many messages too quickly
- Make sure you're not violating WhatsApp's terms of service
- Use responsibly!

## 🛠️ Tech Stack

- **Electron** - Desktop app framework
- **Tailwind CSS** - Styling
- **Puppeteer-core** - Browser automation

---

Made with 💙 by Samsudeen Ashad
