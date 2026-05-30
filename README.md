EduMentor AI
An AI Agent built for SDG 4: Quality Education, aligned with Vision 2030 and Vision 2035 education goals.
EduMentor gives students free, on-demand tutoring. It can explain any topic in simple language and generate practice quizzes, helping make quality learning accessible to everyone regardless of income or location.
The Problem (SDG 4)
UN Sustainable Development Goal 4 aims to ensure inclusive and equitable quality education for all. Many students lack access to affordable, personalised tutoring. EduMentor solves this by acting as an always-available AI study assistant.
Features
The project includes three distinct dashboards, as required:

Student (User): The core AI agent. Students type any topic to get a clear explanation, or generate a multiple-choice practice quiz with instant feedback.
Admin: System-wide oversight — total students, topics explained, quizzes taken, average scores, and a per-student activity table.
Institution (Client): For partner schools and universities to track adoption and active learning rates against Vision 2030/2035 education targets.

Tech Stack

Frontend: React + Vite
AI: Claude (Anthropic) powers the explanation and quiz-generation agent
Data: Structured learning records modelled for Kaggle hosting (student activity, institution metrics)
Version control: GitHub
Hosting/Deployment: Vercel

Live Demo
Deployed on Vercel: https://edumentor-ai-kohl.vercel.app
How the AI Agent Works
When a student enters a topic, the agent sends a structured prompt to the AI model asking it to either explain the topic in three clear paragraphs with a real-world example, or generate a 3-question multiple-choice quiz. A built-in knowledge base provides verified responses for common topics so the agent works reliably in the public demo; live AI responses for any topic activate when an API key is configured.
Vision 2030 & 2035 Alignment
Both visions prioritise a skilled, educated population and digital transformation of learning. EduMentor supports these by widening access to quality tutoring and building digital learning habits.
Running Locally
bashnpm install
npm run dev
Author
Built as an individual project for the Professional Practices course.
