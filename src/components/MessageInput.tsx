import { useState, FormEvent, useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Square, Paperclip } from "lucide-react";
import { AudioRecordButton } from "@/components/AudioRecordButton";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, isStreaming, stopStreaming } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isLoading } = useChat();

  const inputDisabled = isLoading || isStreaming;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || inputDisabled || isStreaming) return;

    setMessage("");
    await sendMessage(message);
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
            placeholder={inputDisabled ? "Processing..." : "Type a message..."}
            className="min-h-[50px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-28 rounded-2xl"
            disabled={inputDisabled || isStreaming}
            rows={1}
            autoFocus
          />
          <div className="absolute right-2 top-2 flex items-center space-x-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full"
              disabled={inputDisabled || isStreaming}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <AudioRecordButton className="h-7 w-7 rounded-full" />
            {isStreaming ? (
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
                disabled={inputDisabled || isStreaming || !message.trim()}
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
