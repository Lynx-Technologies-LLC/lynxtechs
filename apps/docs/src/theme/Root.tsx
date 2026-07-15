import React from 'react';
import Root from '@theme-original/Root';
import type {Props} from '@theme/Root';
import {Analytics} from '@vercel/analytics/react';

import AskAiPanel from '@site/src/components/AskAi/AskAiPanel';
import {AskAiProvider} from '@site/src/components/AskAi/AskAiProvider';

export default function RootWrapper(props: Props): React.JSX.Element {
  return (
    <AskAiProvider>
      <Root {...props} />
      <AskAiPanel />
      <Analytics />
    </AskAiProvider>
  );
}
