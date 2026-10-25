
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Try multiple possible .env locations
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const possiblePaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env')
];

let loaded = false;
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Runtime environment loaded from: ${envPath}`);
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.warn('No .env file found in any expected location');
  console.warn('Checked paths:', possiblePaths);
}

console.log('BEDROCK_KB_ID:', process.env.BEDROCK_KB_ID ? 'set' : 'NOT SET');
console.log('MY_ACCESS_KEY_ID:', process.env.MY_ACCESS_KEY_ID ? 'set' : 'NOT SET');
console.log('MY_SECRET_ACCESS_KEY:', process.env.MY_SECRET_ACCESS_KEY ? 'set' : 'NOT SET');

