
import type { RequestHandler } from '@sveltejs/kit';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateStreamCommand,
  type RetrieveAndGenerateStreamCommandInput,
  type Citation,
  type RetrievedReference
} from '@aws-sdk/client-bedrock-agent-runtime';

const client = new BedrockAgentRuntimeClient({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY || ''
  }
});

const KNOWLEDGE_BASE_ID = process.env.BEDROCK_KB_ID || 'U1BFOVU1EZ';

// Store active sessions (in production, use a persistent store)
const sessions = new Map<string, string>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const input: RetrieveAndGenerateStreamCommandInput = {
      input: {
        text: message
      },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: KNOWLEDGE_BASE_ID,
          modelArn:
            'arn:aws:bedrock:eu-central-1::inference-profile/eu.amazon.nova-pro-v1:0'
        }
      }
    };

    // Attach session ID for multi-turn conversations
    if (sessionId && sessions.has(sessionId)) {
      input.sessionId = sessions.get(sessionId);
    }

    const command = new RetrieveAndGenerateStreamCommand(input);
    const response = await client.send(command);

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          if (response.stream) {
            for await (const event of response.stream) {
              // Handle text output chunks
              if ('output' in event && event.output?.text) {
                const data = JSON.stringify({
                  type: 'text',
                  content: event.output.text
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }

              // Handle citations
              if ('citations' in event && event.citations) {
                const citationsData = (event.citations as Citation[]).map(
                  (citation: Citation) => ({
                    text: citation.generatedResponsePart?.textResponsePart?.text,
                    references: citation.retrievedReferences?.map(
                      (ref: RetrievedReference) => ({
                        content: ref.content?.text,
                        location: ref.location?.s3Location?.uri
                      })
                    )
                  })
                );
                const data = JSON.stringify({
                  type: 'citations',
                  content: citationsData
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }

              // Capture session ID for multi-turn conversations
              if ('sessionId' in event && event.sessionId) {
                sessions.set(
                  sessionId || 'default',
                  event.sessionId as string
                );
              }
            }
          }

          // Send done event
          const doneData = JSON.stringify({ type: 'done' });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
          controller.close();
        } catch (streamError) {
          console.error('Stream processing error:', streamError);
          const errorData = JSON.stringify({
            type: 'error',
            content: 'Stream processing error'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Bedrock API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

