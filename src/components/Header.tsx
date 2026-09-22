import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ModeToggle } from "./ModeToggle";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu } from "lucide-react";

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const { createNewConversation } = useChat();

  return (
    <header className={cn(
      "flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10",
      className
    )}>
      <div className="flex items-center space-x-2">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Logo size="sm" />
        <h1 className="text-lg font-semibold text-foreground/90">CGPT</h1>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex"
          onClick={() => createNewConversation()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New chat
        </Button>
        <ModeToggle />
        <SettingsDialog />
      </div>
    </header>
  );
}
