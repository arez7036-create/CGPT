# AGENTS.md - CGPT Development Guide

## Project Overview
CGPT is a ChatGPT-like AI chat platform built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. It supports multiple LLM providers (OpenAI, Anthropic, Google, Groq, OpenRouter) with a secure server-side architecture.

## Project Structure
```
cgpt/
├── src/
│   ├── components/          # React components (Header, Logo, MessageList, MessageInput, etc.)
│   ├── components/ui/       # shadcn/ui components
│   ├── context/             # React Context providers (ChatContext, ArenaContext)
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utility functions (utils.ts, tokenizer.ts, prisma.ts)
│   ├── pages/               # Page components (Index, ChatPage, TemplatesPage)
│   ├── services/            # API services (apiService, audioService, dbService)
│   ├── services/api/chat/   # Provider-specific API handlers
│   ├── types/               # TypeScript type definitions
│   ├── assets/              # SVG logos and images
│   ├── index.css            # Global styles (Tailwind CSS)
│   └── main.tsx             # React entry point
├── public/                  # Static assets (favicon, og images)
├── prisma/                  # Database schema
├── server.ts                # Express backend (secure API proxy)
├── vite.config.ts           # Vite config + Vite middleware
├── compose.yml              # Docker Compose
├── dockerfile               # Dockerfile for production
└── package.json             # Dependencies and scripts
```

## Key Commands
```bash
# Install dependencies
npm install

# Development (starts both frontend and backend)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Start server only
npm run server

# Frontend only
npm run frontend
```

## Environment Variables
- API keys are **server-side only** (no VITE_ prefix)
- Copy `.env.example` to `.env` and fill in your keys
- At least one provider API key is required (OpenAI recommended for best results)

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express server (`server.ts`) acts as a secure proxy
- API keys are never exposed to the browser
- Database: SQLite via Prisma ORM (conversations and messages)
