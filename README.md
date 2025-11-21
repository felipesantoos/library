# Library - Reading Management Desktop Application

A private desktop application for managing reading books, sessions, notes, goals, and statistics.

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Rust + Tauri v2
- **Database**: SQLite (via Rusqlite)
- **Architecture**: Ports & Adapters (Hexagonal Architecture)

## Project Status

### Phase 0: Foundation & Setup

#### ✅ 0.1 Project Setup - COMPLETED
- [x] Tauri v2 project initialized
- [x] React + TypeScript + Vite configured
- [x] Tailwind CSS setup
- [x] Project folder structure created
- [x] Basic configuration files

#### ✅ 0.2 Rust Backend Architecture - IN PROGRESS
- [x] Domain Layer:
  - [x] Entities: Book, ReadingSession, Note, Goal, Reading
  - [x] Value Objects: (structure created)
  - [x] Domain Services: ProgressCalculator, StatisticsCalculator
- [x] Ports Layer:
  - [x] Repository traits: BookRepository, SessionRepository, NoteRepository, GoalRepository
  - [x] Service port traits: (structure created)
- [x] Application Layer:
  - [x] Use cases structure created
  - [x] DTOs structure created
- [x] Infrastructure Layer:
  - [x] Database connection and migrations
  - [x] SQLite repository implementations: Book, Session, Note, Goal
  - [x] Service implementations: (structure created)
- [ ] Adapters Layer:
  - [ ] Tauri command handlers
  - [ ] Dependency injection setup

#### ⏳ 0.3 Theme System - PENDING
- [ ] Tailwind CSS configuration
- [ ] Theme tokens
- [ ] ThemeProvider component

#### ⏳ 0.4 Core UI Primitives - PENDING
- [ ] AppShell component
- [ ] Sidebar component
- [ ] TopBar component
- [ ] Layout primitives
- [ ] Typography components
- [ ] React Router setup

## Getting Started

### Prerequisites
- Node.js (v18+)
- Rust (latest stable)
- Tauri CLI: `npm install -g @tauri-apps/cli`

### Installation

```bash
# Install dependencies
npm install

# Development
npm run tauri:dev

# Build
npm run tauri:build
```

## Project Structure

```
library/
├── src/                      # Frontend (React/TypeScript)
│   ├── components/          # UI components
│   ├── pages/               # Screen-level pages
│   ├── hooks/               # React hooks
│   ├── theme/               # Theme system
│   └── lib/                 # Utilities
├── src-tauri/               # Backend (Rust/Tauri)
│   └── src/
│       ├── domain/          # Domain layer (entities, services)
│       ├── ports/           # Ports layer (traits/interfaces)
│       ├── application/     # Application layer (use cases, DTOs)
│       ├── infrastructure/  # Infrastructure layer (repositories, services)
│       └── adapters/        # Adapters layer (Tauri commands)
├── docs/                    # Documentation
└── schema.sql               # Database schema
```

## Architecture

This project follows **Ports & Adapters (Hexagonal Architecture)**:

1. **Domain Layer**: Pure business logic, no external dependencies
2. **Ports Layer**: Traits/interfaces defining contracts
3. **Application Layer**: Use cases orchestrating domain logic
4. **Infrastructure Layer**: Concrete implementations (SQLite, file system)
5. **Adapters Layer**: Tauri commands (API layer)

## Development Progress

See [Implementation Tasks and Phases.md](./docs/Implementation%20Tasks%20and%20Phases.md) for detailed progress.

## License

Private project

