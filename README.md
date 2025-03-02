# **Lavender (Backend)** - Sac Hacks VI (2025)  

---

## **🚀 Elevator Pitch**
**Turn your notes into quizzes with AI and test your knowledge!**  
Lavender helps students and professionals **convert their lecture slides, notes, or PDFs into AI-generated quizzes** to reinforce learning through interactive testing.

---

> **Note:** This repository contains only the backend.  
> The frontend repository is located at **[lavender-frontend](https://github.com/vijitdua/lavender-frontend)**, and the backend must be running for the frontend to function properly.  
> **Important:** This backend requires an OpenAI API key in the `.env` file for full functionality.

---

## **🔧 Built With**
- **Backend**: Express.js, Node.js, Multer (for file uploads)  
- **AI & Processing**: OpenAI API, PDF.js  

---

## **📸 API Endpoints**

#### **📂 Upload a PDF and Generate Flashcards**
- **Endpoint:** `POST /pdf`
- **Description:** Accepts a PDF file and generates quiz questions based on its content.
- **Request Body:** `multipart/form-data`
    - `file`: The PDF file to be processed.
    - `questionCount`: The number of questions to generate.
- **Response:**
  ```json
  {
    "success": true,
    "questions": [
      {
        "question": "What is the capital of France?",
        "optionA": "Paris",
        "optionB": "London",
        "optionC": "Berlin",
        "optionD": "Madrid",
        "correctAnswer": "A",
        "hintOne": "It's known as the City of Light.",
        "hintTwo": "The Eiffel Tower is located here."
      }
    ]
  }
  ```
#### **🛑 Error Handling**
If an error occurs, the API returns:
```json
{
  "success": false,
  "error": "Invalid input. Ensure you uploaded a file."
}
```

---

## **🛠 Tech Stack**

### **Backend**
- **Express.js** (REST API)
- **Node.js** (Backend runtime)
- **Multer** (File upload handling)
- **PDF.js** (Parsing and processing PDFs)
- **OpenAI API** (Generating quiz questions from notes)

### **Frontend**
*(Refer to the [lavender-frontend](https://github.com/vijitdua/lavender-frontend) for full details)*  
- **Next.js** (Server-side rendering & routing)
- **React.js** (Component-based UI)
- **Material UI** (Styling & UI components)

---

## **💻 Run Locally**

This guide assumes you are running on a Unix-based machine (Linux or macOS).  
For Windows users, adapt the commands accordingly.

### **Prerequisites**
- Install **Node.js** and **npm**  
- Clone this repository:
  ```bash
  git clone [Backend Repository URL]
  cd [Backend Repository Folder]
  ```
- Copy the `.env.sample` file to `.env` and configure it:
  ```bash
  cp .env.sample .env
  ```
  **Ensure you provide a valid OpenAI API key inside `.env`.**

---

### **🚀 Backend Setup**
#### **Run with npm**
```bash
npm install
npm start
```
This starts the backend on **http://localhost:3001/**. *(Change port if necessary in `.env`.)*

> **Note:** The frontend must be running to interact with the backend.

---

## **👨‍💻 Developed By**
- **[Ehsaan Mohammed](https://github.com/ehsaanisme)**
    - **Backend:** Worked on the LLM Integration

- **[Alex Zhu Zhou](https://alexzhuzhou.github.io/AlexWebsite/)**
    - **Backend:** Worked on setting up the server and client requests.

- **[Taha Abdullah](https://github.com/tmabdull)**
    - **Backend:** Worked on the pdf parser and integration with the backend pdfController.

- **[Vijit Dua](https://vijitdua.com/)**
    - **Backend:** Repository initialization and setup
    - **Frontend:** Everything

---

## **📚 Acknowledgments**
- Sac Hacks VI (2025)
- OpenAI API for AI-generated quiz questions
- Express.js & Multer for backend processing