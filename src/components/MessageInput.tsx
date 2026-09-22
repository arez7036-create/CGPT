import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/context/ChatContext";
import { sendChatRequest } from "@/services/apiService";
import { streamChatResponse } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SendHorizontal, Square } from "lucide-react";
import { ChatResponse } from "@/types";
import { generateId } from "@/lib/utils";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    addMessage,
    settings,
    conversations,
    currentConversationId,
    setConversations,
    isStreaming,
    startStreaming,
    stopStreaming
  } = useChat();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSubmitting || !currentConversationId) return;

    addMessage("user", message);

    setIsSubmitting(true);
    setMessage("");

    try {
      const messages = [];

      if (settings.systemPrompt && settings.systemPrompt.trim() !== '') {
        messages.push({ role: "system", content: settings.systemPrompt });
      }

      messages.push(
        ...(currentConversation?.messages.map(m => ({
          role: m.role,
          content: m.content
        })) || [])
      );

      messages.push({ role: "user", content: message });

      const chatRequest = {
        messages,
        model: settings.model,
        temperature: settings.temperature,
        stream: settings.streamEnabled
      };

      const response = await sendChatRequest(settings.provider, chatRequest);

      if (settings.streamEnabled && response instanceof ReadableStream) {
        let responseContent = '';

        const assistantMessage = {
          id: generateId(),
          role: 'assistant' as const,
          content: '',
          createdAt: new Date(),
          tokenCount: 0
        };

        setConversations(prev =>
          prev.map(conv =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, assistantMessage],
                  updatedAt: new Date()
                }
              : conv
          )
        );

        const controller = startStreaming();

        try {
          const stream = streamChatResponse(response);

          for await (const chunk of stream) {
            if (controller.signal.aborted) {
              break;
            }

            responseContent += chunk;

            setConversations(prev =>
              prev.map(conv =>
                conv.id === currentConversationId
                  ? {
                      ...conv,
                      messages: conv.messages.map(msg =>
                        msg.id === assistantMessage.id
                          ? {
                              ...msg,
                              content: responseContent,
                              tokenCount: responseContent.trim().split(/\s+/).length
                            }
                          : msg
                      ),
                      updatedAt: new Date()
                    }
                  : conv
              )
            );
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            throw error;
          }
          console.log('Streaming was cancelled by user');
        }
      } else if (!settings.streamEnabled && !(response instanceof ReadableStream)) {
        const nonStreamResponse = response as ChatResponse;
        const responseContent = nonStreamResponse.choices[0]?.message?.content || "No response from AI";
        addMessage("assistant", responseContent);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      addMessage("assistant", "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsSubmitting(false);
      stopStreaming();
    }
  };

  return (
    <div className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto p-3">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          placeholder="Type a message..."
          className="min-h-[50px] max-h-[200px] resize-none border-0 bg-gray-100 dark:bg-[#374151] focus-visible:ring-0 focus-visible:ring-offset-0 pr-16 rounded-2xl"
          disabled={isSubmitting}
          rows={1}
          autoFocus
        />
          <div className="absolute right-2 top-2 flex items-center space-x-2">
            {isSubmitting && isStreaming ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full"
                onClick={stopStreaming}
              >
                <Square className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full"
                disabled={isSubmitting || !message.trim()}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
