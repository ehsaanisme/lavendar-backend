import fs from 'fs';
import path from 'path';
import { parsePDF } from '../services/pdfService.js';
import { generateQuestions } from '../services/openaiService.js';

export const processPDFController = async (req, res) => {
    try {
        if (!req.file || !req.body.questionCount) {
            return res.status(400).json({ success: false, message: 'PDF file and question count are required' });
        }

        const filePath = req.file.path;
        const questionCount = req.body.questionCount;
        const fileData = fs.readFileSync(filePath);

        // Extract text from the PDF file in chunks
        const textChunks = await parsePdfInChunks(fileData, 50000);
        
        const combinedText = textChunks.join('\n');

        const questions = await generateQuestions(combinedText, questionCount);

        fs.unlinkSync(filePath);

        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ success: false, message: 'Error processing PDF' });
    }
};