import React, {useEffect, useRef, useState} from 'react';

import ChatMessageContent from './ChatMessageContent';
import {useAskAi} from './AskAiProvider';
import type {AskAiDomain} from './types';
import styles from './AskAi.module.css';

const DOMAIN_OPTIONS: {
  id: AskAiDomain;
  label: string;
  sublabel: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'software',
    label: 'Software',
    sublabel: 'LXMASTER',
    description: 'CLI, C++ API, tutorials, installation, diagnostics',
    icon: '💻',
  },
  {
    id: 'hardware',
    label: 'Hardware',
    sublabel: 'EtherCAT Modules',
    description: 'LXDIO33-16, LXFIBER, LXRJ45, wiring, PCB integration',
    icon: '🔌',
  },
];

const DOMAIN_SUBTITLE: Record<AskAiDomain, string> = {
  software: 'LXMASTER software — CLI, C++ API, tutorials',
  hardware: 'EtherCAT PCB modules — LXDIO33-16, LXFIBER, LXRJ45',
};

const DOMAIN_EMPTY_STATE: Record<AskAiDomain, string> = {
  software:
    'Ask about installing LXMASTER, the C++ API, CLI commands, EtherCAT tutorials, or troubleshooting your setup.',
  hardware:
    'Ask about the LXDIO33-16, LXFIBER, or LXRJ45 modules — specifications, wiring, PCB integration, or EtherCAT basics.',
};

function DomainPicker() {
  const {setDomain} = useAskAi();

  return (
    <div className={styles.picker}>
      <div className={styles.pickerHeading}>
        <p className={styles.pickerPrompt}>What kind of question do you have?</p>
        <p className={styles.pickerSubtext}>Choose a topic to get a focused answer from the right knowledge base.</p>
      </div>
      <div className={styles.pickerOptions}>
        {DOMAIN_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={styles.pickerOption}
            onClick={() => setDomain(opt.id)}
          >
            <span className={styles.pickerIcon}>{opt.icon}</span>
            <span className={styles.pickerOptionText}>
              <span className={styles.pickerOptionLabel}>{opt.label}</span>
              <span className={styles.pickerOptionSublabel}>{opt.sublabel}</span>
              <span className={styles.pickerOptionDesc}>{opt.description}</span>
            </span>
            <span className={styles.pickerArrow}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className={styles.messageAssistant}>
      <span className={styles.messageLabel}>Assistant</span>
      <span className={styles.thinkingDots}>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

export default function AskAiPanel() {
  const {isOpen, close, domain, resetDomain, messages, isLoading, error, sendMessage, clearError} =
    useAskAi();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && domain) {
      inputRef.current?.focus();
    }
  }, [isOpen, domain]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages, isLoading, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit() {
    const value = input.trim();
    if (!value) return;
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
        {/* Header */}
        <header className={styles.panelHeader}>
          <div>
            <h2 id="ask-ai-title" className={styles.panelTitle}>
              Ask AI
            </h2>
            <p className={styles.panelSubtitle}>
              {domain ? DOMAIN_SUBTITLE[domain] : 'Lynx Technologies documentation assistant'}
            </p>
          </div>
          <div className={styles.panelHeaderActions}>
            {domain ? (
              <button
                type="button"
                className={styles.switchButton}
                onClick={resetDomain}
                title="Switch topic"
              >
                ← Switch topic
              </button>
            ) : null}
            <button
              type="button"
              className={styles.closeButton}
              onClick={close}
              aria-label="Close Ask AI"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Domain picker or chat */}
        {domain === null ? (
          <DomainPicker />
        ) : (
          <>
            <div className={styles.messages}>
              {messages.length === 0 ? (
                <p className={styles.emptyState}>{DOMAIN_EMPTY_STATE[domain]}</p>
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
                  {message.role === 'assistant' ? (
                    <ChatMessageContent content={message.content} />
                  ) : (
                    <p className={styles.messageBody}>{message.content}</p>
                  )}
                </div>
              ))}

              {isLoading ? <ThinkingIndicator /> : null}

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
                rows={2}
                disabled={isLoading}
              />
              <div className={styles.composerRow}>
                <span className={styles.composerHint}>Enter to send · Shift+Enter for new line</span>
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={isLoading || !input.trim()}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
