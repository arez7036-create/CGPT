import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { Bot, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const { createNewConversation, settings } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const startNewChat = () => {
    createNewConversation();
    navigate(`/chat`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-semibold mb-3">CGPT</h1>

          <p className="text-gray-500 dark:text-gray-400 mb-8">
            A powerful AI assistant built on Llama 3.2
          </p>

          <Button size="lg" onClick={startNewChat} className="gap-2">
            Start chatting <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>CGPT - Local AI Chat</p>
      </footer>
    </div>
  );
}
