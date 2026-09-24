'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Upload, 
  Send, 
  Link2, 
  Users, 
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
  FileText,
  Trash2,
  Plus,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react'
import Papa from 'papaparse'

// Types
interface Contact {
  number: string
  status: 'pending' | 'sending' | 'sent' | 'failed'
}

type Step = 1 | 2 | 3

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isConnected, setIsConnected] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [message, setMessage] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendingProgress, setSendingProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  // Format phone number with country code
  const formatPhoneNumber = (number: string): string => {
    let cleaned = number.replace(/[\s\-\.]/g, '')
    if (cleaned.startsWith('94')) {
      return '+' + cleaned
    } else if (cleaned.startsWith('0')) {
      return '+94' + cleaned.slice(1)
    } else if (cleaned.startsWith('7')) {
      return '+94' + cleaned
    }
    return '+94' + cleaned
  }

  // Handle CSV file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const numbers = results.data
          .map((row: any) => row.number || row.Number || row.phone || row.Phone)
          .filter((num: string) => num && num.trim())
          .map((num: string) => ({
            number: num.trim(),
            status: 'pending' as const
          }))
        setContacts(prev => [...prev, ...numbers])
      }
    })
    e.target.value = ''
  }, [])

  // Add single number
  const addNumber = () => {
    if (newNumber.trim()) {
      setContacts(prev => [...prev, { number: newNumber.trim(), status: 'pending' }])
      setNewNumber('')
    }
  }

  // Remove contact
  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index))
  }

  // Clear all contacts
  const clearContacts = () => {
    setContacts([])
  }

  // Simulate WhatsApp connection
  const connectWhatsApp = () => {
    // In a real implementation, this would open WhatsApp Web QR scanner
    setTimeout(() => {
      setIsConnected(true)
    }, 2000)
  }

  // Generate WhatsApp API URL that auto-sends (using wa.me with pre-filled text)
  const generateWhatsAppURL = (number: string, text: string): string => {
    const formattedNumber = formatPhoneNumber(number).replace('+', '')
    const encodedMessage = encodeURIComponent(text)
    // Using the WhatsApp API URL format
    return `https://wa.me/${formattedNumber}?text=${encodedMessage}`
  }

  // Send messages (opens WhatsApp Web links one by one)
  const sendMessages = async () => {
    if (contacts.length === 0 || !message.trim()) return

    setIsSending(true)
    setSendingProgress(0)

    // Show instruction alert
    alert(`📱 Instructions:\n\n1. Each contact will open in WhatsApp Web\n2. The message is pre-typed\n3. Just press ENTER or click Send button\n4. Close the tab and the next contact will open\n\nTip: Keep your hands on the keyboard and press Enter quickly for each contact!`)

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i]
      
      // Update status to sending
      setContacts(prev => prev.map((c, idx) => 
        idx === i ? { ...c, status: 'sending' } : c
      ))

      // Open WhatsApp Web link
      const url = generateWhatsAppURL(contact.number, message)
      const newWindow = window.open(url, '_blank')

      // Wait for user to send and close (longer wait)
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Update status to sent
      setContacts(prev => prev.map((c, idx) => 
        idx === i ? { ...c, status: 'sent' } : c
      ))

      setSendingProgress(((i + 1) / contacts.length) * 100)
    }

    setIsSending(false)
    alert('✅ All messages have been opened! Make sure you sent each one.')
  }

  // Copy message to clipboard
  const copyMessage = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Step navigation
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((currentStep + 1) as Step)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step)
  }

  const canProceedToStep2 = isConnected
  const canProceedToStep3 = contacts.length > 0
  const canSend = message.trim().length > 0 && contacts.length > 0

  return (
    <main className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Animated background bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="bubble w-64 h-64 top-10 -left-20"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bubble w-48 h-48 top-1/3 right-10"
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="bubble w-32 h-32 bottom-20 left-1/4"
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="bubble w-40 h-40 bottom-1/3 right-1/4"
          animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl glass flex items-center justify-center"
            >
              <MessageCircle className="w-8 h-8 text-sky-600" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              WhatsApp Bulk Sender
            </h1>
          </div>
          <p className="text-sky-700/80 text-lg">
            Send messages to multiple contacts with ease ✨
          </p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex justify-center items-center gap-4 mb-10">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                  currentStep === step
                    ? 'step-active'
                    : currentStep > step
                    ? 'step-completed'
                    : 'step-pending text-sky-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep > step ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : step === 1 ? (
                  <Link2 className="w-5 h-5" />
                ) : step === 2 ? (
                  <Users className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                  currentStep > step ? 'bg-emerald-400' : 'bg-white/30'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center gap-8 mb-8 text-sm">
          <span className={`transition-colors ${currentStep >= 1 ? 'text-sky-700 font-medium' : 'text-sky-600/60'}`}>
            Connect
          </span>
          <span className={`transition-colors ${currentStep >= 2 ? 'text-sky-700 font-medium' : 'text-sky-600/60'}`}>
            Add Contacts
          </span>
          <span className={`transition-colors ${currentStep >= 3 ? 'text-sky-700 font-medium' : 'text-sky-600/60'}`}>
            Send Message
          </span>
        </div>

        {/* Main Content Card */}
        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Connect WhatsApp */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-sky-800 mb-2">
                    Connect WhatsApp Web
                  </h2>
                  <p className="text-sky-600/80">
                    First, make sure you're logged into WhatsApp Web in your browser
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6 py-8">
                  {!isConnected ? (
                    <>
                      <div className="w-48 h-48 glass rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                          <Link2 className="w-16 h-16 text-sky-500 mx-auto mb-4" />
                          <p className="text-sky-600 text-sm">
                            Click to verify connection
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={connectWhatsApp}
                        className="glass-button px-8 py-4 rounded-2xl text-sky-700 font-semibold flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="w-5 h-5" />
                        Open WhatsApp Web
                      </motion.button>
                      <p className="text-sky-600/60 text-sm text-center max-w-md">
                        Open web.whatsapp.com in a new tab and scan the QR code with your phone. 
                        Then come back and click the button above.
                      </p>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                        Connected Successfully!
                      </h3>
                      <p className="text-sky-600/80">
                        WhatsApp Web is ready to use
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end">
                  <motion.button
                    onClick={nextStep}
                    disabled={!canProceedToStep2}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      canProceedToStep2
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40'
                        : 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={canProceedToStep2 ? { scale: 1.02 } : {}}
                    whileTap={canProceedToStep2 ? { scale: 0.98 } : {}}
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add Contacts */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-sky-800 mb-2">
                    Add Your Contacts
                  </h2>
                  <p className="text-sky-600/80">
                    Upload a CSV file or enter phone numbers manually
                  </p>
                </div>

                {/* Upload and Manual Entry */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* CSV Upload */}
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="font-semibold text-sky-800">Upload CSV</h3>
                    </div>
                    <label className="block">
                      <div className="border-2 border-dashed border-sky-300/50 rounded-xl p-6 text-center cursor-pointer hover:border-sky-400/70 transition-colors">
                        <FileText className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                        <p className="text-sky-600 text-sm">
                          Click to upload CSV file
                        </p>
                        <p className="text-sky-500/60 text-xs mt-1">
                          Column header: "number"
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Manual Entry */}
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="font-semibold text-sky-800">Add Manually</h3>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNumber}
                        onChange={(e) => setNewNumber(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addNumber()}
                        placeholder="Enter phone number"
                        className="glass-input flex-1 px-4 py-3 rounded-xl text-sky-800 placeholder-sky-400"
                      />
                      <motion.button
                        onClick={addNumber}
                        className="glass-button px-4 py-3 rounded-xl text-sky-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <p className="text-sky-500/60 text-xs mt-2">
                      Format: 771234567 or 0771234567
                    </p>
                  </div>
                </div>

                {/* Contacts List */}
                {contacts.length > 0 && (
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-sky-800">
                          Contacts ({contacts.length})
                        </h3>
                      </div>
                      <motion.button
                        onClick={clearContacts}
                        className="text-red-400 hover:text-red-500 text-sm flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </motion.button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {contacts.map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between bg-white/30 rounded-xl px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              contact.status === 'sent' ? 'bg-emerald-400' :
                              contact.status === 'failed' ? 'bg-red-400' :
                              contact.status === 'sending' ? 'bg-yellow-400 animate-pulse' :
                              'bg-sky-400'
                            }`} />
                            <span className="text-sky-800 font-mono">
                              {formatPhoneNumber(contact.number)}
                            </span>
                          </div>
                          <motion.button
                            onClick={() => removeContact(index)}
                            className="text-red-400 hover:text-red-500 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <XCircle className="w-5 h-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <motion.button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sky-600 glass-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    disabled={!canProceedToStep3}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      canProceedToStep3
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40'
                        : 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={canProceedToStep3 ? { scale: 1.02 } : {}}
                    whileTap={canProceedToStep3 ? { scale: 0.98 } : {}}
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Compose and Send */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-sky-800 mb-2">
                    Compose Your Message
                  </h2>
                  <p className="text-sky-600/80">
                    Write your message and send to {contacts.length} contacts
                  </p>
                </div>

                {/* Message Composer */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="font-semibold text-sky-800">Your Message</h3>
                    </div>
                    <motion.button
                      onClick={copyMessage}
                      className="text-sky-500 hover:text-sky-600 text-sm flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </motion.button>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here... ✨"
                    rows={5}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sky-800 placeholder-sky-400 resize-none"
                  />
                  <div className="flex justify-between mt-2 text-xs text-sky-500/60">
                    <span>Supports emojis! 🎉</span>
                    <span>{message.length} characters</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold text-sky-800 mb-4">Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/30 rounded-xl p-4 text-center">
                      <Users className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-sky-800">{contacts.length}</p>
                      <p className="text-sky-600/80 text-sm">Contacts</p>
                    </div>
                    <div className="bg-white/30 rounded-xl p-4 text-center">
                      <MessageCircle className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-sky-800">{message.length}</p>
                      <p className="text-sky-600/80 text-sm">Characters</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (when sending) */}
                {isSending && (
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
                      <span className="text-sky-700 font-medium">Sending messages...</span>
                    </div>
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${sendingProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-sky-600/80 text-sm mt-2 text-center">
                      {Math.round(sendingProgress)}% complete
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <motion.button
                    onClick={prevStep}
                    disabled={isSending}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sky-600 glass-button disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={sendMessages}
                    disabled={!canSend || isSending}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                      canSend && !isSending
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40'
                        : 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                    }`}
                    whileHover={canSend && !isSending ? { scale: 1.02 } : {}}
                    whileTap={canSend && !isSending ? { scale: 0.98 } : {}}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Messages
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Info Note */}
                <div className="bg-amber-100/50 rounded-xl p-4">
                  <p className="text-amber-700 text-sm font-medium mb-2">
                    ⚠️ Web Browser Limitation
                  </p>
                  <p className="text-amber-600 text-sm">
                    Due to browser security, messages open in WhatsApp but require you to press <strong>Enter</strong> to send. 
                    For <strong>fully automatic</strong> sending, use the Python desktop script instead!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sky-600/60 text-sm mt-8"
        >
          Made with 💙 | WhatsApp Bulk Sender
        </motion.p>
      </div>
    </main>
  )
}
