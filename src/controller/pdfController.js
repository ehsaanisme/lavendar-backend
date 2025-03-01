import fs from 'fs';
import path from 'path';
import { parsePDF } from '../services/pdfService.js';
import { generateQuestions } from '../services/openaiService.js';

export const processPDFController = async (req, res) => {
    try {
        const filePath = req.file.path;
        const questionCount = req.body.questionCount;

    
        if (!req.file || !questionCount) {
            return res.status(400).json({ success: false, message: 'PDF file and question count are required' });
        }

        const fileData = fs.readFileSync(filePath);

        // Extract text from the PDF file
        const extractedText = await parsePDF(fileData);

        // Generate questions using the extracted text
        const questions = await generateQuestions(extractedText, questionCount);


        fs.unlinkSync(filePath);

        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ success: false, message: 'Error processing PDF' });
    }
};