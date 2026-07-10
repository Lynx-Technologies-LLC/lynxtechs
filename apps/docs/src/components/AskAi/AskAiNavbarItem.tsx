import React from 'react';

import {useAskAi} from './AskAiProvider';
import styles from './AskAi.module.css';

type Props = {
  label?: string;
};

export default function AskAiNavbarItem({label = 'Ask AI'}: Props) {
  const {open} = useAskAi();

  return (
    <button
      type="button"
      className={`navbar__item navbar__link ${styles.navButton}`}
      onClick={open}
    >
      <span className={styles.navIcon} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3l1.2 4.2L17.5 8.5 13.2 9.7 12 14l-1.2-4.3L6.5 8.5l4.3-1.3L12 3z"
            fill="currentColor"
          />
          <path
            d="M5 14l.8 2.8L8.6 18l-2.8.8L5 21.6l-.8-2.8L1.4 18l2.8-.8L5 14z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M18 13l.9 3.1L22 17.2l-3.1.9L18 21.2l-.9-3.1L14 17.2l3.1-.9L18 13z"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      </span>
      <span>{label}</span>
    </button>
  );
}
