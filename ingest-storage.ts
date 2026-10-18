import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { genkit } from "genkit";
import { googleAI, geminiEmbedding001 } from "@genkit-ai/googleai";

// 1. Automatically load .env if present
try {
  process.loadEnvFile?.();
} catch {}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("\n❌ Error: GEMINI_API_KEY is missing from environment and .env file.");
  console.error("Please ensure .env contains:");
  console.error('  GEMINI_API_KEY=your_key_here\n');
  process.exit(1);
}

// 2. Configure Firebase Admin Credentials
const serviceAccountPath = resolve(process.cwd(), "serviceAccountKey.json");
const appOptions: any = {
  projectId: "ich-brauch-urlaub",
  storageBucket: "ich-brauch-urlaub.firebasestorage.app",
};

if (existsSync(serviceAccountPath)) {
  console.log("✔ Using Firebase credentials from serviceAccountKey.json");
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  appOptions.credential = cert(serviceAccount);
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log(`✔ Using GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
} else {
  console.error("\n❌ Error: Firebase Admin Service Account key is required to access Storage & Firestore.");
  console.error("To generate and save your key:");
  console.error("  1. Open Firebase Console: https://console.firebase.google.com/project/ich-brauch-urlaub/settings/serviceaccounts/adminsdk");
  console.error("  2. Click 'Generate new private key' and download the JSON file.");
  console.error("  3. Rename it to 'serviceAccountKey.json' and place it in:");
  console.error(`     ${serviceAccountPath}\n`);
  process.exit(1);
}

// Initialize Genkit & Firebase Admin
const ai = genkit({ plugins: [googleAI({ apiKey })] });
initializeApp(appOptions);

const db = getFirestore();
const bucket = getStorage().bucket();

const filesToProcess = [
  "amazon_arbeitsrecht_praxis_klagen.md",
  "bag_urteile_urlaubsverfall.md",
  "eugh_urteile_urlaubsverfall.md",
  "k_ndigungsschutzklage_praxis_fristen.md",
];

async function runIngestion() {
  for (const fileName of filesToProcess) {
    console.log(`\n--- Processing: ${fileName} ---`);

    let content: string;
    try {
      console.log(`Downloading ${fileName} from Firebase Storage...`);
      const [fileBuffer] = await bucket.file(fileName).download();
      content = fileBuffer.toString("utf-8");
      console.log(`Downloaded from Storage (${content.length} chars).`);
    } catch (err: any) {
      console.warn(`Storage download failed (${err.message}). Checking local disk fallback...`);
      const localCandidates = [
        resolve(process.cwd(), fileName),
        resolve(process.env.USERPROFILE || "", "Downloads", fileName),
      ];
      const foundPath = localCandidates.find((p) => existsSync(p));
      if (foundPath) {
        console.log(`Using local file: ${foundPath}`);
        content = readFileSync(foundPath, "utf-8");
      } else {
        throw new Error(`Could not find ${fileName} in Storage or local paths.`);
      }
    }

    // Split content into chunks
    const chunks = content.split(/\n\n+/).filter((c) => c.trim().length > 10);
    const collectionName = fileName.replace(".md", "");

    console.log(`Generating embeddings and writing ${chunks.length} chunks to Firestore...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Generate 768-dim embedding via gemini-embedding-001
      const [{ embedding }] = await ai.embed({
        embedder: geminiEmbedding001,
        content: chunk,
        options: { outputDimensionality: 768 },
      });

      // Write chunk + vector into Firestore
      await db.collection(collectionName).add({
        text: chunk,
        source: fileName,
        embedding: FieldValue.vector(embedding),
      });

      if ((i + 1) % 5 === 0 || i === chunks.length - 1) {
        console.log(`  Indexed chunk ${i + 1}/${chunks.length} into collection '${collectionName}'`);
      }
    }
    console.log(`Finished indexing ${fileName}`);
  }
}

runIngestion()
  .then(() => console.log("\n Ingestion complete! All 4 files synced to Firestore."))
  .catch((err) => {
    console.error("\n❌ Ingestion error:", err.message || err);
    process.exit(1);
  });
