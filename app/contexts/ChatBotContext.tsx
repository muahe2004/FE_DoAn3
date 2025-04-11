// src/contexts/ChatBotContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


type ChatBotContextType = {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export function ChatBotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <ChatBotContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
    </ChatBotContext.Provider>
  );
}

export function useChatBot() {
  const context = useContext(ChatBotContext);
  if (!context) throw new Error("useChatBot must be used inside ChatBotProvider");
  return context;
}
