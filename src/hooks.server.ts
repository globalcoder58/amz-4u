
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load runtime environment variables for Amplify WEB_COMPUTE
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Runtime environment loaded');
console.log('BEDROCK_KB_ID:', process.env.BEDROCK_KB_ID ? 'set' : 'not set');
console.log('MY_ACCESS_KEY_ID:', process.env.MY_ACCESS_KEY_ID ? 'set' : 'not set');

