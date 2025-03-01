// tests/pdfService.test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parsePdf } from '../src/service/pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testPdfExtraction() {
    try {
        console.log('Starting PDF extraction test...');
        
        // Make sure this path is correct relative to where you're running the test from
        const samplePdfPath = path.join(__dirname, 'sample-notes.pdf');
        console.log('Looking for PDF at:', path.resolve(samplePdfPath));

        // Read the file into a buffer
        const pdfBuffer = fs.readFileSync(samplePdfPath);
        
        // Pass the buffer directly to parsePdf
        const extractedText = await parsePdf(pdfBuffer);
        
        console.log('PDF extraction successful! Extracted text preview:');
        console.log(extractedText.substring(0, 200) + '...');
        
        // return extractedText;
    } catch (error) {
        console.error('PDF extraction test failed:', error);
        throw error;
    }
}


testPdfExtraction()
    .then(result => {
        console.log('Test completed successfully');
    })
    .catch(error => {
        console.error('Test failed:', error);
    });
