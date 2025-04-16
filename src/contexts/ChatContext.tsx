import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { loadConfig } from '@/utils/config';
import { fetchWithCredentials } from '@/utils/api'; // Import from utils

// Define structure for message from backend (might differ slightly, e.g., _id)
interface BackendMessage {
    _id: string; // Assuming backend uses _id
    content: string;
    role: 'user' | 'assistant';
    timestamp: string; // Backend typically sends dates as ISO strings
}

// Define structure for chat from backend
interface BackendChat {
    _id: string;
    user: string; // User ID reference
    title: string;
    messages: BackendMessage[];
    createdAt: string;
    updatedAt: string;
}

// Frontend Message interface (can keep using Date objects)
export interface Message {
  id: string; // Keep using frontend ID if needed for keys, map from _id
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Frontend Chat interface
export interface Chat {
  id: string; // Map from _id
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper to convert backend chat to frontend chat format
const mapBackendChatToFrontend = (backendChat: BackendChat): Chat => ({
    id: backendChat._id,
    title: backendChat.title,
    messages: backendChat.messages.map(msg => ({
        id: msg._id, // Use backend message ID
        content: msg.content,
        role: msg.role,
        timestamp: new Date(msg.timestamp)
    })),
    createdAt: new Date(backendChat.createdAt),
    updatedAt: new Date(backendChat.updatedAt)
});

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean; // Combined loading state (fetching chats, sending messages)
  isLoadingChats: boolean; // Specific state for loading initial chats
  createChat: () => Promise<void>; // Make async
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>; // Make async
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
  const [isLoading, setIsLoading] = useState(false); // For sending messages
  const [isLoadingChats, setIsLoadingChats] = useState(true); // For initial load
  const { toast } = useToast();
  const { user } = useAuth(); // Get user from AuthContext

  // Load chats from backend when user logs in
  useEffect(() => {
    const loadChats = async () => {
      if (user) {
        setIsLoadingChats(true);
        try {
          const backendChats: BackendChat[] = await fetchWithCredentials('/api/chats');
          const frontendChats = backendChats.map(mapBackendChatToFrontend);
          setChats(frontendChats);
          // Set current chat to the most recent one if it exists
          if (frontendChats.length > 0) {
            // Ensure sorting is correct based on updatedAt (backend already sorts)
            setCurrentChat(frontendChats[0]); 
          } else {
            setCurrentChat(null);
          }
        } catch (error: any) {
          console.error('Failed to load chats:', error);
          toast({ title: "Error", description: `Failed to load chats: ${error.message}`, variant: "destructive" });
          setChats([]); // Clear chats on error
          setCurrentChat(null);
        } finally {
          setIsLoadingChats(false);
        }
      } else {
        // Clear chats when user logs out
        setChats([]);
        setCurrentChat(null);
        setIsLoadingChats(false); // Not loading if no user
      }
    };

    loadChats();
  }, [user, toast]); // Depend on user

  // Remove useEffect that saves to localStorage
  // useEffect(() => { ... save to localStorage ... }, [chats, user]);

  const createChat = async () => {
    if (!user) return;
    
    // Consider adding a loading state for chat creation if needed
    try {
        const backendChat: BackendChat = await fetchWithCredentials('/api/chats', { method: 'POST' });
        const newChat = mapBackendChatToFrontend(backendChat);
        
        setChats(prevChats => [newChat, ...prevChats]);
        setCurrentChat(newChat);

    } catch (error: any) {
        console.error('Failed to create chat:', error);
        toast({ title: "Error", description: `Failed to create new chat: ${error.message}`, variant: "destructive" });
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim() || !currentChat) {
      // If no current chat, create one first
      if (!currentChat) {
          await createChat();
          // Need to wait for state update or get the new chat ID somehow
          // This part needs careful handling. Let's assume createChat sets currentChat immediately for now.
          // A better approach might be to get the new chat from createChat response and use it directly.
          // For simplicity, let's show a toast and return if currentChat isn't set after create
          if (!currentChat) { // Re-check after creation attempt
             toast({ title: "Info", description: "Please select or create a chat first.", variant: "default" });
             return;
          }
      }
      // If still no currentChat after trying to create, exit
      if (!currentChat) return;
    }

    if (!currentChat) {
        console.error("Cannot send message, current chat not available after creation attempt.");
        toast({ title: "Error", description: "Could not establish a chat session.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    const chatId = currentChat.id;
    const initialChatState = currentChat; // Store state before optimistic update

    // 1. Optimistic UI Update (User Message)
    const optimisticUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date()
    };
    setCurrentChat(prev => prev ? { ...prev, messages: [...prev.messages, optimisticUserMessage] } : null);
    setChats(prev => prev.map(chat => 
        chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, optimisticUserMessage] } 
            : chat
    ));

    try {
      // 2. Call Backend (which now handles user save -> AI call -> assistant save)
      const response = await fetchWithCredentials(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }), // Only send user content
      });
      
      // Destructure response from backend
      const { chat: finalBackendChat, limitExceeded, aiError } = response;
      
      if (!finalBackendChat) {
        throw new Error("Backend did not return final chat data.");
      }

      // Map the final chat state from backend
      const finalFrontendChat = mapBackendChatToFrontend(finalBackendChat);
      
      // 3. Update UI with final state from backend
      setCurrentChat(finalFrontendChat);
      setChats(prev => prev.map(chat => chat.id === chatId ? finalFrontendChat : chat));

      // 4. Handle AI Errors or Limit Exceeded flags from backend
      if (aiError) {
          console.error("AI Error reported by backend:", aiError);
          toast({ title: "AI Error", description: aiError, variant: "destructive" });
          // UI is already updated with the AI's error message saved by the backend
      }
      if (limitExceeded) {
          console.log("Message limit reached, reported by backend.");
          toast({ title: "Message Limit Reached", description: "You have reached your daily message limit. AI response was not generated/saved.", variant: "destructive" });
          // UI is already updated with the chat state *without* the assistant message
      }
      
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error Sending Message",
        description: error.message || "An unexpected error occurred.", 
        variant: "destructive"
      });
      // Revert optimistic update on error
      setCurrentChat(initialChatState); 
      setChats(prev => prev.map(chat => chat.id === chatId ? initialChatState : chat));
      
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    // Optimistic UI update (remove immediately)
    const previousChats = chats;
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (currentChat && currentChat.id === chatId) {
        setCurrentChat(chats.length > 1 ? chats.find(c => c.id !== chatId) || null : null);
    }

    try {
        await fetchWithCredentials(`/api/chats/${chatId}`, { method: 'DELETE' });
        toast({
            title: "Chat deleted",
            description: "The chat has been removed."
        });
        // If current chat was deleted, select the next available one (or null)
        if (currentChat && currentChat.id === chatId) {
            const remainingChats = previousChats.filter(chat => chat.id !== chatId);
            setCurrentChat(remainingChats.length > 0 ? remainingChats[0] : null);
        }
    } catch (error: any) {
        console.error('Failed to delete chat:', error);
        toast({ title: "Error", description: `Failed to delete chat: ${error.message}`, variant: "destructive" });
        // Revert optimistic update on error
        setChats(previousChats);
        // Maybe reset currentChat if it was optimistically changed
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      isLoading, // Combined loading state
      isLoadingChats, // Specific state for initial load
      createChat,
      selectChat,
      sendMessage,
      deleteChat
    }}>
      {children}
    </ChatContext.Provider>
  );
}
