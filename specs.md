Project Overview
Build a full-stack AI Operations Automation Platform called Agentic AI Automation Platform (Agentflow_AI) that lets operators describe an automation in natural language and turn it into an executable visual workflow. The platform must generate workflow graphs from prompts, render those graphs on a drag-and-drop canvas, execute them through a chain of cooperating AI agents, integrate with real third-party tools (Gmail, Slack, Discord, Google Sheets) over OAuth, queue and retry background jobs, stream live execution events to the browser, and persist a full timeline of every step for auditing.

Tech Stack
Frontend uses Next.js (Pages Router), React 19, Tailwind CSS, Zustand, Axios, React Flow (@xyflow/react), Socket.IO client, and lucide-react icons. Backend uses Node.js, Express, MongoDB, Mongoose, JSON Web Tokens, BullMQ on Redis (via ioredis), Socket.IO, helmet, morgan, compression, express-validator, and bcryptjs. AI integration is done through the OpenRouter API and the Google Generative AI SDK, with LangChain and LangGraph available for agentic orchestration. OAuth and bot integrations cover Gmail, Slack, Discord, and Google Sheets. Sensitive credentials are encrypted at rest with an application-level key.

Core Features
Authentication
The authentication system must support registration, login, JWT-based session handling, protected routes, an /auth/me profile endpoint, role separation between admin and operator, password hashing with bcrypt at cost 12, and persistent login state on the client through Zustand.

Workflow Management
For workflow management, users must be able to create workflows manually, generate workflows from a natural-language prompt, list and search their workflows, open any workflow on a React Flow canvas, drag nodes from a palette, configure each node through a side panel, save, duplicate, version, and delete workflows, and trigger executions on demand. Every workflow stores its nodes, edges, trigger configuration, tags, and version number.

Agentic Orchestration
For agentic execution, the backend must run each workflow through a fixed chain of agents: a planner agent that decides the node ordering and emits a confidence score, an execution agent that runs each node against the correct integration or AI provider, a validation agent that verifies required output fields, a recovery agent that classifies failures (MISSING_FIELDS, API_FAILURE, AUTH_EXPIRED, RATE_LIMIT, TRANSIENT) and decides between retry_with_backoff and escalate, and a monitoring agent that emits timeline events. LangGraph must be importable as the orchestration substrate, and the orchestrator must report langGraph: 'available' | 'not-installed' with each run.

Third-Party Integrations
The integrations layer must support Gmail (send and read mail), Slack (post messages and subscribe to events), Discord (post bot messages), and Google Sheets (append rows and read ranges). Each provider must support an OAuth start endpoint, an OAuth callback endpoint, and a connected/disconnected status. Access tokens and refresh tokens must be encrypted at rest using CREDENTIAL_ENCRYPTION_KEY. The connection state must be visible from the integrations page, and a missing or expired credential must surface as a clear INTEGRATION_NOT_CONNECTED or AUTH_EXPIRED error in the execution timeline rather than a silent failure.

Execution Engine
For execution, the backend must persist every run as an Execution document with one of PENDING, RUNNING, COMPLETED, FAILED, RETRYING, PAUSED, or CANCELLED status, record the workflow snapshot at run time, capture input, output, error, duration, and retry count, and write one ExecutionLog row per agent event. Users must be able to pause, resume, and cancel a running execution. BullMQ on Redis must handle background scheduling and retry backoff, with an in-memory fallback when Redis is not configured.

AI Workflow Generation
For AI workflow generation, the user submits a prompt and the system must return a complete workflow with named nodes, positions, edges, and per-node configuration. The generator must prefer OpenRouter when OPENROUTER_API_KEY is set, fall back to Google Gemini when GEMINI_API_KEY is set, and fall back to a deterministic rule-based builder when neither is available. The deterministic builder must still produce a runnable graph for common prompts (send email, invoice routing, Slack/Discord notification, sheet append). The available node catalog is grouped into triggers, actions, AI nodes, and logic nodes.

Real-Time Layer
The Socket.IO server must broadcast agent events (planner, execution, validation, recovery, monitoring) for each execution to subscribed clients, and the client must render those events as a live timeline. Notifications generated during execution (success, failure, escalation) must persist and appear in a notifications drawer.

Complete Specification - Frontend Pages
The application uses the Next.js Pages Router. The root / page redirects authenticated users to the dashboard and unauthenticated users to login.

/ - is the landing page with platform introduction, AI workflow automation overview, multi-agent orchestration explanation, workflow generation showcase, CTA buttons, feature sections, responsive layout, authentication-aware redirects, and dark theme support

/login - provides the login form with email and password authentication, JWT-based authentication flow, Zustand auth store persistence, form validation, loading states, redirect after login, and authentication error handling

/register - provides the registration form with user account creation, password validation, JWT authentication flow, Zustand session persistence, loading states, and registration error handling

/dashboard - displays the operator console with workflow metrics, active workflow statistics, recent execution summaries, success rate indicators, recent workflow lists, AI reasoning activity feeds, real-time execution events, responsive metric cards, and dashboard analytics panels. The dashboard must include a MetricGrid component, AppShell layout, workflow summary cards, and an AI activity panel

/workflows/builder - is the AI-powered prompt-to-workflow generation page with automation prompt input, AI workflow graph generation, React Flow canvas rendering, workflow preview support, graph editing capabilities, workflow validation, save workflow functionality, execution trigger support, and multi-agent orchestration visualization. Required components are WorkflowCanvas, PromptInputPanel, GraphPreviewPanel, and WorkflowToolbar

/workflows/[id] - is the full workflow editor with a node palette on the left, React Flow workflow canvas in the center, and node configuration panel on the right. The page includes node editing, workflow connections, workflow execution controls, execution logs, workflow metadata, validation support, retry execution support, and real-time execution monitoring

/executions - lists all workflow executions with execution status, execution duration, timeline links, execution logs, success and failure indicators, retry execution support, filtering, sorting, pagination, and live execution updates through Socket.IO

/integrations - lists all supported providers including Gmail, Slack, Discord, and Google Sheets with integration connection status, OAuth connection flow, reconnect functionality, integration testing support, provider configuration management, and enable or disable toggling for each integration

/settings- provides user profile management, role information, API key status monitoring, encryption key health checks, credential management, notification preferences, theme settings, security controls, and logout support

Complete Specification - Backend Architecture and Database Collections
Backend Architecture
The routes layer handles HTTP routing, request validation via express-validator, and middleware composition (auth, validation, error handler). The controllers layer handles request parsing and response shaping only - it never talks to Mongo directly. The services layer owns business logic: workflow CRUD, execution lifecycle, integration token management, retry classification, notification creation, AI generation, and log aggregation. The agents layer holds the planner, execution, validation, recovery, monitoring, and orchestrator modules. The integrations layer wraps each third-party SDK behind a common interface defined in baseIntegration.js. The queues layer wraps BullMQ and Redis. The config layer centralizes environment loading, Mongo connection (with in-memory fallback), and Socket.IO bootstrapping.

Database Collections
• Users - stores authenticated platform users with name, email, hashed password using select: false, role-based access control (admin | operator), last login tracking, JWT authentication support, account activity timestamps, and secure credential management

• Workflows - stores AI-generated and manually created workflows with workflow name, description, owner reference, workflow status management (draft | active | paused | archived), workflow trigger configuration, React Flow nodes and edges, workflow versioning, workflow tags, execution history tracking, last execution timestamp, and workflow lifecycle management

• Executions - stores workflow execution sessions with workflow reference, immutable workflow snapshot storage, execution status tracking, current node execution tracking, execution start and completion timestamps, execution duration calculation, workflow input and output payloads, execution error handling, retry count management, and execution audit history

• ExecutionLogs - stores detailed execution timeline events with execution reference, workflow reference, node tracking, responsible AI agent identification, structured log levels (info | warning | error | success), execution event types, log messages, metadata payloads, debugging information, and real-time execution observability support

• Integrations - stores third-party integration configurations with workflow owner reference, supported provider configuration (gmail | slack | google-sheets | discord | openrouter | gemini), OAuth connection status, provider scopes, encrypted access token storage, encrypted refresh token storage, token expiration management, integration error tracking, and secure credential lifecycle management

• Notifications - stores user notification events with owner reference, workflow reference, execution reference, notification type, notification title, notification message, read and unread status tracking, execution alerts, workflow activity updates, and real-time system notification support

• AgentMemory - stores persistent multi-agent orchestration memory with workflow reference, execution reference, agent identification, memory key-value storage, confidence scoring, contextual execution memory, inter-agent shared context support, and persistent agent reasoning state management

Complete Specification - API Endpoints
Health and Auth
• GET /api/health - provides the backend service heartbeat endpoint with API availability checks, uptime verification, server status monitoring, environment validation, and health response metadata for deployment monitoring

• POST /api/auth/register - provides user account registration with email and password validation, hashed password storage, JWT authentication support, role assignment, duplicate account prevention, validation error handling, and secure user onboarding

• POST /api/auth/login - provides user authentication with email and password verification, JWT token issuance, authentication validation, login error handling, secure session generation, and last login timestamp updates

• GET /api/auth/me - returns the authenticated user profile with JWT verification, role information, account metadata, session validation, and protected route authentication support

Workflows
• GET /api/workflows/dashboard - provides aggregated workflow dashboard metrics including total workflows, active workflows, execution statistics, success rates, recent workflow activity, execution summaries, and AI orchestration analytics data

• GET /api/workflows - lists all workflows owned by the authenticated user with workflow filtering, pagination, sorting, workflow metadata, workflow status management, and ownership validation

• POST /api/workflows - creates workflows manually with workflow validation, node and edge configuration, workflow metadata management, workflow ownership assignment, and persistent workflow storage

• POST /api/workflows/generate - generates workflows from natural-language prompts using AI-powered workflow graph generation, prompt parsing, multi-agent orchestration logic, workflow validation, fallback generation support, and structured workflow output

• GET /api/workflows/:id - returns a single workflow with workflow metadata, node structures, edge connections, workflow configuration, ownership validation, execution history references, and workflow status details

• PUT /api/workflows/:id - updates workflow configuration with node editing, edge updates, workflow validation, version management, workflow metadata updates, and persistent workflow modification support

• POST /api/workflows/:id/duplicate - clones an existing workflow with duplicated node structures, edge configurations, workflow metadata replication, ownership reassignment, and workflow version initialization

• POST /api/workflows/:id/execute - executes workflows through the multi-agent orchestration engine with workflow validation, execution queue creation, agent coordination, execution timeline tracking, retry support, and real-time execution monitoring

• DELETE /api/workflows/:id - deletes workflows with ownership validation, workflow cleanup, execution reference handling, and secure workflow removal

Executions
• GET /api/executions - lists all workflow executions with execution status, workflow references, execution duration, filtering, sorting, pagination, retry counts, execution metadata, and real-time execution monitoring support

• GET /api/executions/:id - returns detailed execution information with workflow snapshots, execution outputs, execution errors, node execution states, execution duration metrics, retry information, and execution lifecycle metadata

• GET /api/executions/:id/timeline - returns per-agent execution timeline events with execution logs, workflow progress tracking, node transitions, agent activity monitoring, orchestration events, execution observability data, and real-time execution timeline support

• POST /api/executions/:id/pause - pauses active workflow executions with execution state persistence, queue suspension handling, agent coordination management, execution lifecycle updates, and workflow state synchronization

• POST /api/executions/:id/resume - resumes paused workflow executions with execution recovery support, queue reactivation, agent state restoration, execution continuation handling, and workflow lifecycle synchronization

• POST /api/executions/:id/cancel - cancels running workflow executions with execution termination logic, queue cleanup, agent shutdown coordination, execution status updates, cancellation event logging, and workflow cleanup handling

Integrations
• GET /api/integrations - lists all connected integrations for the authenticated user with provider metadata, OAuth connection status, integration configuration details, token availability status, and provider connection monitoring support

• GET /api/integrations/status - returns per-provider integration health summaries with provider availability checks, OAuth validation, token expiration monitoring, integration diagnostics, connection status tracking, and provider health analytics

• GET /api/integrations/oauth/:provider/start - initiates the OAuth authentication flow for supported providers with redirect generation, provider scope configuration, state validation, secure authorization handling, and provider-specific authentication setup

• GET /api/integrations/oauth/:provider/callback - processes OAuth callback responses with authorization code validation, encrypted token storage, provider account linking, integration persistence, token lifecycle handling, and authentication error management

• GET /api/integrations/oauth/error - provides OAuth error handling responses with integration failure messaging, provider error details, retry guidance, authentication troubleshooting support, and failed integration diagnostics

• POST /api/integrations - creates or updates integration configurations with provider validation, encrypted credential storage, token management, integration status updates, secure provider connection handling, and persistent integration configuration support

Notifications
GET /api/notifications
list notifications for the current user.
Folder Structure
Frontend Structure
1234567891011
client/└── src/    ├── components/    │   ├── AppShell/    │   ├── MetricGrid/    │   ├── NodePalette/    │   ├── NodeConfigPanel/    │   ├── WorkflowCanvas/    │   └── ProtectedRoute/    │    ├── pages/ 
Expand
Backend Structure
1234567891011
server/└── src/    ├── config/    │   ├── env.js    │   ├── db.js    │   └── socket.js    │    ├── routes/    │   ├── authRoutes.js    │   ├── workflowRoutes.js    │   ├── executionRoutes.js 
Expand
Development Phases
• Phase 1 - implements frontend and backend project initialization with Next.js and Express setup, MongoDB database connection with in-memory fallback support, JWT authentication flow, protected route middleware, Zustand auth persistence, AppShell layout structure, environment configuration, and secure authentication handling

• Phase 2 - implements workflow CRUD operations, workflow dashboard metrics, workflow listing and management, React Flow workflow canvas integration, drag-and-drop workflow editing, node palette system, node configuration panel, workflow persistence, and workflow validation support

• Phase 3 - implements AI-powered workflow generation using OpenRouter as the primary model provider, Gemini as the fallback provider, deterministic rule-based fallback generation, prompt-to-workflow graph generation, AI orchestration logic, structured workflow output validation, and builder page integration

• Phase 4 - implements multi-agent orchestration with planner, execution, validation, recovery, and monitoring agents, workflow execution lifecycle management, execution state tracking, pause and resume execution controls, workflow cancellation handling, execution timeline tracking, and agent coordination workflows

• Phase 5 - implements third-party integrations for Gmail, Slack, Discord, and Google Sheets with OAuth authentication flow, encrypted credential storage, provider token lifecycle management, integration configuration management, provider connection monitoring, and integrations dashboard support

• Phase 6 - implements BullMQ background queues with Redis integration, retry and backoff handling, Socket.IO real-time event streaming, live workflow execution timeline updates, execution observability support, notification drawer integration, and real-time orchestration monitoring

UI and UX Requirements
The UI must use a clean operator-console aesthetic with Tailwind, be fully responsive, include loading states and skeleton loaders, render the workflow graph with React Flow including animated edges, support drag-from-palette node creation, surface a right-hand configuration panel for any selected node, render live execution events in a timeline with color-coded agent badges (planner / execution / validation / recovery / monitoring), and provide a notifications drawer accessible from the AppShell.

Security Requirements
The application must hash passwords with bcrypt at cost 12, sign and verify JWTs with JWT_SECRET, encrypt OAuth access and refresh tokens at rest with CREDENTIAL_ENCRYPTION_KEY, set HTTP security headers via helmet, apply CORS limited to CLIENT_URL, rate-limit auth endpoints via express-rate-limit, validate every request body with express-validator, never log decrypted tokens, and treat any missing or expired credential as an explicit INTEGRATION_NOT_CONNECTED / AUTH_EXPIRED error rather than a generic 500.

Final Expected Outcome
The completed platform must let an operator describe an automation in plain English, watch it materialize as a graph on the canvas, save it, execute it through the agent chain, see each agent event stream in real time, recover or escalate failures automatically, and receive notifications - all backed by real OAuth integrations and a full audit trail in MongoDB. The final application should feel like a modern operations console - close in spirit to n8n or Zapier, but with an explicit agentic execution layer on top.