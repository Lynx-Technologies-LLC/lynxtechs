import {isValidMessages, runDocsChat} from '../lib/docs-chat.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {messages, domain: rawDomain} = req.body ?? {};
  if (!isValidMessages(messages)) {
    return res.status(400).json({error: 'Invalid messages payload'});
  }

  const domain = rawDomain === 'hardware' ? 'hardware' : 'software';

  try {
    const result = await runDocsChat(messages, domain);
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
