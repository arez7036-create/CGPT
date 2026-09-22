import { useCallback, useMemo, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatDate, truncate } from "@/lib/utils";
import { MessageCircle, PlusCircle, Trash2, Pencil, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SidebarConversations() {
  const {
    conversations,
    currentConversationId,
    createNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    clearConversations
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [conversations]);

  const handleConversationClick = useCallback((id: string) => {
    if (editingId !== id) {
      selectConversation(id);
    }
  }, [selectConversation, editingId]);

  const startEditing = useCallback((id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setNewTitle(currentTitle);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingId && newTitle.trim()) {
      renameConversation(editingId, newTitle.trim());
      setEditingId(null);
    }
  }, [editingId, newTitle, renameConversation]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(id);
  }, [deleteConversation]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Button
          onClick={() => createNewConversation()}
          className="w-full justify-start gap-2"
          variant="ghost"
        >
          <PlusCircle className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {sortedConversations.map((conversation) => (
            <div key={conversation.id} className="relative group">
              <Button
                variant={conversation.id === currentConversationId ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-normal transition-all",
                  "hover:bg-accent"
                )}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex items-center w-full gap-3 overflow-hidden">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <div className="overflow-hidden flex-1">
                    {editingId === conversation.id ? (
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="h-6 py-0 px-1 text-sm"
                      />
                    ) : (
                      <div className="truncate text-sm">{truncate(conversation.title, 25)}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {formatDate(conversation.updatedAt)}
                    </div>
                  </div>
                </div>
              </Button>

              {editingId === conversation.id ? (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={saveEdit}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-70 hover:opacity-100"
                    onClick={(e) => startEditing(conversation.id, conversation.title, e)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-70 hover:opacity-100 hover:text-destructive"
                    onClick={(e) => handleDelete(conversation.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Trash2 className="h-4 w-4" />
              Clear all chats
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all conversations?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your conversations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearConversations}>
                Delete all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
