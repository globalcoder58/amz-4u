import { type RequestHandler } from '@sveltejs/kit';

const chatEndpoint = 'https://amz-4u.web.app/api/chat';

export const POST: RequestHandler = async ({ request }) => {
  return fetch(chatEndpoint, {
    method: 'POST',
    headers: {
      'content-type': request.headers.get('content-type') ?? 'application/json'
    },
    body: await request.arrayBuffer()
  });
};
