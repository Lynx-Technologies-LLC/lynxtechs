import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {ChatMessage} from './types';

type AskAiContextValue = {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
};

const AskAiContext = createContext<AskAiContextValue | null>(null);

export function AskAiProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const clearError = useCallback(() => setError(null), []);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      {role: 'user', content: trimmed},
    ];

    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/docs-chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: nextMessages}),
      });

      const data = (await response.json()) as {message?: string; error?: string};

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to reach the assistant');
      }

      if (!data.message) {
        throw new Error('No response from the assistant');
      }

      setMessages((current) => [
        ...current,
        {role: 'assistant', content: data.message!},
      ]);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      isLoading,
      error,
      open,
      close,
      sendMessage,
      clearError,
    }),
    [clearError, close, error, isLoading, isOpen, messages, open, sendMessage],
  );

  return <AskAiContext.Provider value={value}>{children}</AskAiContext.Provider>;
}

export function useAskAi() {
  const context = useContext(AskAiContext);
  if (!context) {
    throw new Error('useAskAi must be used within AskAiProvider');
  }
  return context;
}
