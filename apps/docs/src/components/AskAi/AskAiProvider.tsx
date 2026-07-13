import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {AskAiDomain, ChatMessage} from './types';

type AskAiContextValue = {
  isOpen: boolean;
  domain: AskAiDomain | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  setDomain: (domain: AskAiDomain) => void;
  resetDomain: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
};

const AskAiContext = createContext<AskAiContextValue | null>(null);

export function AskAiProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [domain, setDomainState] = useState<AskAiDomain | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const clearError = useCallback(() => setError(null), []);

  const setDomain = useCallback((d: AskAiDomain) => {
    setDomainState(d);
  }, []);

  // Reset to the domain picker, clearing the current conversation.
  const resetDomain = useCallback(() => {
    setDomainState(null);
    setMessages([]);
    setError(null);
  }, []);

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
        body: JSON.stringify({messages: nextMessages, domain: domain ?? 'software'}),
      });

      const raw = await response.text();
      let data: {message?: string; error?: string} = {};

      try {
        data = raw ? (JSON.parse(raw) as {message?: string; error?: string}) : {};
      } catch {
        if (response.status === 404) {
          throw new Error(
            'Ask AI API is unavailable in dev. Restart the dev server after adding ANTHROPIC_API_KEY=your-key to apps/docs/.env.local.',
          );
        }

        throw new Error('Failed to reach the assistant');
      }

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
  }, [domain, isLoading, messages]);

  const value = useMemo(
    () => ({
      isOpen,
      domain,
      messages,
      isLoading,
      error,
      open,
      close,
      setDomain,
      resetDomain,
      sendMessage,
      clearError,
    }),
    [clearError, close, domain, error, isLoading, isOpen, messages, open, resetDomain, sendMessage, setDomain],
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
