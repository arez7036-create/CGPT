import { useEffect, useRef, useState, useCallback } from "react";
import { Conversation, Message as MessageType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, truncate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, ArrowDown, Check, Edit, RefreshCw, Trash2, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useChat } from "@/context/ChatContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageListProps {
  conversation: Conversation;
  className?: string;
}

export function MessageList({ conversation, className }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isStreaming } = useChat();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
    setIsAtBottom(true);
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    const scrollElement = container.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setShowScrollButton(!isBottom);
      setIsAtBottom(isBottom);
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation.messages.length, isAtBottom]);

  useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    const scrollElement = container.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="relative h-full" ref={scrollAreaRef}>
      <ScrollArea className={cn("h-full custom-scrollbar", className)}>
        <div className="flex flex-col px-4 pt-6 pb-24">
          {conversation.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isStreaming && (
            <div className="flex items-start gap-4 px-2 py-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src="/cgpt-logo.svg" alt="CGPT" />
                <AvatarFallback className="bg-primary text-primary-foreground">CG</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-[#2d2d2d] rounded-2xl px-4 py-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">CGPT is thinking</span>
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </ScrollArea>

      {showScrollButton && (
        <Button
          className="absolute bottom-6 right-4 rounded-full shadow-lg w-9 h-9 z-10"
          size="icon"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

interface MessageProps {
  message: MessageType;
}

function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex w-full items-start gap-4 px-2 py-3 group",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/cgpt-logo.svg" alt="CGPT" />
          <AvatarFallback className="bg-primary text-primary-foreground">CG</AvatarFallback>
        </Avatar>
      )}

      <div className="relative max-w-[80%] space-y-2">
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gray-100 text-gray-900 dark:bg-[#2d2d2d] dark:text-gray-100"
        )}>
          <MarkdownRenderer content={message.content || ''} />
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <time className="text-xs text-muted-foreground">
            {formatDate(message.createdAt)}
          </time>
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 opacity-70 hover:opacity-100"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/user-avatar.png" alt="You" />
          <AvatarFallback className="bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
            You
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
