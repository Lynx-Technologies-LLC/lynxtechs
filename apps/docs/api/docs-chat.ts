import Anthropic from '@anthropic-ai/sdk';
import type {VercelRequest, VercelResponse} from '@vercel/node';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SYSTEM_PROMPT = `You are the Lynx Technologies documentation assistant.

Answer questions about:
- LXMASTER EtherCAT master software (CLI, C++ API, tutorials, examples)
- Lynx EtherCAT PCB hardware modules (LXDIO33-16, LXFIBER, LXRJ45, integration)

Be concise, accurate, and practical. If you are unsure or the question is outside the documentation scope, say so and suggest contacting info@lynxtechs.com.

When internal documentation context is provided in future updates, prefer that context over general knowledge.`;

function isValidMessages(value: unknown): value is ChatMessage[] {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Ask AI is not configured yet. Set ANTHROPIC_API_KEY on the server.',
    });
  }

  const {messages} = req.body ?? {};
  if (!isValidMessages(messages)) {
    return res.status(400).json({error: 'Invalid messages payload'});
  }

  const model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514';

  try {
    const client = new Anthropic({apiKey});
    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
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
      return res.status(502).json({error: 'No response from the assistant'});
    }

    return res.status(200).json({message: text});
  } catch (error) {
    console.error('[docs-chat]', error);
    return res.status(500).json({error: 'Failed to get a response. Please try again.'});
  }
}
