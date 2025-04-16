
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  createChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load chats from local storage
  useEffect(() => {
    if (user) {
      const storedChats = localStorage.getItem(`chatbpt_chats_${user.id}`);
      if (storedChats) {
        try {
          const parsedChats = JSON.parse(storedChats);
          // Convert string dates back to Date objects
          const formattedChats = parsedChats.map((chat: any) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setChats(formattedChats);
          
          // Set current chat to the most recent one if it exists
          if (formattedChats.length > 0) {
            setCurrentChat(formattedChats[0]);
          }
        } catch (error) {
          console.error('Failed to parse stored chats:', error);
        }
      }
    } else {
      // Clear chats when user logs out
      setChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  // Save chats to local storage whenever they change
  useEffect(() => {
    if (user && chats.length > 0) {
      localStorage.setItem(`chatbpt_chats_${user.id}`, JSON.stringify(chats));
    }
  }, [chats, user]);

  const createChat = () => {
    if (!user) return;
    
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim() || !currentChat) {
      if (!currentChat) {
        createChat();
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date()
      };
      
      // Update current chat with user message
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        updatedAt: new Date()
      };
      
      // Update chat in chats array
      setChats(prevChats => {
        const otherChats = prevChats.filter(chat => chat.id !== currentChat.id);
        return [updatedChat, ...otherChats];
      });
      
      setCurrentChat(updatedChat);
      
      // Simulate API call to ChatGPT
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response
      let aiResponse = "I'm the ChatBPT AI assistant. This is a simulated response since we're not connecting to a real AI API yet. In a production environment, this would be an actual response from the OpenAI API or similar service.";
      
      // Update with AI response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      // Update title if this is the first message
      let chatTitle = updatedChat.title;
      if (updatedChat.messages.length <= 1) {
        // Use first few words of user message as title
        chatTitle = content.split(' ').slice(0, 3).join(' ') + '...';
      }
      
      // Update chat with AI response
      const finalChat = {
        ...updatedChat,
        title: chatTitle,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: new Date()
      };
      
      // Update in chats array
      setChats(prevChats => {
        const otherChats = prevChats.filter(chat => chat.id !== currentChat.id);
        return [finalChat, ...otherChats];
      });
      
      setCurrentChat(finalChat);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      
      // If the deleted chat was the current one, set a new current chat
      if (currentChat && currentChat.id === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChat(updatedChats[0]);
        } else {
          setCurrentChat(null);
        }
      }
      
      return updatedChats;
    });
    
    toast({
      title: "Chat deleted",
      description: "The chat has been removed."
    });
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      isLoading,
      createChat,
      selectChat,
      sendMessage,
      deleteChat
    }}>
      {children}
    </ChatContext.Provider>
  );
}
