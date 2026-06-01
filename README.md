# 🚀 Agentflow AI — Agentic AI Automation Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge\&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Queue-red?style=for-the-badge\&logo=redis)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?style=for-the-badge\&logo=socket.io)
![AI Powered](https://img.shields.io/badge/AI-Agentic%20Automation-blueviolet?style=for-the-badge)

### ⚡ AI-Powered Workflow Automation Platform with Multi-Agent Orchestration

Transform natural language prompts into executable workflow graphs with real-time AI agents, third-party integrations, and live execution monitoring.

</div>

---

# 📌 Overview

**Agentflow AI** is a full-stack AI Operations Automation Platform that enables operators to describe automations in plain English and instantly convert them into executable visual workflows.

The platform combines:

* 🧠 AI-powered workflow generation
* 🤖 Multi-agent orchestration
* 🔗 Third-party integrations
* ⚡ Real-time execution streaming
* 📊 Workflow observability
* 🔒 Secure OAuth integrations
* 🧩 Drag-and-drop workflow editing

The system behaves similarly to platforms like **n8n**, **Zapier**, and **Make.com**, but introduces an advanced **Agentic Execution Layer** powered by AI agents.

---

# ✨ Core Features

## 🔐 Authentication & Security

* JWT-based authentication
* Protected routes
* Persistent sessions using Zustand
* Role-based access control (Admin / Operator)
* Password hashing with bcrypt (cost 12)
* Helmet security headers
* Request validation using express-validator
* OAuth credential encryption at rest

---

## 🧠 AI Workflow Generation

Generate complete workflows from natural language prompts.

### Example Prompt

```txt
When a customer submits a form:
1. Send a Slack notification
2. Append details to Google Sheets
3. Send confirmation email
```

### Generated Output

✅ Workflow Graph
✅ Nodes & Edges
✅ Execution Configuration
✅ Retry Logic
✅ Real-Time Monitoring

### AI Provider Fallback Chain

```txt
OpenRouter → Gemini → Deterministic Builder
```

Even without AI API keys, the deterministic engine generates runnable workflows.

---

# 🤖 Multi-Agent Orchestration

The execution engine runs workflows through a chain of cooperating AI agents.

| Agent            | Responsibility                                |
| ---------------- | --------------------------------------------- |
| Planner Agent    | Determines execution order & confidence score |
| Execution Agent  | Executes workflow nodes                       |
| Validation Agent | Validates outputs                             |
| Recovery Agent   | Handles failures & retries                    |
| Monitoring Agent | Streams timeline events                       |

### Failure Types

```txt
MISSING_FIELDS
API_FAILURE
AUTH_EXPIRED
RATE_LIMIT
TRANSIENT
```

### Recovery Actions

```txt
retry_with_backoff
escalate
```

---

# 🎨 Visual Workflow Builder

Built using **React Flow** for an interactive drag-and-drop workflow experience.

## Features

* Drag nodes from palette
* Connect workflows visually
* Configure nodes dynamically
* Animated workflow edges
* Real-time execution status
* AI-generated graph preview
* Node configuration side panel
* Workflow validation system

---

# 🔗 Third-Party Integrations

## Supported Providers

| Provider      | Features                |
| ------------- | ----------------------- |
| Gmail         | Send & Read Emails      |
| Slack         | Send Messages & Events  |
| Discord       | Bot Notifications       |
| Google Sheets | Append Rows & Read Data |

## OAuth Support

Each provider includes:

* OAuth Start Endpoint
* OAuth Callback Endpoint
* Connection Status Monitoring
* Token Expiration Tracking
* Encrypted Credential Storage

---

# ⚡ Real-Time Execution System

Using **Socket.IO** + **BullMQ**.

## Features

* Live execution timelines
* Agent event streaming
* Background job processing
* Retry with exponential backoff
* Workflow pause/resume/cancel
* Execution observability
* Real-time notifications

---

# 📊 Execution Lifecycle

```txt
PENDING
RUNNING
RETRYING
PAUSED
COMPLETED
FAILED
CANCELLED
```

Each execution stores:

* Workflow snapshot
* Execution logs
* Input/Output payloads
* Retry count
* Error details
* Execution duration
* Timeline events

---

# 🏗️ Tech Stack

# Frontend

| Technology       | Usage                  |
| ---------------- | ---------------------- |
| Next.js          | Frontend Framework     |
| React 19         | UI Development         |
| Tailwind CSS     | Styling                |
| React Flow       | Workflow Canvas        |
| Zustand          | State Management       |
| Axios            | API Requests           |
| Socket.IO Client | Realtime Communication |
| Lucide React     | Icons                  |

---

# Backend

| Technology  | Usage                 |
| ----------- | --------------------- |
| Node.js     | Runtime               |
| Express.js  | API Server            |
| MongoDB     | Database              |
| Mongoose    | ODM                   |
| JWT         | Authentication        |
| BullMQ      | Queue System          |
| Redis       | Background Jobs       |
| Socket.IO   | Realtime Events       |
| bcryptjs    | Password Hashing      |
| Helmet      | Security              |
| Compression | Response Optimization |

---

# AI & Orchestration

| Technology     | Usage                 |
| -------------- | --------------------- |
| OpenRouter API | Primary AI Provider   |
| Google Gemini  | Fallback AI Provider  |
| LangChain      | AI Tooling            |
| LangGraph      | Agentic Orchestration |

---

# 📁 Project Structure

```bash
Agentflow_AI/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       ├── services/
│       ├── hooks/
│       └── styles/
│
├── server/
│   └── src/
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── agents/
│       ├── integrations/
│       ├── queues/
│       ├── middleware/
│       ├── models/
│       └── utils/
│
├── README.md
└── package.json
```

---

# 📄 Database Collections

| Collection    | Purpose                     |
| ------------- | --------------------------- |
| Users         | User authentication & roles |
| Workflows     | Workflow graph storage      |
| Executions    | Workflow execution sessions |
| ExecutionLogs | Timeline & observability    |
| Integrations  | OAuth provider credentials  |
| Notifications | Realtime alerts             |
| AgentMemory   | Persistent AI agent memory  |

---

# 🌐 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Workflows

```http
GET    /api/workflows
POST   /api/workflows
POST   /api/workflows/generate
GET    /api/workflows/:id
PUT    /api/workflows/:id
DELETE /api/workflows/:id
POST   /api/workflows/:id/execute
```

## Executions

```http
GET  /api/executions
GET  /api/executions/:id
GET  /api/executions/:id/timeline
POST /api/executions/:id/pause
POST /api/executions/:id/resume
POST /api/executions/:id/cancel
```

## Integrations

```http
GET /api/integrations
GET /api/integrations/status
GET /api/integrations/oauth/:provider/start
GET /api/integrations/oauth/:provider/callback
```

---

# 🎯 Frontend Pages

| Route                | Description                  |
| -------------------- | ---------------------------- |
| `/`                  | Landing Page                 |
| `/login`             | User Login                   |
| `/register`          | User Registration            |
| `/dashboard`         | Workflow Analytics Dashboard |
| `/workflows/builder` | AI Workflow Builder          |
| `/workflows/[id]`    | Workflow Editor              |
| `/executions`        | Execution Timeline           |
| `/integrations`      | OAuth Integrations           |
| `/settings`          | User Settings                |

---

# 🔒 Security Features

* Password hashing using bcrypt
* JWT authentication
* OAuth token encryption
* Request validation
* Rate limiting
* Secure CORS handling
* Protected API routes
* Explicit integration failure handling

---

# 🚀 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Sairohith-sde/Agentflow_AI.git
cd Agentflow_AI
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
CLIENT_URL=http://localhost:3000

OPENROUTER_API_KEY=your_key
GEMINI_API_KEY=your_key

CREDENTIAL_ENCRYPTION_KEY=your_encryption_key
```

---

# ▶️ Run Development Servers

## Frontend

```bash
npm run dev
```

## Backend

```bash
npm run dev
```

---

# 📡 Workflow Execution Flow

```txt
Natural Language Prompt
        ↓
AI Workflow Generator
        ↓
Workflow Graph Creation
        ↓
React Flow Visualization
        ↓
Planner Agent
        ↓
Execution Agent
        ↓
Validation Agent
        ↓
Recovery Agent
        ↓
Monitoring Agent
        ↓
Live Timeline Streaming
```

---

# 🧩 Development Roadmap

## ✅ Phase 1

* Project Initialization
* Authentication System
* Database Setup
* Protected Routes

## ✅ Phase 2

* Workflow CRUD
* React Flow Builder
* Dashboard Analytics

## ✅ Phase 3

* AI Workflow Generation
* Prompt Parsing
* Fallback Builder

## ✅ Phase 4

* Multi-Agent Orchestration
* Execution Engine
* Retry Handling

## ✅ Phase 5

* OAuth Integrations
* Token Encryption
* Provider Management

## ✅ Phase 6

* BullMQ Queues
* Socket.IO Streaming
* Real-Time Notifications

---

# 🎯 Final Goal

The final platform enables operators to:

✅ Describe workflows in plain English
✅ Generate executable workflow graphs
✅ Execute workflows using AI agents
✅ Monitor execution in real time
✅ Recover failures automatically
✅ Integrate with external services
✅ Maintain complete audit trails

---

# 📸 Future Enhancements

* Multi-user collaboration
* AI workflow optimization
* Workflow marketplace
* Custom node SDK
* Kubernetes deployment
* Vector memory support
* Multi-tenant architecture
* AI analytics dashboard

---

# 🤝 Contributing

Contributions are welcome!

```bash
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
```

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

### Pothuganti Sai Rohith

AI Enthusiast • Full Stack Developer • AIML Student

---

<div align="center">

### ⭐ If you like this project, give it a star on GitHub ⭐

</div>
