// services/pdfService.js

import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const pdfWorkerPath = join(dirname(require.resolve('pdfjs-dist/package.json')), 'build', 'pdf.worker.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerPath;

export async function parsePdf(pdfData) {
    try {
        // Ensure we're working with Uint8Array
        const data = Buffer.isBuffer(pdfData) ? new Uint8Array(pdfData) : pdfData;

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdfDocument = await loadingTask.promise;
        
        console.log(`PDF loaded successfully. Total pages: ${pdfDocument.numPages}`);
        
        let fullText = '';
        const chunkSize = 5; // Process 5 pages at a time
        
        // Process pages in chunks
        for (let chunkStart = 1; chunkStart <= pdfDocument.numPages; chunkStart += chunkSize) {
            const chunkEnd = Math.min(chunkStart + chunkSize - 1, pdfDocument.numPages);
            console.log(`Processing pages ${chunkStart} to ${chunkEnd}...`);
            
            // Process each page in the current chunk
            for (let pageNum = chunkStart; pageNum <= chunkEnd; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Group text by vertical position to maintain paragraphs
                const textItems = textContent.items;
                const textByY = {};
                
                for (const item of textItems) {
                    const y = Math.round(item.transform[5]); // Vertical position
                    if (!textByY[y]) {
                        textByY[y] = [];
                    }
                    textByY[y].push(item.str);
                }
                
                // Sort by vertical position (top to bottom)
                const sortedYs = Object.keys(textByY).sort((a, b) => b - a);
                
                // Build text with layout preservation
                let pageText = `--- Page ${pageNum} ---\n\n`;
                for (const y of sortedYs) {
                    pageText += textByY[y].join(' ') + '\n';
                }
                
                fullText += pageText + '\n\n';
            }
        }
        
        console.log(`PDF extraction complete. Extracted ${fullText.length} characters.`);
        return fullText;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error(`Failed to parse PDF file: ${error.message}`);
    }
}

/**
 * Extracts text from a PDF buffer and returns it in chunks
 * @param {Buffer} pdfBuffer - Buffer containing PDF data
 * @param {number} maxChunkSize - Maximum size of each chunk in characters
 * @returns {Promise<string[]>} - Array of text chunks from the PDF
 */
export async function parsePdfInChunks(pdfBuffer, maxChunkSize = 100000) {
    try {
        const fullText = await parsePdf(pdfBuffer);
        
        // Split the text into chunks of approximately maxChunkSize
        const chunks = [];
        let currentPosition = 0;
        
        while (currentPosition < fullText.length) {
            // Find a good breaking point (end of paragraph)
            let breakPoint = Math.min(currentPosition + maxChunkSize, fullText.length);
            
            // If we're not at the end, try to find a paragraph break
            if (breakPoint < fullText.length) {
                // Look for double newline (paragraph break)
                const nextParagraph = fullText.indexOf('\n\n', breakPoint - 5000);
                if (nextParagraph !== -1 && nextParagraph < breakPoint + 5000) {
                    breakPoint = nextParagraph + 2;
                } else {
                    // If no paragraph break, look for single newline
                    const nextLine = fullText.indexOf('\n', breakPoint - 1000);
                    if (nextLine !== -1 && nextLine < breakPoint + 1000) {
                        breakPoint = nextLine + 1;
                    }
                }
            }
            
            chunks.push(fullText.substring(currentPosition, breakPoint));
            currentPosition = breakPoint;
        }
        
        console.log(`PDF split into ${chunks.length} chunks`);
        return chunks;
    } catch (error) {
        console.error("Error parsing PDF in chunks:", error);
        throw new Error(`Failed to parse PDF in chunks: ${error.message}`);
    }
}
