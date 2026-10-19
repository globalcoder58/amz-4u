import { onRequest } from 'firebase-functions/v2/https';
import { once } from 'node:events';
import { handleChatRequest } from './chat.js';

export const chat = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 300,
    memory: '512MiB',
    secrets: ['GEMINI_API_KEY'],
  },
  async (request, response) => {
    if (request.method !== 'POST') {
      response.set('Allow', 'POST').status(405).json({ error: 'Method not allowed' });
      return;
    }

    const result = await handleChatRequest({ json: async () => request.body });
    response.status(result.status);
    result.headers.forEach((value, name) => {
      if (name.toLowerCase() !== 'connection') {
        response.setHeader(name, value);
      }
    });

    if (!result.body) {
      response.end();
      return;
    }

    response.flushHeaders();
    const reader = result.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!response.write(value)) {
          await once(response, 'drain');
        }
      }
    } finally {
      response.end();
    }
  },
);
