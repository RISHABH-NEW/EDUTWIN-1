import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Lightbulb, HelpCircle, Globe, MessageSquare } from 'lucide-react';
import aiService from '../services/aiService';

const quickActions = [
  { label: 'Explain Simply', icon: Lightbulb, mode: 'simple' },
  { label: 'Give Example', icon: BookOpen, mode: 'example' },
  { label: 'Quiz Me', icon: HelpCircle, mode: 'quiz' },
  { label: 'Explain in Hindi', icon: Globe, mode: 'hindi' },
  { label: 'Explain in Hinglish', icon: MessageSquare, mode: 'hinglish' },
];

const suggestedTopics = [
  'Explain recursion',
  'How does binary search work?',
  'What is dynamic programming?',
  'Explain sorting algorithms',
  'Help me with my weak areas',
];

function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
        ${isUser
          ? 'bg-primary-100 text-primary-700'
          : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
        }`}>
        {isUser ? <span className="text-xs font-bold">PS</span> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-primary-600 text-white rounded-tr-md'
            : 'bg-white border border-surface-200 text-surface-700 rounded-tl-md shadow-sm'
          }`}>
          {message}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello Priyanshu! 👋 I'm your EduTwin AI Tutor. I can help you with:\n\n• Explaining concepts in any subject\n• Solving problems step by step\n• Quizzing you on topics\n• Study planning and recommendations\n\nWhat would you like to learn today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastTopic, setLastTopic] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text: text.trim(), isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLastTopic(text.trim());
    setIsTyping(true);

    try {
      const response = await aiService.chat(text.trim(), messages);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, isUser: false }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an issue. Please try again!",
        isUser: false,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (mode) => {
    const topic = lastTopic || 'this topic';
    const actionLabels = {
      simple: `Explain "${topic}" simply`,
      example: `Give me an example of "${topic}"`,
      quiz: `Quiz me on "${topic}"`,
      hindi: `Explain "${topic}" in Hindi`,
      hinglish: `Explain "${topic}" in Hinglish`,
    };

    const userMsg = { id: Date.now(), text: actionLabels[mode], isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await aiService.generateExplanation(topic, mode);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, isUser: false }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an issue. Please try again!",
        isUser: false,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-surface-900">AI Tutor</h1>
          <p className="text-xs text-surface-400">Powered by EduTwin AI · Always here to help</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-surface-400">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-surface-50/50 rounded-2xl border border-surface-200/60 p-4 space-y-4 mb-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />

        {/* Suggested topics (only show when no messages sent yet) */}
        {messages.length === 1 && (
          <div className="mt-4">
            <p className="text-xs text-surface-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => sendMessage(topic)}
                  className="px-3 py-1.5 bg-white border border-surface-200 rounded-full text-xs
                    text-surface-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700
                    transition-all duration-200"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.mode)}
              disabled={isTyping}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-surface-200
                rounded-full text-xs font-medium text-surface-600 whitespace-nowrap
                hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700
                transition-all duration-200 disabled:opacity-50"
            >
              <Icon className="w-3 h-3" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI tutor anything..."
            rows={1}
            className="input-field resize-none py-3 pr-12"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="btn-primary p-3 rounded-xl disabled:opacity-40 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
