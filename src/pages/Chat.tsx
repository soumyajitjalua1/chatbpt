
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Message } from '@/contexts/ChatContext';
import { Trash2, MessageSquare, PlusCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { 
    chats, 
    currentChat, 
    isLoading, 
    createChat, 
    selectChat, 
    sendMessage, 
    deleteChat 
  } = useChat();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, h:mm a');
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r overflow-y-auto hidden md:block">
          <div className="p-4">
            <Button 
              onClick={createChat} 
              className="w-full flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} />
              New Chat
            </Button>
            
            <div className="mt-6 space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm group flex items-center justify-between",
                    currentChat?.id === chat.id 
                      ? "bg-brand-purple text-white" 
                      : "hover:bg-gray-200"
                  )}
                >
                  <div className="flex items-center">
                    <MessageSquare 
                      size={16} 
                      className="mr-2 flex-shrink-0" 
                    />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                      currentChat?.id === chat.id ? "text-white" : "text-gray-500"
                    )}
                  >
                    <Trash2 size={14} />
                  </button>
                </button>
              ))}
              
              {chats.length === 0 && (
                <div className="text-gray-500 text-center py-4 text-sm">
                  No chats yet. Start a new conversation.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Message area */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentChat ? (
              <>
                {currentChat.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="mb-4">
                      <MessageSquare 
                        size={48} 
                        className="text-gray-300 mx-auto" 
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Start a new conversation</h3>
                    <p className="text-gray-500 max-w-md">
                      Ask a question or start typing to begin chatting with the ChatBPT AI assistant.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentChat.messages.map((message: Message) => (
                      <div 
                        key={message.id} 
                        className={cn(
                          "flex",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div 
                          className={cn(
                            "max-w-3xl rounded-xl p-4",
                            message.role === 'user' 
                              ? "bg-brand-purple text-white" 
                              : "bg-gray-100"
                          )}
                        >
                          <div className="prose prose-sm">
                            {message.content.split('\n').map((text, i) => (
                              <p key={i} className="mb-2 last:mb-0">{text}</p>
                            ))}
                          </div>
                          <div 
                            className={cn(
                              "text-xs mt-2",
                              message.role === 'user' ? "text-purple-200" : "text-gray-500"
                            )}
                          >
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-xl p-4 max-w-3xl">
                          <div className="flex space-x-2 items-center">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <h3 className="text-xl font-semibold mb-2">Welcome to ChatBPT</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Start a new chat to begin your conversation with the AI assistant.
                </p>
                <Button onClick={createChat}>
                  Start New Chat
                </Button>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading || !currentChat}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputValue.trim() || !currentChat}
              >
                <Send size={18} />
              </Button>
            </form>
            
            {user?.subscriptionTier === 'free' && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                Free tier: 10 messages per day limit. <a href="/account" className="text-brand-purple hover:underline">Upgrade to Premium</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
