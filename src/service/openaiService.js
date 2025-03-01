/**
🔹 What This Does
Initializes OpenAI API Client using env.openaiApiKey.
Creates generateQuestions(text, count):
Loops count times to generate multiple unique questions.
Sends the extracted PDF text as input.
Uses GPT-4 to generate a well-structured question.
Returns an array of questions.
**/

/**
This version follows the pipeline structure we designed:

Step 1: Extracts main topics from the text.
Step 2: Generates MCQs based on the topics.
Step 3: Ensures the number of questions matches the user-specified count.
**/

// import the env and openai
import { OpenAI } from "openai";
import env from "../config/env.js";

const openai = new OpenAI({ apiKey: env.openaiApiKey });


/**
 * Extracts key topics from the given text.
 * @param {string} text - Extracted text from the PDF.
 * @returns {Promise<string[]>} - Array of key topics.
 */
 async function generateTopics(text) {
    if (!env.openaiApiKey) {
        throw new Error("OpenAI API key is missing. Check your .env file.");
    }

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "Extract the most important topics from the provided text. List them as short bullet points." },
            { role: "user", content: text }
        ],
        temperature: 0.7
    });

    return response.choices[0].message.content.split("\n").filter(topic => topic.trim() !== "");
}

/**
 * Generates multiple-choice questions (MCQs) for a given topic.
 * @param {string} topic - A single extracted topic.
 * @returns {Promise<Object>} - A single MCQ object.
 */
 async function generateMCQ(topic) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { 
                role: "system", 
                content: `You are a JSON generator. 
                Given a topic, return a JSON object with the following format:
                {
                    "question": "The multiple-choice question",
                    "optionA": "First answer choice",
                    "optionB": "Second answer choice",
                    "optionC": "Third answer choice",
                    "optionD": "Fourth answer choice",
                    "correctAnswer": "A single letter: A, B, C, or D",
                    "hintOne": "A useful hint for the question",
                    "hintTwo": "Another helpful hint"
                }
                Ensure the JSON output is valid, with no extra text, no explanations, and no 'Question:' prefix in the question.`
            },
            { role: "user", content: `Topic: ${topic}` }
        ],
        temperature: 0.7,
        response_format: "json" // Ensures the response is strictly JSON
    });

    return JSON.parse(response.choices[0].message.content);
}

/**
 * Generates a specified number of unique MCQs based on extracted topics.
 * @param {string} text - Extracted text from the PDF.
 * @param {number} count - Number of MCQs to generate.
 * @returns {Promise<Object[]>} - Array of generated MCQs.
 */
 export async function generateQuestions(text, count) {
    const topics = await generateTopics(text);
    
    // Ensure we get enough questions even if there are fewer topics
    const selectedTopics = [];
    while (selectedTopics.length < count) {
        selectedTopics.push(...topics);
        if (selectedTopics.length >= count) break;
    }

    const mcqPromises = selectedTopics.slice(0, count).map(topic => generateMCQ(topic));
    return Promise.all(mcqPromises);
}