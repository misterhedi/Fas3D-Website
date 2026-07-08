import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, HelpCircle, Shield, Phone, ArrowRight, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Halo! Selamat datang di Layanan Pelanggan PT FAS Technology Solutions. Saya asisten virtual AI Anda.\n\nAda yang bisa saya bantu hari ini? Anda bisa menanyakan tentang produk digital desa, harga paket, izin Kemenkumham, program kemitraan Reseller, atau sertifikasi ISO 27001 kami.",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Open chat and clear notifications
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  // Quick action prompt chips helper
  const handleQuickAction = (topic: string, promptText: string) => {
    handleSendMessage(promptText);
  };

  // Handle message sending
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (!textToSend) {
      setInputValue("");
    }

    // Append user message
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Send message to our server-side API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      
      const data = await response.json();
      
      // Artificial delay to feel authentic
      setTimeout(() => {
        setIsTyping(false);
        if (data.success && data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}-bot`,
              sender: "bot",
              text: data.reply,
              timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
            }
          ]);
        } else {
          // General fallback message if server fails
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}-bot`,
              sender: "bot",
              text: "Maaf, sistem kami sedang sibuk saat ini. Silakan hubungi langsung tim Sales & Support kami di WhatsApp (+62 812-3456-7890) untuk respons instan.",
              timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
            }
          ]);
        }
      }, 1000);

    } catch (err) {
      console.error("Failed to connect to chat API:", err);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-bot`,
            sender: "bot",
            text: "Koneksi terputus. Silakan periksa jaringan internet Anda atau langsung hubungi kami via WhatsApp di +62 812-3456-7890.",
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const promptChips = [
    { label: "📂 Produk Terpopuler", prompt: "Sebutkan produk terpopuler dan harganya" },
    { label: "📄 Legalitas Kemenkumham", prompt: "Apakah PT FAS resmi? Minta info legalitas" },
    { label: "🔒 Standar ISO 27001", prompt: "Bagaimana dengan keamanan data kependudukan?" },
    { label: "👥 Program Reseller", prompt: "Bagaimana cara gabung reseller dan berapa komisinya?" },
    { label: "📞 Hubungi WhatsApp", prompt: "Minta kontak resmi WhatsApp dan Email" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[1050] flex flex-col items-end">
      
      {/* Chat Window container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-[#050b14]/98 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 backdrop-blur-xl"
            id="live-chat-panel"
          >
            {/* Header */}
            <div className="bg-[#0b1322] border-b border-white/5 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-tr from-[#c9a84c] to-blue-500 rounded-xl flex items-center justify-center text-slate-900 font-extrabold shadow-md">
                    <Sparkles size={16} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#050b14] rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-white tracking-wide">FAS AI Assistant</h4>
                    <span className="text-[7px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded uppercase">Live</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                    <Shield size={9} className="text-[#c9a84c]" />
                    <span>ISO 27001 Certified Security</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                title="Tutup Chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5 scrollbar-thin flex flex-col">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  {/* Avatar icon */}
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border ${
                    msg.sender === "user"
                      ? "bg-[#1e6bb8]/15 border-[#1e6bb8]/30 text-blue-300"
                      : "bg-[#c9a84c]/10 border-[#c9a84c]/20 text-[#c9a84c]"
                  }`}>
                    {msg.sender === "user" ? <User size={12} /> : <Sparkles size={12} />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed font-sans whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-[#1e6bb8] text-white rounded-tr-none"
                        : "bg-[#0b1322] border border-white/5 text-gray-200 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[8px] text-gray-500 font-mono block ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2 max-w-[85%] self-start animate-pulse">
                  <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]">
                    <Sparkles size={12} />
                  </div>
                  <div className="bg-[#0b1322] border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips list before footer input */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#070e1a]/40 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(chip.label, chip.prompt)}
                  className="bg-white/5 hover:bg-[#c9a84c]/10 border border-white/5 hover:border-[#c9a84c]/30 text-[10px] text-gray-300 hover:text-[#c9a84c] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat input footer */}
            <div className="p-3 bg-[#0b1322] border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ketik pertanyaan Anda tentang PT FAS..."
                className="flex-grow bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]"
                maxLength={400}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-[#c9a84c] hover:bg-[#b0913b] active:scale-95 text-slate-900 p-2 rounded-xl transition-all flex items-center justify-center shrink-0"
                title="Kirim Pesan"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing Launcher Button */}
      <button
        onClick={handleToggleChat}
        className="w-14 h-14 bg-gradient-to-tr from-[#c9a84c] to-blue-500 rounded-full flex items-center justify-center text-slate-900 shadow-2xl relative hover:scale-105 active:scale-95 cursor-pointer border border-white/20 transition-all group"
        title="Buka Live Chat FAS"
        id="live-chat-toggle"
      >
        <span className="absolute inset-0 rounded-full bg-[#c9a84c] animate-ping opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></span>
        
        {isOpen ? (
          <X size={24} className="animate-spin-slow" />
        ) : (
          <MessageSquare size={24} className="transform group-hover:rotate-12 transition-transform" />
        )}

        {/* Unread dot notification badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-900 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center shadow-lg animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

    </div>
  );
}
