import { type RequestHandler } from '@sveltejs/kit';
import { handleChatRequest } from '../../../../functions/chat.js';

export const POST: RequestHandler = ({ request }) => handleChatRequest(request);
