import { type RequestHandler } from '@sveltejs/kit';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Automatically load .env if present
try {
  process.loadEnvFile?.();
} catch {}

// Initialize Firebase Admin once
function getDb() {
  if (getApps().length === 0) {
    const candidatePaths = [
      resolve(process.cwd(), 'serviceAccountKey.json'),
      resolve(process.cwd(), 'src', 'serviceAccountKey.json'),
    ];
    const keyPath = candidatePaths.find((p) => existsSync(p));
    if (keyPath) {
      const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp();
    }
  }
  return getFirestore();
}

interface Chunk {
  source: string;
  text: string;
  embedding: number[];
}

let cachedChunks: Chunk[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

async function getIndexedChunks(db: FirebaseFirestore.Firestore): Promise<Chunk[]> {
  const now = Date.now();
  if (cachedChunks && now - lastCacheTime < CACHE_TTL) {
    return cachedChunks;
  }

  const collections = [
    'amazon_arbeitsrecht_praxis_klagen',
    'bag_urteile_urlaubsverfall',
    'eugh_urteile_urlaubsverfall',
    'k_ndigungsschutzklage_praxis_fristen',
  ];

  const chunks: Chunk[] = [];
  for (const col of collections) {
    try {
      const snap = await db.collection(col).get();
      snap.forEach((doc) => {
        const d = doc.data();
        if (d.text && d.embedding) {
          const embArray =
            typeof d.embedding.toArray === 'function'
              ? d.embedding.toArray()
              : Array.isArray(d.embedding)
              ? d.embedding
              : null;
          if (embArray) {
            chunks.push({
              source: d.source || col,
              text: d.text,
              embedding: embArray,
            });
          }
        }
      });
    } catch (e) {
      console.error(`Error loading collection ${col}:`, e);
    }
  }

  cachedChunks = chunks;
  lastCacheTime = now;
  return chunks;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const db = getDb();

    // 1. Generate query embedding using gemini-embedding-001 (768 dimensions)
    const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embedRes = await embedModel.embedContent({
      content: { role: 'user', parts: [{ text: message }] },
      outputDimensionality: 768,
    } as any);
    const qVec = embedRes.embedding.values;

    // 2. Score similarity against indexed chunks in Firestore
    const chunks = await getIndexedChunks(db);
    const scored = chunks.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(qVec, chunk.embedding),
    }));
    scored.sort((a, b) => b.similarity - a.similarity);
    const topChunks = scored.slice(0, 4);

    // 3. Build citations structure matching Chat.Svelte expectations
    const citations =
      topChunks.length > 0
        ? [
            {
              text: 'Urlaubsrecht & Urteile (BAG / EuGH)',
              references: topChunks.map((c) => ({
                source: c.source,
                content: c.text,
              })),
            },
          ]
        : [];

    // 4. Build prompt with retrieved knowledge
    const contextText = topChunks
      .map((c, i) => `[Dokument ${i + 1}: ${c.source}]\n${c.text}`)
      .join('\n\n---\n\n');

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.8-flash',
      systemInstruction: `Du bist Lorelyn, eine freundliche, empathische und rechtlich fundierte Assistentin für deutsches Arbeitsrecht, spezialisiert auf Urlaubsrecht, Urlaubsverfall, Rechtsprechung des Bundesarbeitsgerichts (BAG) und des Europäischen Gerichtshofs (EuGH) sowie Kündigungsschutz und Fristen.
Du berätst Beschäftigte, die um ihren Resturlaub bangen oder Unterstützung für ein Schreiben an den Arbeitgeber oder Betriebsrat benötigen.

Wichtige Richtlinien:
- Antworte immer auf Deutsch, professionell, lösungsorientiert und verständlich.
- Nutze die bereitgestellten Urteile und Kontextdokumente, um deine Aussagen mit BAG-/EuGH-Entscheidungen (z.B. Hinweis- und Aufforderungsobliegenheit des Arbeitgebers, Verjährung) zu untermauern.
- Wenn der Nutzer um einen Briefentwurf oder Formulierungsvorschlag bittet (z.B. an den Betriebsrat oder Arbeitgeber), erstelle ein formelles, sofort verwendbares Musterschreiben mit Datum, Betreff, Begründung und Fristsetzung.
- Gib den Hinweis, dass deine Auskunft eine Orientierung und Ersteinschätzung darstellt, aber keine anwaltliche Einzelberatung ersetzt.`,
    });

    const prompt = `Hier ist relevanter Kontext aus der Wissensdatenbank:
${contextText}

Anfrage des Nutzers:
${message}`;

    // 5. Create SSE stream for real-time response in Chat.Svelte
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send citations first
          if (citations.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'citations', citations })}\n\n`)
            );
          }

          // Stream generated response tokens
          const result = await model.generateContentStream(prompt);
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`)
              );
            }
          }
        } catch (err: any) {
          console.error('Chat generation error:', err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                content: err.message || 'Error generating response',
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
