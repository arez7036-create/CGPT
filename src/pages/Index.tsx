import { useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { Bot, ArrowRight, MessageCircle, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate, truncate } from "@/lib/utils";

export default function Index() {
  const { createNewConversation, selectConversation, settings, conversations, deleteConversation } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const startNewChat = () => {
    createNewConversation();
    navigate(`/chat`);
  };

  const suggestionPrompts = [
    "Explain quantum computing like I'm 5",
    "Write a poem about the ocean",
    "What are the latest developments in AI?",
    "Help me plan a 7-day trip to Japan",
  ];

  const recentConversations = useMemo(() => {
    return [...conversations]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  }, [conversations]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          {conversations.length === 0 ? (
            <div className="text-center">
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

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestionPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="text-left h-auto py-3 px-4 justify-start"
                    onClick={() => {
                      startNewChat();
                      setTimeout(() => {
                        const textarea = document.querySelector('textarea');
                        if (textarea) {
                          textarea.value = prompt;
                          textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                      }, 300);
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">New Chat</h1>
                <Button size="lg" onClick={startNewChat} className="gap-2">
                  New conversation <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Recent conversations
                </h2>
                <div className="space-y-2">
                  {recentConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
                      onClick={() => {
                        selectConversation(conv.id);
                        navigate(`/chat/${conv.id}`);
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {truncate(conv.title, 50)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {conv.messages.length > 1
                              ? truncate(conv.messages[conv.messages.length - 1].content || '', 60)
                              : 'No messages yet'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatDate(conv.updatedAt)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Or try a suggestion
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestionPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      className="text-left h-auto py-3 px-4 justify-start"
                      onClick={() => {
                        startNewChat();
                        setTimeout(() => {
                          const textarea = document.querySelector('textarea');
                          if (textarea) {
                            textarea.value = prompt;
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                          }
                        }, 300);
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>CGPT - Local AI Chat</p>
      </footer>
    </div>
  );
}
