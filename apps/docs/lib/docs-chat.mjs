import Anthropic from '@anthropic-ai/sdk';

import {
  buildSystemPrompt,
} from './docs-chat-context.mjs';
import {
  isObviouslyOffTopic,
  OFF_TOPIC_REFUSAL,
  SYSTEM_PROMPT,
} from './docs-chat-prompts.mjs';

export {SYSTEM_PROMPT} from './docs-chat-prompts.mjs';

export function isValidMessages(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 40) {
    return false;
  }

  return value.every(
    (message) =>
      message &&
      typeof message === 'object' &&
      (message.role === 'user' || message.role === 'assistant') &&
      typeof message.content === 'string' &&
      message.content.trim().length > 0 &&
      message.content.length <= 4000,
  );
}

// Haiku 4.5 is Anthropic's lowest-cost current model ($1/$5 per 1M tokens).
const DEFAULT_MODEL_CANDIDATES = [
  'claude-haiku-4-5',
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-6',
  'claude-sonnet-5',
  'claude-sonnet-4-5-20250929',
];

function isModelNotFoundError(error) {
  const message =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : '';
  return message.includes('not_found_error') || message.includes('model:');
}

function getModelCandidates() {
  const configured = process.env.ANTHROPIC_MODEL?.trim();
  if (configured) {
    return [
      configured,
      ...DEFAULT_MODEL_CANDIDATES.filter((model) => model !== configured),
    ];
  }

  return DEFAULT_MODEL_CANDIDATES;
}

function formatAnthropicError(error) {
  if (error && typeof error === 'object') {
    const message = 'message' in error ? String(error.message) : '';
    if (isModelNotFoundError(error)) {
      return 'No supported Anthropic model is available on this account. Set ANTHROPIC_MODEL in apps/docs/.env.local to a model from your Anthropic console, then restart the dev server.';
    }
    if (message) {
      return message;
    }
  }
  return 'Failed to get a response. Please try again.';
}

export async function runDocsChat(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const error = new Error(
      'Ask AI is not configured yet. Add ANTHROPIC_API_KEY=your-key to apps/docs/.env.local and restart the dev server.',
    );
    error.statusCode = 503;
    throw error;
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user')?.content;

  if (latestUserMessage && isObviouslyOffTopic(latestUserMessage)) {
    return {message: OFF_TOPIC_REFUSAL};
  }

  const client = new Anthropic({apiKey});
  const modelCandidates = getModelCandidates();
  const systemPrompt = buildSystemPrompt(SYSTEM_PROMPT, latestUserMessage ?? '');
  let lastModelError = null;

  for (const model of modelCandidates) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      });

      const text = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

      if (!text) {
        const error = new Error('No response from the assistant');
        error.statusCode = 502;
        throw error;
      }

      return {message: text};
    } catch (error) {
      if (error?.statusCode) {
        throw error;
      }

      if (isModelNotFoundError(error)) {
        lastModelError = error;
        continue;
      }

      console.error('[docs-chat]', error);
      const wrapped = new Error(formatAnthropicError(error));
      wrapped.statusCode = 500;
      throw wrapped;
    }
  }

  console.error('[docs-chat]', lastModelError);
  const wrapped = new Error(formatAnthropicError(lastModelError));
  wrapped.statusCode = 500;
  throw wrapped;
}
