import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader } from 'lucide-react';
import ChatbotIcon from '../../logochatbotAI.png'; // Đảm bảo ảnh nằm đúng thư mục

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào! Tôi là trợ lý AI của JobFinder – chuyên hỗ trợ viết CV, tìm việc và phỏng vấn. Bạn cần giúp gì?',
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const fetchBotResponse = async (userInput) => {
    setIsLoading(true);

    const chatHistory = messages.map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    chatHistory.push({ role: 'user', parts: [{ text: userInput }] });

    const payload = { contents: chatHistory };

    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const model = process.env.REACT_APP_GEMINI_MODEL || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Lỗi ${response.status}: ${error.error?.message || 'Không xác định'}`);
      }

      const result = await response.json();
      const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa hiểu yêu cầu của bạn.";
      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    } catch (err) {
      console.error("Lỗi API:", err);
      setMessages(prev => [
        ...prev,
        { text: `Đã xảy ra lỗi: ${err.message}. Vui lòng thử lại sau.`, sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    await fetchBotResponse(currentInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-24 right-5 w-80 sm:w-96 h-[450px] bg-white rounded-xl shadow-lg z-50 flex flex-col transition-all ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
          <div className="flex items-center">
            <Bot size={24} className="mr-2" />
            <h3 className="font-bold">Trợ lý AI JobFinder</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                    <Bot size={20} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                  <Bot size={20} />
                </div>
                <div className="text-sm bg-white p-3 rounded-2xl shadow animate-pulse">
                  AI đang trả lời...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
          <div className="relative">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "AI đang trả lời..." : "Nhập câu hỏi của bạn..."}
              disabled={isLoading || !isOpen}
              className="w-full py-2 px-4 border rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            >
              {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </div>

      {/* Toggle Button with Image */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-lg z-50 hover:scale-105 transition"
      >
        {isOpen ? (
          <X size={28} className="text-blue-600" />
        ) : (
          <img src={ChatbotIcon} alt="Chatbot Icon" className="w-full h-full object-cover" />
        )}
      </button>
    </>
  );
};

export default Chatbot;
