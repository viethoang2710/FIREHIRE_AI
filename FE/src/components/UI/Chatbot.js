import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader, Copy, Trash2, RefreshCw, MapPin, DollarSign, Building, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatbotIcon from '../../logochatbotAI.png';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: `👋 **Chào bạn! Tôi là JobFinder AI Assistant**

🤖 Tôi được trang bị công nghệ AI Gemini để hỗ trợ bạn như một ChatGPT chuyên về việc làm!

🎯 **Tôi có thể giúp bạn:**
• 🔍 Tìm kiếm việc làm phù hợp từ database
• 📝 Tư vấn viết CV, thư xin việc
• 💼 Chuẩn bị phỏng vấn
• 🎓 Lời khuyên nghề nghiệp
• 💬 Trò chuyện về bất kỳ chủ đề nào!

✨ **Thử hỏi tôi:**
"Tìm việc IT tại Hà Nội"
"Cách viết CV ấn tượng"
"Làm sao để tự tin trong phỏng vấn"

🚀 Hãy bắt đầu cuộc trò chuyện nhé!`,
      sender: 'bot',
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const messagesEndRef = useRef(null);

  // Component để hiển thị job card
  const JobCard = ({ job }) => {
    const handleJobClick = () => {
      // Navigate đến trang job detail và đóng chatbot
      navigate(`/jobs/${job.id}`);
      setIsOpen(false);
    };

    return (
      <div 
        onClick={handleJobClick}
        className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-sm" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{job.title}</h3>
          <ExternalLink size={16} className="text-blue-600 ml-2 flex-shrink-0" />
        </div>
        
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <Building size={12} className="mr-1 text-gray-400" />
            <span>{job.company}</span>
          </div>
          
          {job.location && (
            <div className="flex items-center">
              <MapPin size={12} className="mr-1 text-gray-400" />
              <span>{job.location}</span>
            </div>
          )}
          
          {job.salary && (
            <div className="flex items-center">
              <DollarSign size={12} className="mr-1 text-gray-400" />
              <span>{job.salary}</span>
            </div>
          )}
          
          {job.description && (
            <p className="text-gray-500 mt-2 text-xs" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
            </p>
          )}
        </div>
        
        <div className="mt-3">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 transition-colors">
            Xem chi tiết
            <ExternalLink size={12} className="ml-1" />
          </div>
        </div>
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to copy message to clipboard
  const copyMessage = async (text) => {
    try {
      // Remove markdown formatting for cleaner copy
      const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n/g, '\n');
      await navigator.clipboard.writeText(cleanText);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to clear chat history
  const clearChat = () => {
    setMessages([
      {
        text: `👋 **Chào bạn! Tôi là JobFinder AI Assistant**

🤖 Tôi được trang bị công nghệ AI Gemini để hỗ trợ bạn như một ChatGPT chuyên về việc làm!

🎯 **Tôi có thể giúp bạn:**
• 🔍 Tìm kiếm việc làm phù hợp từ database
• 📝 Tư vấn viết CV, thư xin việc
• 💼 Chuẩn bị phỏng vấn
• 🎓 Lời khuyên nghề nghiệp
• 💬 Trò chuyện về bất kỳ chủ đề nào!

✨ **Thử hỏi tôi:**
"Tìm việc IT tại Hà Nội"
"Cách viết CV ấn tượng"
"Làm sao để tự tin trong phỏng vấn"

🚀 Hãy bắt đầu cuộc trò chuyện nhé!`,
        sender: 'bot',
        type: 'text'
      }
    ]);
  };

  // Function to regenerate response
  const regenerateResponse = async (messageIndex) => {
    if (messageIndex > 0 && messages[messageIndex - 1]?.sender === 'user') {
      const userMessage = messages[messageIndex - 1].text;
      // Remove the bot response and user message, then re-ask
      const newMessages = messages.slice(0, messageIndex - 1);
      setMessages(newMessages);
      await fetchBotResponse(userMessage);
    }
  };

  // Enhanced response formatting function
  const enhanceResponse = (text, userInput) => {
    // Add emoji based on topic detection
    if (userInput.toLowerCase().includes('việc làm') || userInput.toLowerCase().includes('job')) {
      text = `💼 ${text}`;
    } else if (userInput.toLowerCase().includes('cv') || userInput.toLowerCase().includes('resume')) {
      text = `📝 ${text}`;
    } else if (userInput.toLowerCase().includes('phỏng vấn') || userInput.toLowerCase().includes('interview')) {
      text = `🎯 ${text}`;
    }

    // Ensure proper formatting
    text = text.replace(/\n\n/g, '\n\n');
    return text;
  };

  const renderMessage = (text) => {
    // Convert markdown-like formatting to HTML
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    return { __html: html };
  };

  const fetchBotResponse = async (userInput) => {
    setIsLoading(true);
    
    try {
      // Detect job search intent với keywords mở rộng và case-insensitive
      const jobKeywords = [
        // Vietnamese job keywords
        'tìm việc', 'việc làm', 'tuyển dụng', 'recruitment', 'career',
        'công việc', 'vị trí', 'position', 'opportunity', 'cơ hội', 'ứng tuyển',
        'tuyển', 'hiring', 'job', 'work', 'employment', 'employ',
        
        // Job roles and titles (case variations)
        'it', 'developer', 'engineer', 'programmer', 'coder', 'dev',
        'marketing', 'sales', 'hr', 'human resources', 'nhân sự',
        'lập trình', 'thiết kế', 'design', 'quản lý', 'manager', 'lead',
        'analyst', 'consultant', 'specialist', 'executive', 'director',
        'intern', 'fresher', 'junior', 'senior', 'principal',
        
        // Locations (Vietnamese)
        'hà nội', 'hanoi', 'hcm', 'ho chi minh', 'đà nẵng', 'da nang',
        'remote', 'online', 'work from home', 'wfh', 'làm từ xa',
        
        // Job types
        'part time', 'full time', 'contract', 'freelance', 'internship',
        'bán thời gian', 'toàn thời gian', 'thực tập',
        
        // Technologies and skills
        'react', 'angular', 'vue', 'javascript', 'typescript', 'js', 'ts',
        'python', 'java', 'c#', 'php', 'nodejs', 'node', 'express',
        'spring', 'django', 'laravel', 'mysql', 'mongodb', 'postgresql',
        'aws', 'azure', 'docker', 'kubernetes', 'devops', 'ci/cd',
        'html', 'css', 'sass', 'bootstrap', 'tailwind'
      ];
      
      // Normalize user input for better matching
      const normalizedInput = userInput.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove Vietnamese accents
      
      const isJobRelated = jobKeywords.some(keyword => {
        const normalizedKeyword = keyword.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return normalizedInput.includes(normalizedKeyword);
      });

      console.log("🔍 User input:", userInput);
      console.log("🔍 Normalized input:", normalizedInput);
      console.log("🎯 Is job related:", isJobRelated);
      
      if (isJobRelated) {
        try {
          console.log("📞 Calling job search API...");
          const response = await fetch('http://localhost:8080/api/chatbot/search-jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userInput })
          });
          
          console.log("📡 API Response status:", response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log("📊 API Response data:", data);
            const jobSearchResults = data.data;
            console.log("💼 Job results:", jobSearchResults);

            if (jobSearchResults && jobSearchResults.length > 0) {
              console.log("✅ Hiển thị job cards:", jobSearchResults.length, "jobs");
              
              // Chỉ hiển thị job cards dựa trên input của user
              setMessages(prev => [...prev, { 
                text: `🎯 **Tìm thấy ${jobSearchResults.length} công việc cho "${userInput}":**`, 
                sender: 'bot', 
                type: 'jobs',
                jobs: jobSearchResults.slice(0, 10) // Hiển thị tối đa 10 job
              }]);
              
              return; // Skip AI response khi có jobs
            } else {
              // Không tìm thấy jobs
              setMessages(prev => [...prev, { 
                text: `😔 **Không tìm thấy công việc cho "${userInput}"**\n\n💡 **Thử tìm với:**\n• IT, Developer, Marketing\n• React, Java, Python\n• Hà Nội, HCM, Remote`, 
                sender: 'bot', 
                type: 'text' 
              }]);
              return;
            }
          }
        } catch (err) {
          console.warn("Job search API not available:", err);
          setMessages(prev => [...prev, { 
            text: `❌ **Lỗi kết nối API**\n\nKhông thể tìm kiếm việc làm lúc này. Vui lòng thử lại sau!`, 
            sender: 'bot', 
            type: 'text' 
          }]);
          return;
        }
      }

      // Chỉ dùng AI cho câu hỏi không liên quan đến job
      const systemPrompt = `Bạn là trợ lý AI thân thiện. Trả lời ngắn gọn và hữu ích.`;

      const payload = {
        contents: [
          { role: 'model', parts: [{ text: systemPrompt }] },
          { role: 'user', parts: [{ text: userInput }] }
        ]
      };

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const model = process.env.REACT_APP_GEMINI_MODEL || 'gemini-1.5-flash';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Lỗi AI API');
      }

      const result = await response.json();
      const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa hiểu yêu cầu của bạn.";
      
      setMessages(prev => [...prev, { text: reply, sender: 'bot', type: 'text' }]);
      
    } catch (err) {
      console.error("Lỗi:", err);
      setMessages(prev => [
        ...prev,
        { text: `❌ **Có lỗi xảy ra!**\n\nVui lòng thử lại sau.`, sender: 'bot', type: 'text' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user', type: 'text' }]);
    setInputValue('');

    await fetchBotResponse(userMessage);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <img src={ChatbotIcon} alt="Chat" className="w-8 h-8" />
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
            <div className="flex items-center">
              <Bot size={24} className="mr-2" />
              <div>
                <h3 className="font-bold">JobFinder AI Assistant</h3>
                <p className="text-xs opacity-90">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="hover:bg-blue-700 p-1 rounded-full transition-colors"
                title="Xóa cuộc trò chuyện"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
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
                    {msg.sender === 'bot' ? (
                      <div>
                        {/* Hiển thị text message */}
                        {msg.type === 'text' && (
                          <div dangerouslySetInnerHTML={renderMessage(msg.text)} />
                        )}
                        
                        {/* Hiển thị job cards */}
                        {msg.type === 'jobs' && (
                          <div>
                            <div dangerouslySetInnerHTML={renderMessage(msg.text)} />
                            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                              {msg.jobs.map((job, jobIndex) => (
                                <JobCard key={jobIndex} job={job} />
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              ✨ Click vào "Xem chi tiết" để ứng tuyển ngay!
                            </div>
                          </div>
                        )}
                        
                        {/* Buttons for bot messages */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => copyMessage(msg.text)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 text-xs text-gray-500"
                            title="Sao chép"
                          >
                            <Copy size={12} />
                            {showCopySuccess && <span className="text-green-600">Đã sao chép!</span>}
                          </button>
                          <button
                            onClick={() => regenerateResponse(i)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 text-xs text-gray-500"
                            title="Tạo lại phản hồi"
                          >
                            <RefreshCw size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                    <Bot size={20} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">AI đang suy nghĩ...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
