import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {isValidMessages, runDocsChat} from '../lib/docs-chat.mjs';

const pluginDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(pluginDir, '..');

function loadEnvLocal() {
  const envPath = path.join(appDir, '.env.local');
  if (!fs.existsSync(envPath)) {
    return false;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  if (!content.trim()) {
    return false;
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }

  return Boolean(process.env.ANTHROPIC_API_KEY);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function registerAskAiRoute(app) {
  if (app.__lynxAskAiRouteRegistered) {
    return;
  }

  app.__lynxAskAiRouteRegistered = true;

  app.post('/api/docs-chat', async (req, res) => {
    try {
      const body = await readJsonBody(req);
      const {messages} = body ?? {};

      if (!isValidMessages(messages)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: 'Invalid messages payload'}));
        return;
      }

      const result = await runDocsChat(messages);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (error) {
      const statusCode = error?.statusCode ?? 500;
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: error?.message ?? 'Failed to get a response. Please try again.',
        }),
      );
    }
  });
}

/** @type {import('@docusaurus/types').PluginModule} */
export default function askAiDevPlugin() {
  return {
    name: 'ask-ai-dev-plugin',

    configureWebpack(_config, isServer) {
      if (isServer) {
        return {};
      }

      const hasKey = loadEnvLocal();
      if (!hasKey) {
        console.warn(
          '[ask-ai] No ANTHROPIC_API_KEY found in apps/docs/.env.local. Ask AI chat will not work until you add it and restart the dev server.',
        );
      }

      return {
        devServer: {
          setupMiddlewares: (middlewares, devServer) => {
            if (devServer.app) {
              registerAskAiRoute(devServer.app);
            }

            return middlewares;
          },
        },
      };
    },
  };
}
