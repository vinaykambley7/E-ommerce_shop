import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { AIProcessingDots } from './AIProcessingDots';

export function ChatbotPanel() {
  const { chatbot, toggleChat, setChatOpen, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatbot.messages, chatbot.isTyping]);

  useEffect(() => {
    if (chatbot.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatbot.isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!chatbot.isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={toggleChat}
            className={`fixed bottom-6 right-6 z-[90] w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${
              !chatbot.hasBeenOpened ? 'animate-fab-pulse' : ''
            }`}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatbot.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 100, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6 md:w-[400px] md:h-[560px] h-[80vh] bg-white md:rounded-2xl rounded-t-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] z-[100] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-navy text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-mint flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">ShopSmart Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-[#A3C4D8]">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Welcome Message */}
              {chatbot.messages.length === 0 && (
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3 h-3 text-navy" />
                  </div>
                  <div className="bg-[#F1F5F9] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-[#1E293B] leading-relaxed">
                      Hi there! I'm your AI shopping assistant. I can help you with product
                      recommendations, shipping questions, returns, and more. What can I help you with
                      today?
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Recommend products', 'Shipping info', 'Return policy'].map(s => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="px-3.5 py-1.5 border border-[#E2E8F0] rounded-full text-xs font-medium text-[#1E293B] hover:bg-mint hover:text-navy transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {chatbot.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-navy" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 max-w-[85%] rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-navy text-white rounded-tr-sm'
                        : 'bg-[#F1F5F9] text-[#1E293B] rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => handleSuggestion(s)}
                            className="px-3.5 py-1.5 border border-[#E2E8F0] rounded-full text-xs font-medium text-[#1E293B] hover:bg-mint hover:text-navy transition-colors bg-white/50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200' : 'text-[#94A3B8]'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {chatbot.isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3 h-3 text-navy" />
                  </div>
                  <div className="bg-[#F1F5F9] rounded-2xl rounded-tl-sm px-4 py-3">
                    <AIProcessingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 px-5 border-t border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about products, shipping..."
                  className="flex-1 h-11 border border-[#E2E8F0] rounded-full px-4 text-sm focus:outline-none focus:border-royalBlue focus:ring-1 focus:ring-royalBlue/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-11 h-11 bg-navy text-white rounded-full flex items-center justify-center hover:bg-navy-dark transition-colors disabled:bg-[#CBD5E1] disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-[#94A3B8] text-center mt-1">Press Enter to send</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
