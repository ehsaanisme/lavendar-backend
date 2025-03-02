import dotenv from 'dotenv';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../');

const env = {
    corsOrigin: (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === 'false' || process.env.CORS_ORIGIN === 'null') ?
        false : process.env.CORS_ORIGIN, // Sets corsOrigin to false (disables cors) if requested / none provided
    port: process.env.PORT || 3001, // Uses the port in .env or defaults to 3001 (Frontend will use 3000 by default).
    rootLocation: projectRoot,
    openaiApiKey: process.env.OPENAI_API_KEY || '', // OpenAI API Key from .env
};

export default env;