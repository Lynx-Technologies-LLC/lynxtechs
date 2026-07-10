import React, {useMemo, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {Highlight, themes} from 'prism-react-renderer';
import remarkGfm from 'remark-gfm';
import type {Components} from 'react-markdown';

import styles from './AskAi.module.css';

function CodeBlock({language, code}: {language?: string; code: string}) {
  const [copied, setCopied] = useState(false);
  const prismLanguage = language === 'c' ? 'cpp' : language ?? 'text';

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLanguage}>{language ?? 'code'}</span>
        <button type="button" className={styles.copyButton} onClick={() => void handleCopy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Highlight
        theme={themes.dracula}
        code={code}
        language={prismLanguage as 'cpp'}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={`${className} ${styles.codePre}`} style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <div key={lineIndex} {...getLineProps({line})}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({token})} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default function ChatMessageContent({content}: {content: string}) {
  const components = useMemo<Components>(
    () => ({
      pre({children}) {
        return <>{children}</>;
      },
      code({className, children, ...props}) {
        const match = /language-(\w+)/.exec(className ?? '');
        const code = String(children).replace(/\n$/, '');

        if (match) {
          return <CodeBlock language={match[1]} code={code} />;
        }

        return (
          <code className={styles.inlineCode} {...props}>
            {children}
          </code>
        );
      },
      h1: ({children}) => <h2 className={styles.markdownH2}>{children}</h2>,
      h2: ({children}) => <h2 className={styles.markdownH2}>{children}</h2>,
      h3: ({children}) => <h3 className={styles.markdownH3}>{children}</h3>,
      h4: ({children}) => <h4 className={styles.markdownH4}>{children}</h4>,
      p: ({children}) => <p className={styles.textParagraph}>{children}</p>,
      ul: ({children}) => <ul className={styles.markdownList}>{children}</ul>,
      ol: ({children}) => <ol className={styles.markdownList}>{children}</ol>,
      li: ({children}) => <li className={styles.markdownListItem}>{children}</li>,
      blockquote: ({children}) => (
        <blockquote className={styles.markdownQuote}>{children}</blockquote>
      ),
      a: ({href, children}) => (
        <a
          href={href}
          className={styles.markdownLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
      strong: ({children}) => <strong className={styles.markdownStrong}>{children}</strong>,
      hr: () => <hr className={styles.markdownHr} />,
    }),
    [],
  );

  return (
    <div className={styles.messageContent}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
