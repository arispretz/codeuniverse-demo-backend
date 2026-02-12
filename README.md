# Project Backend

Express + MongoDB backend for the Collaboration Platform.  
Provides APIs for project management, the integrated code editor, the audited terminal, and direct integration with the AI Assistant.

---

## 🔗 Associated Repositories

- [Frontend (codeuniverse)](https://github.com/arispretz/codeuniverse.git)
- [AI Assistant (codeuniverse-demo-ai_assistant)](https://github.com/arispretz/codeuniverse-demo-ai_assistant.git)
- [Codeuniverse-Demo (codeuniverse-demo)](https://github.com/arispretz/codeuniverse-demo.git)

---

## Features
- User authentication (JWT + Firebase)
- Task and project management APIs
- Integration with the Code Editor and AI Assistant

---

## Tech Stack
- Node.js / Express
- MongoDB
- Socket.io

---

## Installation
```bash
git clone https://github.com/arispretz/codeuniverse-demo-backend.git
cd codeuniverse-demo-backend
npm install
cp .env.example .env
npm start
`````

---

## 🔑 Environment Variables
See .env.example for required variables.

---

## 🚀 Deployment
Render: Currently deployed as a Docker container.
Local Development / Docker Compose: Dockerfiles are included for integration with the frontend and AI Assistant.

---

## 🐳 Docker Usage
### Development
```bash
docker build -f dockerfile.dev -t app-dev .
docker run -p 4000:4000 app-dev
`````

### Production
```bash
docker build -f dockerfile.prod -t app-prod .
docker run -p 4000:4000 app-prod
`````

ℹ️ **Note:**  
- Use the *Development* configuration for local testing and iterative work.  
- Use the *Production* configuration for deployment on Render or when running the backend in isolation.  

---

## 📜 License
Apache 2.0

---
