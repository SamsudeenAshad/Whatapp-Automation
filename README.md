# WhatsApp Bulk Message Sender 📱

Send the same WhatsApp message to multiple contacts automatically using Python and WhatsApp Web.

## ✨ Features

- 📤 Send bulk WhatsApp messages to multiple contacts
- 📋 Read phone numbers from a CSV file
- 🌍 Automatic country code addition (+94 Sri Lanka)
- ⏱️ Smart delay between messages (15-20 seconds) to avoid blocking
- ❌ Error handling - continues to next contact if one fails
- 🔄 Auto-closes WhatsApp Web tabs after sending
- 📊 Summary report at the end

## 📋 Requirements

- Python 3.7 or higher
- Google Chrome (or your default browser) with WhatsApp Web logged in
- Internet connection

## 🚀 Installation

1. **Clone or download this repository**

2. **Install required Python libraries:**
   ```bash
   pip install -r requirements.txt
   ```
   Or install directly:
   ```bash
   pip install pywhatkit
   ```

3. **Login to WhatsApp Web:**
   - Open [web.whatsapp.com](https://web.whatsapp.com) in your browser
   - Scan the QR code with your phone
   - Keep the session logged in

## 📁 Setting Up Contacts

1. Create a file named `contacts.csv` in the same folder as the script
2. Add your phone numbers in the following format:

```csv
number
771234567
761234567
701234567
```

**Important Notes:**
- Do NOT include the country code - it's added automatically
- Do NOT include leading zeros (script handles this)
- One phone number per line
- See `contacts_example.csv` for reference

## 💬 Customizing Your Message

Open `whatsapp_sender.py` and edit the `MESSAGE` variable at the top:

```python
MESSAGE = """Hello! 👋

This is your custom message here.

Thank you!"""
```

## ▶️ Running the Script

1. Make sure WhatsApp Web is logged in
2. Open terminal/command prompt in the project folder
3. Run:
   ```bash
   python whatsapp_sender.py
   ```
4. Confirm when prompted
5. **Keep your computer unlocked and don't minimize the browser**

## ⚙️ Configuration Options

You can customize these settings in `whatsapp_sender.py`:

| Variable | Default | Description |
|----------|---------|-------------|
| `COUNTRY_CODE` | `+94` | Country code to add to numbers |
| `MIN_DELAY` | `15` | Minimum seconds between messages |
| `MAX_DELAY` | `20` | Maximum seconds between messages |
| `WAIT_TIME` | `15` | Seconds to wait for WhatsApp Web to load |
| `CLOSE_TAB_DELAY` | `3` | Seconds to wait before closing tab |

## 📊 Console Output Example

```
============================================================
       WhatsApp Bulk Message Sender
============================================================

✅ Successfully loaded 3 contacts from contacts.csv

------------------------------------------------------------
Message to be sent:
------------------------------------------------------------
Hello! 👋

This is an automated message sent via WhatsApp Web.

Thank you!
------------------------------------------------------------

📋 Ready to send message to 3 contacts
⏱️  Delay between messages: 15-20 seconds

Do you want to proceed? (yes/no): yes

🚀 Starting to send messages...
============================================================

[1/3] Processing +94771234567
📱 Sending message to +94771234567...
✅ Message sent successfully to +94771234567
⏳ Waiting 17 seconds before next message...

[2/3] Processing +94761234567
📱 Sending message to +94761234567...
✅ Message sent successfully to +94761234567
⏳ Waiting 15 seconds before next message...

[3/3] Processing +94701234567
📱 Sending message to +94701234567...
✅ Message sent successfully to +94701234567

============================================================
                    SUMMARY
============================================================
✅ Messages sent successfully: 3
❌ Messages failed: 0
📊 Total contacts: 3
============================================================

🎉 Process completed!
```

## ⚠️ Important Warnings

1. **Don't send too many messages** - WhatsApp may temporarily block your number
2. **Keep delays between 15-20 seconds** - This helps avoid detection
3. **Don't minimize the browser** - The automation needs the browser visible
4. **Test with few contacts first** - Make sure everything works before bulk sending
5. **Use responsibly** - Don't spam people or use for marketing without consent

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "File not found" error | Make sure `contacts.csv` is in the same folder as the script |
| Messages not sending | Check if WhatsApp Web is logged in |
| Browser not opening | Install Chrome or set your default browser |
| Tab not closing | Increase `CLOSE_TAB_DELAY` value |
| WhatsApp blocking | Increase delay times or wait before sending more |

## 📝 License

This project is open source. Use responsibly and ethically.

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

**Disclaimer:** This tool is for educational purposes. Use responsibly and comply with WhatsApp's Terms of Service. The author is not responsible for any misuse or account restrictions.
