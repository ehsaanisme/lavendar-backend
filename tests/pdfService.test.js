// tests/pdfService.test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parsePdfInChunks } from '../src/service/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testPdfChunking() {
    try {
        console.log('Starting PDF chunking test...');
        
        // Path to a sample PDF file for testing
        const samplePdfPath = path.join(__dirname, 'sample-notes.pdf');
        
        // Read the PDF file into a buffer
        const pdfBuffer = fs.readFileSync(samplePdfPath);
        
        console.log('PDF file loaded successfully');
        
        // Test the PDF chunking with a small chunk size to force multiple chunks
        const chunks = await parsePdfInChunks(pdfBuffer, 10000);
        
        console.log('PDF chunking successful!');
        console.log(`Total chunks: ${chunks.length}`);
        
        // Log info about each chunk
        chunks.forEach((chunk, index) => {
            console.log(`# Chunk ${index + 1}: ${chunk.length} characters`);
            console.log(chunk);
            // console.log(`Preview: ${chunk.substring(0, 100)}...`);
        });
        
        return chunks;
    } catch (error) {
        console.error('PDF chunking test failed:', error);
        throw error;
    }
}

testPdfChunking()
    .then(() => console.log('Test completed successfully'))
    .catch(error => console.error('Test failed:', error));
