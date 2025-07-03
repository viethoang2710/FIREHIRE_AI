// FE/src/components/UI/Chatbot.js

import React, { useState, useRef, useEffect } from 'react'; 
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [
      { text: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?', sender: 'bot' }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const getBotResponse = (userInput) => {
    const lower = userInput.toLowerCase().trim();
    if (lower.includes('việc làm') || lower.includes('job')) {
      return 'Bạn có thể tìm kiếm việc làm tại mục "Tìm việc làm" trong thanh menu.';
    }
    if (lower.includes('cv') || lower.includes('tạo cv')) {
      return 'Bạn có thể tạo CV tại trang "Tạo CV Online". Hãy thử ngay!';
    }
    if (lower.includes('chào') || lower.includes('hello')) {
      return 'Chào bạn, tôi có thể giúp gì cho bạn hôm nay?';
    }
    if (lower.includes('cảm ơn')) {
      return 'Rất vui được giúp bạn!';
    }
    return 'Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về "việc làm" hoặc "tạo CV" nhé!';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botReply = { text: getBotResponse(inputValue), sender: 'bot' };
      setMessages(prev => [...prev, botReply]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-5 w-80 sm:w-96 h-[450px] sm:h-[500px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        role="dialog"
        aria-hidden={!isOpen}
        aria-label="Hộp thoại trò chuyện với trợ lý ảo"
      >
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
          <div className="flex items-center">
            <Bot size={24} className="mr-2" />
            <h3 className="font-bold">Trợ lý ảo JobFinder</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-blue-700" aria-label="Đóng chat">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50" role="log" aria-live="polite">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-xl">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={!isOpen}
            />
            <button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" aria-label="Gửi tin nhắn">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Toggle Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-5 right-5 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform duration-200 hover:scale-110 z-50"
        aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </>
  );
};

export default Chatbot;
