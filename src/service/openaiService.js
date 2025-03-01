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
            { role: "system", content: "Create a multiple-choice question related to the following topic. Include four answer options (A, B, C, D), specify the correct answer, and provide two hints." },
            { role: "user", content: `Topic: ${topic}` }
        ],
        temperature: 0.7
    });

    const mcq = response.choices[0].message.content.split("\n").map(line => line.trim());

    return {
        question: mcq[0],
        optionA: mcq[1].replace("A) ", ""),
        optionB: mcq[2].replace("B) ", ""),
        optionC: mcq[3].replace("C) ", ""),
        optionD: mcq[4].replace("D) ", ""),
        correctAnswer: mcq[5].replace("Correct Answer: ", ""),
        hintOne: mcq[6].replace("Hint 1: ", ""),
        hintTwo: mcq[7].replace("Hint 2: ", "")
    };
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