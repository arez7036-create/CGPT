import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { SidebarConversations } from "@/components/SidebarConversations";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { conversations, currentConversationId, selectConversation, createNewConversation, settings } = useChat();
  const { conversationId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        mainContentRef.current &&
        mainContentRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      const conversationExists = conversations.find(c => c.id === conversationId);
      if (conversationExists) {
        selectConversation(conversationId);
      }
    }
  }, [conversationId, currentConversationId, selectConversation]);

  useEffect(() => {
    if (currentConversationId && (!conversationId || currentConversationId !== conversationId)) {
      navigate(`/chat/${currentConversationId}`, { replace: true });
    }
  }, [currentConversationId, conversationId, navigate]);

  useEffect(() => {
    if (!conversationId && !currentConversationId && conversations.length === 0) {
      const timer = setTimeout(() => {
        createNewConversation();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [conversations.length, conversationId, currentConversationId, createNewConversation]);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  if (!currentConversation) {
    return (
      <div className="flex flex-col h-screen">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-lg text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <aside
          ref={sidebarRef}
          className={cn(
            "bg-secondary/30 w-64 flex-shrink-0 border-r transition-all duration-300 ease-in-out overflow-hidden",
            isMobile && "absolute inset-y-0 left-0 z-20 h-[calc(100%-4rem)] mt-16",
            !sidebarOpen && (isMobile ? "-translate-x-full" : "w-0 opacity-0")
          )}
        >
          {sidebarOpen && (
            <div className="w-64 h-full transition-all duration-300">
              <SidebarConversations />
            </div>
          )}
        </aside>

        <main
          ref={mainContentRef}
          className="flex-1 flex flex-col overflow-hidden relative"
        >
          {!sidebarOpen && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10 h-8 w-8"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          )}

          <div className="flex-1 overflow-hidden">
            <MessageList conversation={currentConversation} />
          </div>

          <MessageInput />
        </main>
      </div>
    </div>
  );
}
