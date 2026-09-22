import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, Message, Settings, Provider, Template, ChatResponse } from '@/types';
import { generateId, getDefaultSettings } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { sendChatRequest } from "@/services/apiService";
import { streamChatResponse } from "@/lib/utils";
import { countTokens } from '@/lib/tokenizer';
import * as dbService from '@/services/api/database';

type ChatContextType = {
  conversations: Conversation[];
  currentConversationId: string | null;
  settings: Settings;
  isLoading: boolean;
  isStreaming: boolean;
  isInputDisabled: boolean;
  streamController: AbortController | null;
   setSettings: (settings: Settings) => void;
   updateSettings: (settings: Partial<Settings>) => void;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  createNewConversation: (initialMessage?: string) => Promise<string>;
  selectConversation: (id: string) => void;
  addMessage: (message: Partial<Message>, conversationId?: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, newTitle: string) => void;
  clearConversations: () => Promise<void>;
  startStreaming: () => AbortController;
  stopStreaming: () => void;
   sendMessage: (content: string, contextMessages?: Message[], editedMessageIndex?: number, returnResponse?: boolean) => Promise<{ content: string } | void>;
   toggleTheme: () => void;
   updateTheme: (template: Template, darkMode: boolean) => void;
 };

const ChatContext = createContext<ChatContextType>({
  conversations: [],
  currentConversationId: null,
  settings: getDefaultSettings(),
  isLoading: false,
  isStreaming: false,
  isInputDisabled: false,
  streamController: null,
  setSettings: () => {},
  updateSettings: () => {},
  setConversations: () => {},
  createNewConversation: async () => '',
  selectConversation: () => {},
  addMessage: async () => {},
  deleteConversation: async () => {},
  renameConversation: () => {},
  clearConversations: async () => {},
  startStreaming: () => new AbortController(),
  stopStreaming: () => {},
  sendMessage: async () => {},
  toggleTheme: () => {},
  updateTheme: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [streamController, setStreamController] = useState<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const serverConversations = await dbService.getConversations();
        if (serverConversations.length > 0) {
          const formattedConversations = serverConversations.map((conv: Conversation) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: Message) => ({
              ...msg,
              createdAt: new Date(msg.createdAt)
            }))
          }));
          setConversations(formattedConversations);
          setCurrentConversationId(formattedConversations[0].id);
        } else {
          await createNewConversation();
        }
      } catch (error) {
        console.error('Error loading conversations from server:', error);
        const savedConversations = localStorage.getItem('conversations');
        if (savedConversations) {
          try {
            const parsed = JSON.parse(savedConversations);
            const formattedConversations = parsed.map((conv: Record<string, unknown>) => ({
              ...conv,
              createdAt: new Date(conv.createdAt as string),
              updatedAt: new Date(conv.updatedAt as string),
              messages: (conv.messages as Array<Record<string, unknown>>).map((msg) => ({
                ...msg,
                createdAt: new Date(msg.createdAt as string)
              }))
            }));
            setConversations(formattedConversations);
            if (formattedConversations.length > 0) {
              setCurrentConversationId(formattedConversations[0].id);
            }
          } catch (parseError) {
            console.error('Error parsing saved conversations:', parseError);
            await createNewConversation();
          }
        } else {
          await createNewConversation();
        }
      }
    };
    loadConversations();

    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...getDefaultSettings(), ...prev, ...parsedSettings }));
        if (parsedSettings.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Error parsing saved settings:', error);
        setSettings(getDefaultSettings());
      }
    } else {
      setSettings(getDefaultSettings());
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const createNewConversation = useCallback(async (initialMessage?: string) => {
    const firstMessage = {
      id: generateId(),
      role: 'assistant' as const,
      content: "Hello! I'm CGPT, your AI assistant. How can I help you today?",
      createdAt: new Date()
    };

    const newConversation = await dbService.createConversation(
      'New Chat',
      false,
      firstMessage
    );

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const addMessage = useCallback(async (message: Partial<Message>, conversationId?: string) => {
    const convId = conversationId || currentConversationId;
    if (!convId) return;

    const fullMessage: Message = {
      id: generateId(),
      role: message.role as 'user' | 'assistant' | 'system',
      content: message.content || '',
      createdAt: new Date(),
      tokenCount: message.content ? countTokens(message.content) : 0,
    };

    const savedMessage = await dbService.addMessage(convId, fullMessage);

    setConversations(prev =>
      prev.map(conv =>
        conv.id === convId
          ? {
              ...conv,
              messages: [...conv.messages, savedMessage],
              updatedAt: new Date(),
              title: conv.title === 'New Chat' && savedMessage.role === 'user'
                ? savedMessage.content?.slice(0, 30) + (savedMessage.content && savedMessage.content.length > 30 ? '...' : '')
                : conv.title
            }
          : conv
      )
    );
  }, [currentConversationId]);

  const deleteConversation = useCallback(async (id: string) => {
    await dbService.deleteConversation(id);
    setConversations(prev => prev.filter(conv => conv.id !== id));

    if (currentConversationId === id) {
      if (conversations.length > 1) {
        const nextConv = conversations.find(conv => conv.id !== id);
        if (nextConv) {
          setCurrentConversationId(nextConv.id);
        } else {
          await createNewConversation();
        }
      } else {
        await createNewConversation();
      }
    }

    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed",
    });
  }, [conversations, currentConversationId, createNewConversation, toast]);

  const clearConversations = useCallback(async () => {
    await dbService.deleteAllConversations();
    setConversations([]);
    await createNewConversation();

    toast({
      title: "All conversations cleared",
      description: "A new conversation has been created",
    });
  }, [createNewConversation, toast]);

  const renameConversation = useCallback((id: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, title: newTitle } : conv
      )
    );
  }, []);

  const startStreaming = useCallback(() => {
    const controller = new AbortController();
    setStreamController(controller);
    setIsStreaming(true);
    return controller;
  }, []);

  const stopStreaming = useCallback(() => {
    if (streamController) {
      streamController.abort();
      setStreamController(null);
    }
    setIsStreaming(false);
  }, [streamController]);

  const sendMessage = useCallback(async (
    content: string,
    contextMessages?: Message[],
    editedMessageIndex?: number,
    returnResponse?: boolean
  ): Promise<{ content: string } | void> => {
    let convId = currentConversationId;
    if (!convId) {
      convId = await createNewConversation();
      setCurrentConversationId(convId);
    }

    setIsLoading(true);

    try {
      if (editedMessageIndex !== undefined) {
        setConversations(prev =>
          prev.map(conv => {
            if (conv.id === convId) {
              const messagesBeforeEdit = conv.messages.slice(0, editedMessageIndex);
              const originalMessage = conv.messages[editedMessageIndex];
              const updatedMessage = {
                ...originalMessage,
                content: content,
                createdAt: new Date()
              };
              return {
                ...conv,
                messages: [...messagesBeforeEdit, updatedMessage],
                updatedAt: new Date(),
              };
            }
            return conv;
          })
        );
      } else {
        await addMessage({ role: "user", content }, convId);
      }

      const messages = [];

      if (settings.systemPrompt && settings.systemPrompt.trim() !== '') {
        messages.push({ role: "system", content: settings.systemPrompt });
      }

      const currentConversation = conversations.find(conv => conv.id === convId);
      let messagesToSend: Message[] = [];

      if (currentConversation) {
        if (editedMessageIndex !== undefined) {
          messagesToSend = currentConversation.messages.slice(0, editedMessageIndex);
        } else {
          messagesToSend = currentConversation.messages;
        }

        const historyLimit = settings.contextWindowSize * 2;
        if (messagesToSend.length > historyLimit) {
          const startIndex = Math.max(0, messagesToSend.length - historyLimit);
          messagesToSend = messagesToSend.slice(startIndex);
        }
      }

      messages.push(
        ...messagesToSend
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: m.content }))
      );

      messages.push({ role: "user", content });

      const chatRequest = {
        messages,
        model: settings.model,
        temperature: settings.temperature,
        stream: settings.streamEnabled
      };

      if (returnResponse) {
        const response = await sendChatRequest(settings.provider, { ...chatRequest, stream: false });

        if (response instanceof ReadableStream) {
          throw new Error("Streaming not supported when returnResponse is true");
        }

        const responseContent = (response as ChatResponse).choices[0]?.message?.content || "No response from AI";
        return { content: responseContent };
      }

      const provider = settings.provider;
      const response = await sendChatRequest(provider, chatRequest);

      if (settings.streamEnabled && response instanceof ReadableStream) {
        let responseContent = '';

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          tokenCount: 0
        };

         setConversations(prev =>
           prev.map(conv =>
             conv.id === convId
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

            const words = responseContent
              .trim()
              .split(/\s+|[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/)
              .filter(word => word.length > 0);

             setConversations(prev =>
               prev.map(conv =>
                 conv.id === convId
                   ? {
                       ...conv,
                       messages: conv.messages.map(msg =>
                         msg.id === assistantMessage.id
                           ? {
                               ...msg,
                               content: responseContent,
                               tokenCount: words.length
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
      } else {
        const nonStreamResponse = response as ChatResponse;
        const responseContent = nonStreamResponse.choices[0]?.message?.content || "No response from AI";

         setConversations(prev =>
           prev.map(conv =>
             conv.id === convId
               ? {
                   ...conv,
                   messages: [...conv.messages, {
                    id: generateId(),
                    role: 'assistant',
                    content: responseContent,
                    createdAt: new Date(),
                    tokenCount: countTokens(responseContent)
                  }],
                  updatedAt: new Date()
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });

      addMessage({ role: 'assistant', content: "Sorry, I encountered an error. Please try again." }, convId);
    } finally {
      setIsLoading(false);
      stopStreaming();
    }
  }, [currentConversationId, conversations, settings, addMessage, createNewConversation, toast, startStreaming, stopStreaming]);

  const toggleTheme = useCallback(() => {
    setSettings(prev => {
      const newDarkMode = !prev.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...prev, darkMode: newDarkMode };
    });
  }, []);

  const updateTheme = useCallback((template: Template, darkMode: boolean) => {
    setSettings(prev => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...prev, template, darkMode };
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const contextValue = useMemo(() => ({
    conversations,
    currentConversationId,
    settings,
    isLoading,
    isStreaming,
    isInputDisabled,
    streamController,
    setSettings,
    updateSettings,
    setConversations,
    createNewConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    clearConversations,
    startStreaming,
    stopStreaming,
    sendMessage,
    toggleTheme,
    updateTheme,
  }), [
    conversations,
    currentConversationId,
    settings,
    isLoading,
    isStreaming,
    isInputDisabled,
    streamController,
    setSettings,
    updateSettings,
    setConversations,
    createNewConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    clearConversations,
    startStreaming,
    stopStreaming,
    sendMessage,
    toggleTheme,
    updateTheme,
  ]);

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
