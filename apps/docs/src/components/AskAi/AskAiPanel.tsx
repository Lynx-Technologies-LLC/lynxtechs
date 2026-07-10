import React, {useEffect, useRef, useState} from 'react';

import {useAskAi} from './AskAiProvider';
import styles from './AskAi.module.css';

export default function AskAiPanel() {
  const {isOpen, close, messages, isLoading, error, sendMessage, clearError} =
    useAskAi();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages, isLoading, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit() {
    const value = input.trim();
    if (!value) {
      return;
    }

    setInput('');
    await sendMessage(value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={close}>
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-ai-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.panelHeader}>
          <div>
            <h2 id="ask-ai-title" className={styles.panelTitle}>
              Ask AI
            </h2>
            <p className={styles.panelSubtitle}>
              Questions about Lynx docs, LXMASTER, and EtherCAT modules
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={close}
            aria-label="Close Ask AI"
          >
            ×
          </button>
        </header>

        <div className={styles.messages}>
          {messages.length === 0 ? (
            <p className={styles.emptyState}>
              Ask about getting started with LXMASTER, hardware integration, EtherCAT
              basics, or troubleshooting.
            </p>
          ) : null}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === 'user'
                  ? styles.messageUser
                  : styles.messageAssistant
              }
            >
              <span className={styles.messageLabel}>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </span>
              <p className={styles.messageBody}>{message.content}</p>
            </div>
          ))}

          {isLoading ? (
            <div className={styles.messageAssistant}>
              <span className={styles.messageLabel}>Assistant</span>
              <p className={styles.messageBody}>Thinking…</p>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {error ? (
          <div className={styles.errorBanner}>
            <p>{error}</p>
            <button type="button" onClick={clearError}>
              Dismiss
            </button>
          </div>
        ) : null}

        <form
          className={styles.composer}
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <textarea
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}
