[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Shadcn](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://shadcn.com)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![CGPT](https://img.shields.io/badge/CGPT-ChatGPT%20AI%20Chat-10a37f?style=for-the-badge)](https://cgpt-chat.com)

# CGPT - ChatGPT-like AI Chat Platform

A modern, customizable open-source AI chatbot interface built with Vite, React, TypeScript, shadcn/ui, Prisma, and Tailwind CSS — designed to provide a ChatGPT-like user experience.

## Features

- **Multi-Provider Support**: Switch between OpenAI, Anthropic, Google, Groq, OpenRouter, and Flowise
- **Google Gemini Web Research**: Real-time research with sources
- **System Prompt Management**: Manage and switch between multiple system prompts
- **Context Window Setting**: Configure how many message pairs to retain
- **Audio Playback**: Automatic voice responses for natural conversations
- **Mermaid Diagrams & Charts**: Render and download diagrams as SVG
- **Boxed/Full Screen Mode**: Toggle between embedded bubble and fullscreen
- **Speech-to-Text & Text-to-Speech**: Voice conversations
- **Customizable Templates**: Choose from three modern themes (Minimal, Vibrant, Elegant)
- **Dark/Light Mode**: Each template supports both variants
- **Conversation Management**: Save, browse, and manage chat histories
- **Token Counter**: See token usage per message
- **Message Streaming**: Real-time responses
- **Responsive Design**: Desktop and mobile support
- **Chat Embedding**: Embed on any webpage with a script tag

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm package manager

### Installation

```bash
git clone https://github.com/arez7036-create/CGPT.git
cd cgpt-chat
npm install
```

### Environment Variables

Copy the example and fill in your keys:

```bash
cp .env.example .env
```

At least one AI provider API key is required (server-side only):

```env
DATABASE_URL="file:./db/dev.db"
OPENAI_API_KEY=your_openai_api_key_here
```

See `.env.example` for all available options.

### Running

```bash
npm run dev
```

Open in your browser to see the application.

## Project Structure

```
cgpt/
├── src/
│   ├── components/          # UI components
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── assets/              # SVG logos
├── public/                  # Static assets
├── prisma/                  # Database schema
├── server.ts                # Express backend (secure API proxy)
├── compose.yml              # Docker Compose
└── package.json
```

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express server (`server.ts`) proxies all API requests
- **Security**: API keys are never exposed to the browser
- **Database**: SQLite via Prisma ORM

## Deployment

### Docker

```bash
docker compose up -d
```

### Production Build

```bash
npm run build
```

## License

This project is licensed under the MIT License.

## Links

- [GitHub Repository](https://github.com/arez7036-create/CGPT)
- [Report Issues](https://github.com/arez7036-create/CGPT/issues)
