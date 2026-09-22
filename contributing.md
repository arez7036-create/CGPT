# Contributing to CGPT

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

We expect all contributors to follow our Code of Conduct. Please be respectful and considerate of others when contributing to the project.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/arez7036-create/CGPT.git
   cd cgpt-chat
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/arez7036-create/CGPT.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file based on `.env.example` and add your API keys

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes, following our [coding standards](#coding-standards)
3. Run the development server to test your changes:
   ```bash
   npm run dev
   ```
4. Commit your changes with a descriptive commit message
5. Push your branch to your fork
6. Create a Pull Request from your fork to the main repository

## Pull Request Process

1. Ensure your code follows our coding standards and passes all tests
2. Update the README.md with details of changes if applicable
3. The PR should work in all supported browsers and devices
4. Your PR will be reviewed by maintainers, who may request changes
5. Once approved, your PR will be merged

## Coding Standards

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Run `npm run lint` before submitting

## License

By contributing to CGPT, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have any questions or need help, please open an issue or reach out to the maintainers.

Thank you for contributing to CGPT!
