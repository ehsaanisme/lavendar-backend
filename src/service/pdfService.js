// services/pdfService.js
import pdf from 'pdf-parse';

/**
 * Extracts text from a PDF buffer
 * @param {Buffer} pdfBuffer - Buffer containing PDF data
 * @returns {Promise<string>} - Extracted text from the PDF
 */
export async function parsePdf(pdfBuffer) {
    if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error("Input must be a Buffer");
    }

    try {
        const data = await pdf(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to parse PDF file");
    }
}
