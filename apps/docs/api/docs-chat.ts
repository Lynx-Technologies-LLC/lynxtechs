import type {VercelRequest, VercelResponse} from '@vercel/node';

import {isValidMessages, runDocsChat} from '../lib/docs-chat.mjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {messages} = req.body ?? {};
  if (!isValidMessages(messages)) {
    return res.status(400).json({error: 'Invalid messages payload'});
  }

  try {
    const result = await runDocsChat(messages);
    return res.status(200).json(result);
  } catch (error) {
    const statusCode =
      error && typeof error === 'object' && 'statusCode' in error
        ? Number(error.statusCode)
        : 500;
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : 'Failed to get a response. Please try again.';

    return res.status(statusCode).json({error: message});
  }
}
