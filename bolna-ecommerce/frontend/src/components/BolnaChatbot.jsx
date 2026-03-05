import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, PhoneCall } from 'lucide-react';

export default function BolnaChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Bolna AI, your customer care assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const newUserMsg = { id: Date.now(), text: inputMessage, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate Bolna AI response
        setTimeout(() => {
            setIsTyping(false);
            const botResponse = {
                id: Date.now() + 1,
                text: "Thanks for reaching out! I'm an AI assistant. To connect this to your Bolna agent, you'll need to configure your Bolna API credentials in the backend and route these messages to the Bolna API.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center animate-bounce focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Bolna AI Assistant</h3>
                                <p className="text-xs text-indigo-200">Customer Care</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="text-indigo-200 hover:text-white transition-colors" title="Call Support">
                                <PhoneCall size={18} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-indigo-200 hover:text-white transition-colors ml-2"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-indigo-100 ml-2' : 'bg-white shadow-sm border border-gray-100 mr-2'}`}>
                                        {message.sender === 'user' ? (
                                            <User size={14} className="text-indigo-600" />
                                        ) : (
                                            <Bot size={14} className="text-indigo-600" />
                                        )}
                                    </div>
                                    <div
                                        className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${message.sender === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex flex-row max-w-[80%]">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white shadow-sm border border-gray-100 mr-2 flex items-center justify-center">
                                        <Bot size={14} className="text-indigo-600" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 rounded-tl-none flex space-x-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className={`p-2 rounded-full flex items-center justify-center transition-colors ${inputMessage.trim() && !isTyping ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'
                                    }`}
                            >
                                <Send size={18} className={inputMessage.trim() && !isTyping ? "translate-x-0.5" : ""} />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-gray-400 font-medium">Powered by Bolna AI</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
