# Implementation Tasks and Phases

Complete breakdown of implementation tasks organized by phase, based on all documentation requirements.

---

## Technology Stack

This project uses:
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Rust + Tauri v2
- **Database**: SQLite (via Rusqlite in Rust backend)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router
- **Build**: Tauri CLI for desktop app packaging

### Architecture Overview:
- **Frontend** (React/TypeScript): UI components and pages, calls Tauri commands
- **Backend** (Rust/Tauri): Database operations, file system access, business logic
- **Communication**: Tauri commands (`invoke()`) for frontend ↔ backend communication
- **Database**: SQLite file stored in app data directory, managed by Rust backend

### Key Tauri Features Used:
- Tauri Commands: Rust functions exposed to frontend via `#[tauri::command]`
- Tauri Plugins: File dialogs, file system access, notifications (if needed)
- App Data Directory: Stored database and user data in platform-specific app data folder
- Window Management: Desktop window configuration and controls

---

## Phase 0: Foundation & Setup

### 0.1 Project Setup (Tauri + React + TypeScript + Rust)
- [ ] Initialize Tauri v2 project with React template:
  - [ ] `npm create tauri-app@latest` or use Tauri CLI
  - [ ] Select React + TypeScript template
  - [ ] Configure project name and metadata
- [ ] Set up TypeScript configuration:
  - [ ] `tsconfig.json` for React (ES2020, React JSX, strict mode)
  - [ ] `tsconfig.node.json` for Vite config
- [ ] Configure Vite for Tauri:
  - [ ] Set port to 1420 (Tauri default)
  - [ ] Configure HMR for Tauri dev mode
  - [ ] Ignore `src-tauri` in watch mode
- [ ] Set up development dependencies:
  - [ ] ESLint and Prettier (optional but recommended)
  - [ ] TypeScript, React, React DOM types
- [ ] Create frontend folder structure:
  - [ ] `src/components/ui/` (base design system components)
  - [ ] `src/components/thematic/` (reading-specific components)
  - [ ] `src/features/` or `src/pages/` (screen-level features)
  - [ ] `src/theme/` (design tokens, theme provider)
  - [ ] `src/lib/` or `src/hooks/` (utilities, hooks)
  - [ ] `src/assets/` (icons, images)
  - [ ] `src/types.ts` (TypeScript type definitions)
- [ ] Set up Rust backend structure (`src-tauri/`):
  - [ ] `src-tauri/src/lib.rs` - Main library module with Tauri commands
  - [ ] `src-tauri/src/database.rs` - Database connection and initialization
  - [ ] `src-tauri/src/models.rs` - Rust structs/models for data
  - [ ] `src-tauri/src/main.rs` - Tauri application entry point
  - [ ] `src-tauri/Cargo.toml` - Rust dependencies (rusqlite, serde, chrono, etc.)
- [ ] Configure Tauri:
  - [ ] `src-tauri/tauri.conf.json` - App configuration
  - [ ] Set up capabilities and permissions
  - [ ] Configure app icons
- [ ] Set up version control and gitignore:
  - [ ] Ignore `node_modules/`, `src-tauri/target/`, `dist/`
- [ ] Create package.json with dependencies:
  - [ ] `@tauri-apps/api` and `@tauri-apps/cli`
  - [ ] React, React DOM
  - [ ] TypeScript
  - [ ] Tailwind CSS (if using)
  - [ ] React Router (for navigation)
  - [ ] Lucide React (for icons)

### 0.2 Rust Backend Architecture Setup (Ports & Adapters / Hexagonal)

#### 0.2.1 Project Structure & Dependencies
- [ ] Set up Rust workspace or module structure:
  - [ ] Organize into clear layers: `domain/`, `application/`, `infrastructure/`, `ports/`, `adapters/`
  - [ ] Configure `Cargo.toml` with workspace (if using multi-crate) or modules
- [ ] Add core dependencies to `Cargo.toml`:
  - [ ] `rusqlite` (with `bundled` and `chrono` features) - Database
  - [ ] `chrono` - Date/time handling
  - [ ] `serde` and `serde_json` - Serialization
  - [ ] `thiserror` - Error handling
  - [ ] `anyhow` - Error context
  - [ ] `async-trait` (if using async) or just `trait` - Trait definitions
  - [ ] `dirs` - App data directory
  - [ ] `tauri` v2 - Desktop framework
  - [ ] `tauri-plugin-dialog` - File dialogs
  - [ ] `tauri-plugin-fs` (if needed) - File system operations

#### 0.2.2 Domain Layer (Core Business Logic)
- [ ] Create domain entities (`src-tauri/src/domain/entities/`):
  - [ ] `book.rs` - Book entity with business rules:
    - [ ] `Book` struct with fields (id, title, author, status, etc.)
    - [ ] `BookStatus` enum (not_started, reading, paused, etc.)
    - [ ] Validation logic (e.g., `current_page <= total_pages`)
    - [ ] Domain methods (e.g., `mark_as_reading()`, `calculate_progress()`)
  - [ ] `reading.rs` - Reading entity (for rereads):
    - [ ] `Reading` struct
    - [ ] `ReadingStatus` enum
    - [ ] Business logic for reading cycles
  - [ ] `session.rs` - ReadingSession entity:
    - [ ] `ReadingSession` struct
    - [ ] Validation (end_page >= start_page)
    - [ ] Duration calculation logic
  - [ ] `note.rs` - Note entity:
    - [ ] `Note` struct
    - [ ] `NoteType` enum (note, highlight)
    - [ ] `Sentiment` enum (inspiration, doubt, etc.)
  - [ ] `goal.rs` - Goal entity:
    - [ ] `Goal` struct
    - [ ] `GoalType` enum (pages_monthly, books_yearly, etc.)
    - [ ] Progress calculation logic
- [ ] Create domain value objects (`src-tauri/src/domain/value_objects/`):
  - [ ] `page_number.rs` - Validated page number
  - [ ] `progress_percentage.rs` - Validated percentage (0-100)
  - [ ] `date_range.rs` - Date range with validation
  - [ ] `book_metadata.rs` - Book metadata value object
- [ ] Create domain services (`src-tauri/src/domain/services/`):
  - [ ] `progress_calculator.rs` - Progress calculation business logic
  - [ ] `statistics_calculator.rs` - Statistics calculation logic
  - [ ] `goal_progress_calculator.rs` - Goal progress calculation
  - [ ] `validation_service.rs` - Domain-level validation rules

#### 0.2.3 Ports Layer (Interfaces/Traits)
- [ ] Create repository traits (`src-tauri/src/ports/repositories/`):
  - [ ] `book_repository.rs` - Trait defining book repository interface:
    - [ ] `trait BookRepository: Send + Sync`
    - [ ] Methods: `create()`, `update()`, `delete()`, `find_by_id()`, `find_all()`, `find_by_status()`
  - [ ] `reading_repository.rs` - Reading repository interface
  - [ ] `session_repository.rs` - Session repository interface
  - [ ] `note_repository.rs` - Note repository interface
  - [ ] `goal_repository.rs` - Goal repository interface
  - [ ] `journal_repository.rs` - Journal entry repository interface
  - [ ] `agenda_repository.rs` - Agenda block repository interface
  - [ ] `settings_repository.rs` - Settings repository interface
  - [ ] `backup_repository.rs` - Backup metadata repository interface
- [ ] Create service ports (`src-tauri/src/ports/services/`):
  - [ ] `backup_service.rs` - Backup/restore service interface:
    - [ ] `trait BackupService: Send + Sync`
    - [ ] Methods: `export_full()`, `import_full()`, `validate_backup()`
  - [ ] `export_service.rs` - Export service interface (PDF, Markdown, etc.)
  - [ ] `file_service.rs` - File operations interface
  - [ ] `notification_service.rs` - Notification service interface (if needed)

#### 0.2.4 Application Layer (Use Cases / Application Services)
- [ ] Create use cases (`src-tauri/src/application/use_cases/books/`):
  - [ ] `create_book.rs` - `CreateBookUseCase`:
    - [ ] Input: `CreateBookCommand`
    - [ ] Output: `BookDto`
    - [ ] Orchestrates: validation → repository → domain events
  - [ ] `update_book.rs` - `UpdateBookUseCase`
  - [ ] `delete_book.rs` - `DeleteBookUseCase`
  - [ ] `get_book.rs` - `GetBookUseCase`
  - [ ] `list_books.rs` - `ListBooksUseCase` (with filtering/sorting)
  - [ ] `update_book_status.rs` - `UpdateBookStatusUseCase`
- [ ] Create use cases for other domains:
  - [ ] `application/use_cases/sessions/` - Session use cases
  - [ ] `application/use_cases/notes/` - Note use cases
  - [ ] `application/use_cases/goals/` - Goal use cases
  - [ ] `application/use_cases/statistics/` - Statistics use cases
  - [ ] `application/use_cases/backup/` - Backup use cases
- [ ] Create application services (`src-tauri/src/application/services/`):
  - [ ] `progress_service.rs` - Application-level progress management
  - [ ] `statistics_service.rs` - Statistics aggregation service
  - [ ] `recommendation_service.rs` - Book recommendation logic
- [ ] Create DTOs (`src-tauri/src/application/dtos/`):
  - [ ] `book_dto.rs` - Book data transfer objects
  - [ ] `session_dto.rs` - Session DTOs
  - [ ] `note_dto.rs` - Note DTOs
  - [ ] Converters from domain entities to DTOs

#### 0.2.5 Infrastructure Layer (Adapters)
- [ ] Database infrastructure (`src-tauri/src/infrastructure/database/`):
  - [ ] `connection.rs` - Database connection management:
    - [ ] `DatabaseConnection` struct
    - [ ] Connection pooling (if needed)
    - [ ] Database path management using `dirs` crate
  - [ ] `migrations.rs` - Database migrations:
    - [ ] Migration system (version tracking)
    - [ ] Execute schema.sql on first run
    - [ ] Handle schema updates
  - [ ] `transaction.rs` - Transaction management
- [ ] Repository implementations (`src-tauri/src/infrastructure/repositories/`):
  - [ ] `sqlite_book_repository.rs` - Implements `BookRepository`:
    - [ ] `struct SqliteBookRepository { connection: DatabaseConnection }`
    - [ ] Implements all trait methods using SQL queries
    - [ ] Converts between domain entities and database rows
  - [ ] `sqlite_reading_repository.rs` - Reading repository implementation
  - [ ] `sqlite_session_repository.rs` - Session repository implementation
  - [ ] `sqlite_note_repository.rs` - Note repository implementation
  - [ ] `sqlite_goal_repository.rs` - Goal repository implementation
  - [ ] `sqlite_journal_repository.rs` - Journal repository implementation
  - [ ] `sqlite_agenda_repository.rs` - Agenda repository implementation
  - [ ] `sqlite_settings_repository.rs` - Settings repository implementation
  - [ ] `sqlite_backup_repository.rs` - Backup metadata repository implementation
- [ ] Service implementations (`src-tauri/src/infrastructure/services/`):
  - [ ] `backup_service_impl.rs` - Implements `BackupService`:
    - [ ] Uses repositories to fetch all data
    - [ ] Serializes to JSON using `serde_json`
    - [ ] Uses Tauri dialog for file operations
  - [ ] `file_service_impl.rs` - File operations implementation
  - [ ] `export_service_impl.rs` - PDF/Markdown export implementation

#### 0.2.6 Adapters Layer (Tauri Commands / API Layer)
- [ ] Create Tauri command handlers (`src-tauri/src/adapters/tauri/commands/`):
  - [ ] `book_commands.rs` - Tauri commands for books:
    - [ ] `#[tauri::command] fn create_book(...) -> Result<BookDto, String>`
    - [ ] Calls `CreateBookUseCase`
    - [ ] Handles errors and converts to user-friendly messages
  - [ ] `session_commands.rs` - Session commands
  - [ ] `note_commands.rs` - Note commands
  - [ ] `goal_commands.rs` - Goal commands
  - [ ] `statistics_commands.rs` - Statistics commands
  - [ ] `backup_commands.rs` - Backup commands
- [ ] Create error handling (`src-tauri/src/adapters/tauri/errors.rs`):
  - [ ] Convert domain errors to user-friendly strings
  - [ ] Error mapping for different error types
- [ ] Dependency injection setup (`src-tauri/src/adapters/tauri/mod.rs` or `main.rs`):
  - [ ] Initialize repositories with database connection
  - [ ] Initialize use cases with repository dependencies
  - [ ] Wire up dependencies (dependency injection container or manual wiring)
  - [ ] Register Tauri commands with use cases

#### 0.2.7 Main Entry Point
- [ ] Update `src-tauri/src/main.rs`:
  - [ ] Initialize database connection on app start
  - [ ] Run database migrations
  - [ ] Set up dependency injection
  - [ ] Register Tauri commands
  - [ ] Register Tauri plugins (dialog, fs, etc.)
  - [ ] Configure app window and settings
- [ ] Update `src-tauri/src/lib.rs`:
  - [ ] Re-export command handlers
  - [ ] Module organization
  - [ ] Public API for Tauri

### 0.3 Theme System
- [ ] Set up Tailwind CSS:
  - [ ] Install Tailwind CSS v4 (or v3) and PostCSS
  - [ ] Configure `tailwind.config.js` or use Tailwind v4 CSS-first approach
  - [ ] Set up `postcss.config.js`
  - [ ] Create `src/index.css` with Tailwind directives
- [ ] Create theme tokens (`theme/tokens.ts` or in Tailwind config):
  - [ ] Color palette (light/dark themes) as Tailwind custom colors
  - [ ] Typography scale and font families (Inter, Source Serif Pro, Literata)
  - [ ] Spacing system (24-32px padding, etc.)
  - [ ] Border radius, shadows, transitions
- [ ] Create `theme/ThemeProvider.tsx` (Antique or Minimal theme):
  - [ ] Theme context using React Context API
  - [ ] Theme state (light/dark) with localStorage persistence
  - [ ] Font size context (small/standard/large)
  - [ ] High Focus Mode context
  - [ ] Apply theme classes to root element
- [ ] Configure Tailwind with theme tokens:
  - [ ] Custom colors in Tailwind config
  - [ ] Custom font families
  - [ ] Custom spacing scale
- [ ] Implement font loading:
  - [ ] Use Google Fonts or self-host fonts
  - [ ] Load in `index.html` or via CSS imports
  - [ ] Configure fonts in Tailwind config
- [ ] Create theme toggle component:
  - [ ] Button/switch component to toggle theme
  - [ ] Uses ThemeProvider context
  - [ ] Persists preference to localStorage
  - [ ] Can use Tauri's store plugin for persistence (optional)

### 0.4 Core UI Primitives
- [ ] Install and configure React Router:
  - [ ] `npm install react-router-dom`
  - [ ] Set up routes in `src/App.tsx` or `src/main.tsx`
- [ ] Implement `<AppShell>` component (main layout wrapper):
  - [ ] Wrapper for all pages
  - [ ] Contains Sidebar and TopBar
  - [ ] Main content area
  - [ ] Responsive layout using Tailwind
- [ ] Implement `<Sidebar>` component with navigation:
  - [ ] Fixed sidebar with navigation items
  - [ ] Active route highlighting
  - [ ] Uses React Router's `NavLink` or `Link`
  - [ ] Icons from Lucide React
  - [ ] Collapsible sidebar (optional)
- [ ] Implement `<TopBar>` component with search and actions:
  - [ ] Global search input (placeholder for future search functionality)
  - [ ] Action buttons (+ Add book, Start session)
  - [ ] Today's progress indicator
  - [ ] Keyboard shortcuts indicators
- [ ] Implement layout primitives (using Tailwind classes or components):
  - [ ] `<Container>` - Max-width container with padding
  - [ ] `<Stack>` - Flex column with gap
  - [ ] `<Section>` - Section wrapper with padding and styling
- [ ] Implement typography components:
  - [ ] `<Heading>` (h1, h2, h3 variants) - Using Tailwind typography classes
  - [ ] `<Paragraph>` - Body text component
  - [ ] `<MetaText>` - Small metadata text
  - [ ] All use theme-aware colors
- [ ] Set up routing system:
  - [ ] Define routes in `App.tsx`:
    - [ ] `/` - HomePage
    - [ ] `/library` - LibraryPage
    - [ ] `/book/:id` - BookDetailsPage
    - [ ] `/sessions` - SessionsPage
    - [ ] `/notes` - NotesPage
    - [ ] `/goals` - GoalsAndStatsPage
    - [ ] `/settings` - SettingsPage
  - [ ] Implement route guards if needed
- [ ] Implement basic navigation state management:
  - [ ] Use React Router's location/params for navigation
  - [ ] Create custom hooks for route state if needed
  - [ ] Implement deep linking support

---

## Phase 1: MVP Core Features

### 1.1 Library Management (MVP)
- [ ] Create `features/library/LibraryPage.tsx`
- [ ] Implement book list/grid view toggle
- [ ] Create `<BookGrid>` component (cover grid view)
- [ ] Create `<BookTable>` component (list view)
- [ ] Create `<BookCard>` component (book card with cover, title, author, status, progress)
- [ ] Create `features/library/LibraryFiltersBar.tsx`:
  - [ ] Status filter dropdown
  - [ ] Type filter dropdown
  - [ ] Sort by dropdown
- [ ] Create `features/book-details/BookDetailsPage.tsx`:
  - [ ] Book header section (cover, title, author, metadata)
  - [ ] Progress section with progress bar
  - [ ] Basic tabs structure
- [ ] Create `features/book-form/BookFormPage.tsx`:
  - [ ] Form fields (title, author, genre, type, pages, etc.)
  - [ ] Form validation
  - [ ] Save/cancel actions
- [ ] Implement book operations (following Ports & Adapters architecture):
  - [ ] **Domain Layer**: Ensure `Book` entity has all business logic
  - [ ] **Ports Layer**: Ensure `BookRepository` trait is defined
  - [ ] **Infrastructure Layer**: Implement `SqliteBookRepository`
  - [ ] **Application Layer**: Create use cases:
    - [ ] `CreateBookUseCase` - Uses `BookRepository` and domain validation
    - [ ] `UpdateBookUseCase` - Updates book with validation
    - [ ] `DeleteBookUseCase` - Deletes book with cascade checks
    - [ ] `GetBookUseCase` - Retrieves single book
    - [ ] `ListBooksUseCase` - Lists books with filtering/sorting
  - [ ] **Adapters Layer**: Create Tauri commands in `adapters/tauri/commands/book_commands.rs`:
    - [ ] `#[tauri::command] fn create_book(...) -> Result<BookDto, String>`
      - [ ] Calls `CreateBookUseCase`
      - [ ] Converts domain errors to user-friendly messages
    - [ ] Similar commands for update, delete, get, list
  - [ ] Create React hooks/functions to call Tauri commands:
    - [ ] `src/hooks/useBooks.ts` or `src/lib/books.ts`
    - [ ] Use `invoke()` from `@tauri-apps/api/core` to call Rust commands
    - [ ] Return React hooks like `useBooks()`, `useBook(id)`, etc.
- [ ] Implement book filtering and sorting logic
- [ ] Add status management (update status, track status changes)

### 1.2 Reading Sessions (MVP)
- [ ] Create `features/sessions/SessionsPage.tsx`
- [ ] Create `<SessionsList>` component:
  - [ ] Table/list view of sessions
  - [ ] Display: date, book, pages (start → end), duration
- [ ] Create `features/sessions/SessionActivePage.tsx`:
  - [ ] Book selector
  - [ ] Timer component (start/pause/end)
  - [ ] Page input fields (start page, end page)
  - [ ] Quick notes field
  - [ ] Save session button
- [ ] Implement session operations (following Ports & Adapters architecture):
  - [ ] **Domain Layer**: Ensure `ReadingSession` entity with validation logic
  - [ ] **Ports Layer**: Define `SessionRepository` trait
  - [ ] **Infrastructure Layer**: Implement `SqliteSessionRepository`
  - [ ] **Application Layer**: Create use cases:
    - [ ] `CreateSessionUseCase` - Creates session, updates book progress
    - [ ] `UpdateSessionUseCase` - Updates session, recalculates progress
    - [ ] `DeleteSessionUseCase` - Deletes session, updates progress
    - [ ] `GetSessionsByBookUseCase` - Retrieves sessions for a book
    - [ ] `ListSessionsUseCase` - Lists sessions with filters
  - [ ] **Domain Service**: `ProgressCalculator` to calculate pages read
  - [ ] **Adapters Layer**: Create Tauri commands in `adapters/tauri/commands/session_commands.rs`
  - [ ] Create React hooks/functions:
    - [ ] `src/hooks/useSessions.ts` or `src/lib/sessions.ts`
    - [ ] Use `invoke()` to call Tauri commands
- [ ] Implement timer logic:
  - [ ] Start/pause/resume functionality
  - [ ] Duration calculation
  - [ ] Format time display
- [ ] Link sessions to books (foreign key relationship)
- [ ] Auto-calculate pages read from start/end page

### 1.3 Progress Tracking (MVP)
- [ ] Implement progress calculation service:
  - [ ] `calculateBookProgress(bookId)` - Updates current_page based on sessions
  - [ ] `calculatePercentage(currentPage, totalPages)`
- [ ] Create `<ProgressBar>` component (visual progress indicator)
- [ ] Integrate progress updates when sessions are created/updated
- [ ] Display progress in:
  - [ ] Book cards (LibraryPage)
  - [ ] Book details header
  - [ ] Home page (current book panel)
- [ ] Create simple progress graph component:
  - [ ] Line chart showing progress over time
  - [ ] Display in Book Details → Overview tab
- [ ] Update book `current_page_text` field automatically when sessions change

### 1.4 Notes System (MVP)
- [ ] Create `features/notes/NotesPage.tsx`
- [ ] Create `<NotesList>` component:
  - [ ] List of all notes
  - [ ] Display: book, page, note text preview
  - [ ] Click to open book details
- [ ] Create note form component (modal or page):
  - [ ] Book selector
  - [ ] Page input
  - [ ] Note text area
  - [ ] Save/cancel buttons
- [ ] Implement notes operations (following Ports & Adapters architecture):
  - [ ] **Domain Layer**: Ensure `Note` entity with type and sentiment validation
  - [ ] **Ports Layer**: Define `NoteRepository` trait with filtering methods
  - [ ] **Infrastructure Layer**: Implement `SqliteNoteRepository`
  - [ ] **Application Layer**: Create use cases:
    - [ ] `CreateNoteUseCase` - Creates note with validation
    - [ ] `UpdateNoteUseCase` - Updates note
    - [ ] `DeleteNoteUseCase` - Deletes note
    - [ ] `GetNotesByBookUseCase` - Retrieves notes for a book
    - [ ] `SearchNotesUseCase` - Full-text search with filters
  - [ ] **Adapters Layer**: Create Tauri commands in `adapters/tauri/commands/note_commands.rs`
  - [ ] Create React hooks/functions:
    - [ ] `src/hooks/useNotes.ts` or `src/lib/notes.ts`
    - [ ] Use `invoke()` to call Tauri commands
- [ ] Implement note filtering:
  - [ ] Filter by book
  - [ ] Basic text search
- [ ] Add notes tab to Book Details page
- [ ] Display notes in Book Details → Notes tab

### 1.5 Goals & Statistics (MVP)
- [ ] Create `features/goals/GoalsAndStatsPage.tsx`
- [ ] Implement goals section:
  - [ ] Goal form (monthly pages goal)
  - [ ] Goal progress display (percentage, visual bar)
  - [ ] Edit goal functionality
- [ ] Create `<GoalCard>` component:
  - [ ] Goal type and target
  - [ ] Current progress
  - [ ] Progress bar
  - [ ] Edit button
- [ ] Implement goals operations (following Ports & Adapters architecture):
  - [ ] **Domain Layer**: Ensure `Goal` entity with type and period validation
  - [ ] **Ports Layer**: Define `GoalRepository` trait
  - [ ] **Infrastructure Layer**: Implement `SqliteGoalRepository`
  - [ ] **Application Layer**: Create use cases:
    - [ ] `CreateGoalUseCase` - Creates goal with validation
    - [ ] `UpdateGoalUseCase` - Updates goal
    - [ ] `GetActiveGoalsUseCase` - Retrieves active goals
    - [ ] `CalculateGoalProgressUseCase` - Uses `GoalProgressCalculator` domain service
  - [ ] **Domain Service**: `GoalProgressCalculator` - Pure business logic for progress calculation
  - [ ] **Adapters Layer**: Create Tauri commands in `adapters/tauri/commands/goal_commands.rs`
  - [ ] Create React hooks/functions:
    - [ ] `src/hooks/useGoals.ts` or `src/lib/goals.ts`
    - [ ] Use `invoke()` to call Tauri commands
- [ ] Implement basic statistics calculation:
  - [ ] `getPagesReadThisMonth()`
  - [ ] `getTotalPagesRead()`
  - [ ] `getPagesPerMonth()` - For graph data
- [ ] Create simple statistics graphs:
  - [ ] Pages per month line chart
  - [ ] Total pages counter
- [ ] Display monthly goal on Home screen

### 1.6 Home Screen (MVP)
- [ ] Create `features/home/HomePage.tsx`
- [ ] Create `<CurrentBookPanel>` component:
  - [ ] Book cover thumbnail
  - [ ] Title and author
  - [ ] Status badge
  - [ ] Progress bar and text (page X of Y, Z%)
  - [ ] "Continue reading" button
  - [ ] "View book" button
- [ ] Create `<TodayProgressPanel>` component:
  - [ ] Time read today
  - [ ] Pages read today
- [ ] Create `<MonthGoalPanel>` component:
  - [ ] Monthly goal value
  - [ ] Progress percentage
  - [ ] Progress bar
- [ ] Create `<WeekSummaryPanel>` component:
  - [ ] Days of week with reading indicators
  - [ ] Total sessions this week
  - [ ] Total pages this week
- [ ] Implement home data fetching:
  - [ ] `getCurrentBook()` - Book with status "reading"
  - [ ] `getTodayProgress()` - Sessions from today
  - [ ] `getWeekSummary()` - Sessions from this week
- [ ] Layout: Grid system for panels

### 1.7 Settings (MVP)
- [ ] Create `features/settings/SettingsPage.tsx`
- [ ] Create settings sidebar navigation (internal tabs)
- [ ] Implement Appearance section:
  - [ ] Theme toggle (light/dark)
  - [ ] Theme persistence
- [ ] Implement Data section:
  - [ ] Export full backup button
  - [ ] Export functionality (calls backup service)
- [ ] Implement settings storage (following Ports & Adapters architecture):
  - [ ] **Domain Layer**: Create `Setting` value object or entity
  - [ ] **Ports Layer**: Define `SettingsRepository` trait
  - [ ] **Infrastructure Layer**: Implement `SqliteSettingsRepository`
  - [ ] **Application Layer**: Create use cases:
    - [ ] `GetSettingUseCase` - Retrieves setting by key
    - [ ] `SetSettingUseCase` - Saves setting
    - [ ] `GetAllSettingsUseCase` - Retrieves all settings
  - [ ] **Adapters Layer**: Create Tauri commands in `adapters/tauri/commands/settings_commands.rs`
  - [ ] Create React hooks:
    - [ ] `src/hooks/useSettings.ts` or `src/lib/settings.ts`
    - [ ] Use `invoke()` to call Tauri commands
    - [ ] Alternative: Use Tauri's `store` plugin for simple key-value (less robust, but simpler)
- [ ] Apply theme changes globally (via theme provider)

---

## Phase 2: Enhanced Features

### 2.1 Advanced Library Features
- [ ] Implement tags system:
  - [ ] Create tags CRUD operations
  - [ ] Create `book_tags` junction table operations
  - [ ] Tag selector component (multi-select)
  - [ ] Tag display in book cards
  - [ ] Filter by tags in LibraryPage
- [ ] Implement collections system:
  - [ ] Create collections CRUD operations
  - [ ] Create `book_collections` junction table operations
  - [ ] Collection selector component
  - [ ] Collections management screen
  - [ ] Filter by collections in LibraryPage
- [ ] Enhance LibraryPage filters:
  - [ ] Multiple filter combinations
  - [ ] Tag filter dropdown
  - [ ] Collection filter dropdown
  - [ ] Advanced search (title, author, notes content)
- [ ] Implement archive functionality:
  - [ ] Archive/restore book actions
  - [ ] Archive screen/tab
  - [ ] Filter archived books out of main library
- [ ] Implement wishlist functionality:
  - [ ] Move book to wishlist
  - [ ] Wishlist screen/tab
  - [ ] Move from wishlist to library
- [ ] Add ISBN import feature (future: API integration)
- [ ] Track book status history (status_changed_at field usage)

### 2.2 Enhanced Sessions
- [ ] Add session notes field (already in schema, wire up UI)
- [ ] Implement session editing:
  - [ ] Edit session form
  - [ ] Update session functionality
  - [ ] Validation before save
- [ ] Implement session deletion:
  - [ ] Delete confirmation dialog
  - [ ] Recalculate book progress after deletion
- [ ] Enhance SessionsPage filters:
  - [ ] Filter by book (dropdown)
  - [ ] Filter by date range (date picker)
  - [ ] Filter by duration range (optional)
- [ ] Create `features/progress/ProgressCorrectionPage.tsx`:
  - [ ] List all sessions for selected book
  - [ ] Inline editing of sessions
  - [ ] Bulk delete sessions
  - [ ] Validation warnings display
  - [ ] Recalculate progress button
- [ ] Implement validation rules:
  - [ ] End page >= start page check
  - [ ] Current page <= total pages check
  - [ ] Date validation (session not in future)
  - [ ] Warning for large gaps in sessions
- [ ] Add progress correction button to Book Details → Sessions tab

### 2.3 Enhanced Notes
- [ ] Add highlight support:
  - [ ] Note type selector (note vs highlight)
  - [ ] Excerpt field for highlights (text that was highlighted)
  - [ ] Display highlights differently in UI
- [ ] Implement sentiment tags:
  - [ ] Sentiment selector (inspiration, doubt, reflection, learning)
  - [ ] Sentiment filter in NotesPage
  - [ ] Sentiment display (badges/icons)
- [ ] Implement note tags:
  - [ ] Create `note_tags` junction table operations
  - [ ] Tag selector for notes
  - [ ] Filter notes by tags
- [ ] Enhance NotesPage:
  - [ ] Filter by sentiment
  - [ ] Filter by tags
  - [ ] Advanced text search (full-text search in notes)
- [ ] Implement notes export:
  - [ ] Export filtered notes to PDF
  - [ ] Export filtered notes to Markdown
  - [ ] Group by book in exported file

### 2.4 Enhanced Progress
- [ ] Implement hybrid progress tracking:
  - [ ] `current_page_text` field updates from sessions
  - [ ] `current_minutes_audio` field updates from sessions
  - [ ] Combined progress calculation (60% overall)
  - [ ] Separate progress display (40% text + 20% audio)
  - [ ] Progress mode toggle (pages vs minutes)
- [ ] Create hybrid progress display component:
  - [ ] Combined progress bar
  - [ ] Separate format indicators
  - [ ] Visual breakdown chart
- [ ] Implement progress comparison for rereads (future, needs rereads system first)
- [ ] Enhanced progress graph:
  - [ ] Show both text and audio progress on same graph
  - [ ] Different colors for each format
- [ ] Add extended statistics:
  - [ ] Most read genres calculation
  - [ ] Average reading speed (pages/day, pages/hour)
  - [ ] Comparisons ("You read 20% more than last month")

### 2.5 Enhanced Goals
- [ ] Add multiple goal types:
  - [ ] Yearly books goal (`books_yearly`)
  - [ ] Daily minutes goal (`minutes_daily`)
  - [ ] Enhanced monthly pages goal (`pages_monthly`)
- [ ] Implement goal period tracking:
  - [ ] Yearly goals (by year)
  - [ ] Monthly goals (by year + month)
  - [ ] Daily goals (no period)
- [ ] Create goal progress calculation for all types:
  - [ ] Pages per month calculation
  - [ ] Books per year calculation
  - [ ] Minutes per day calculation
- [ ] Add personal rankings:
  - [ ] Best months calculation
  - [ ] Best days calculation
  - [ ] Rankings display component
- [ ] Implement goal reminders system (notifications within app)

---

## Phase 3: Advanced Features

### 3.1 Rereads System
- [ ] Implement `book_readings` table integration:
  - [ ] Create reread CRUD operations
  - [ ] `createNewReading(bookId)` - Starts new reading cycle
  - [ ] `getReadingsByBook(bookId)` - Get all reading cycles
  - [ ] `getReadingById(readingId)`
- [ ] Create reread flow UI:
  - [ ] "Start Reread" button in Book Details
  - [ ] Reread confirmation dialog
  - [ ] Automatic creation of new `book_readings` record
- [ ] Update session creation to link to `reading_id`:
  - [ ] Session form shows current reading cycle
  - [ ] Sessions linked to correct reading cycle
- [ ] Create reread comparison view:
  - [ ] Compare sessions between reading cycles
  - [ ] Compare notes between readings
  - [ ] Show difference metrics (e.g., "30% less notes in reread")
- [ ] Update UI to show reread status:
  - [ ] Status display "Completed (2x)" or "Completed + Rereading"
  - [ ] Visual distinction in book cards
  - [ ] Separate session history per reading cycle
- [ ] Update Book Details to show current reading cycle:
  - [ ] Display reading number
  - [ ] Show all reading cycles
  - [ ] Switch between reading cycles view

### 3.2 Reading Journal
- [ ] Create `features/journal/ReadingDiaryPage.tsx`
- [ ] Create `<DiaryTimeline>` component:
  - [ ] Chronological list of entries
  - [ ] Group by date
  - [ ] Display: date, book (optional), content preview
- [ ] Create journal entry editor:
  - [ ] Date picker
  - [ ] Book selector (optional)
  - [ ] Rich text editor or text area
  - [ ] Save/edit/delete actions
- [ ] Implement journal entries CRUD operations:
  - [ ] `createJournalEntry()`
  - [ ] `updateJournalEntry()`
  - [ ] `deleteJournalEntry()`
  - [ ] `getAllJournalEntries()`
  - [ ] `getJournalEntriesByBook()`
- [ ] Add journal filters:
  - [ ] Filter by book
  - [ ] Filter by date range
- [ ] Add journal entry details modal/view

### 3.3 Planning & Agenda
- [ ] Create `features/agenda/AgendaPage.tsx`
- [ ] Create `<AgendaCalendar>` component:
  - [ ] Monthly calendar view
  - [ ] Weekly calendar view (optional)
  - [ ] Display sessions on calendar days
  - [ ] Display planned blocks on calendar days
- [ ] Create agenda block form:
  - [ ] Date picker
  - [ ] Time picker (start/end time)
  - [ ] Book selector (optional)
  - [ ] Notes field
- [ ] Implement agenda blocks CRUD operations:
  - [ ] `createAgendaBlock()`
  - [ ] `updateAgendaBlock()`
  - [ ] `deleteAgendaBlock()`
  - [ ] `getAgendaBlocksByDate()`
  - [ ] `markBlockAsCompleted(blockId, sessionId)`
- [ ] Implement drag-and-drop rescheduling (optional, advanced)
- [ ] Create day details drawer/modal:
  - [ ] Shows all sessions for that day
  - [ ] Shows planned blocks for that day
  - [ ] Total reading time for the day
- [ ] Link completed sessions to agenda blocks (optional auto-linking)

### 3.4 Recommendations System
- [ ] Create `features/suggestions/SuggestionsPage.tsx`
- [ ] Implement "Book of the Week" algorithm:
  - [ ] Select random unstarted book
  - [ ] Preference for user's favorite genres
  - [ ] Display on SuggestionsPage and Home
- [ ] Create mood-based suggestions:
  - [ ] Mood selection UI ("How are you feeling today?")
  - [ ] Mood options (light, reflective, fast, motivational, etc.)
  - [ ] Filter books by mood compatibility
- [ ] Implement recommendation engine:
  - [ ] Analyze most read genres
  - [ ] Analyze favorite authors
  - [ ] Analyze reading patterns (speed, book length preferences)
  - [ ] Suggest books based on analysis
- [ ] Create suggestion cards:
  - [ ] "Based on genres you read most"
  - [ ] "Short books to finish quickly"
  - [ ] "Long books for immersion"
- [ ] Add "Suggestion of the day" to Home page
- [ ] Allow user to change/bookmark suggestions

### 3.5 Reports & Summaries
- [ ] Create `features/reports/ReportsPage.tsx`
- [ ] Implement annual report generation:
  - [ ] Year selector
  - [ ] Calculate: total books, total pages, fastest book, most impactful book
  - [ ] Calculate: dominant genre, most productive day
  - [ ] Generate report cards
- [ ] Create `<YearSummaryGrid>` component:
  - [ ] Display all report cards
  - [ ] Timeline component showing months with completed books
- [ ] Implement book final summary:
  - [ ] Compile all notes and highlights for a book
  - [ ] Generate structured summary (text-based, future: AI-generated)
  - [ ] Display in Book Details → Summary tab
- [ ] Implement mind map generation (advanced, placeholder first):
  - [ ] Extract themes from notes
  - [ ] Visual mind map component (future: use library like d3)
  - [ ] Display in Book Details → Summary tab
- [ ] Implement report export:
  - [ ] Export annual report to PDF
  - [ ] Export book summary to PDF/Markdown
- [ ] Add reread insights comparison:
  - [ ] Compare notes between readings
  - [ ] Show learning differences
  - [ ] Display comparison metrics

### 3.6 Extended Visual Library
- [ ] Create cover wall view:
  - [ ] Grid of all completed book covers
  - [ ] Click to open book details
  - [ ] Optional: filter by year
- [ ] Implement advanced statistics visualizations:
  - [ ] Donut chart for genre distribution
  - [ ] Reading heatmap calendar (GitHub-style)
  - [ ] Bar charts for reading trends
- [ ] Create reading heatmap component:
  - [ ] Calendar grid
  - [ ] Intensity based on reading time/pages
  - [ ] Hover to see day details
  - [ ] Click to see sessions for that day
- [ ] Create visual timeline component:
  - [ ] Giant progress bar with chapters (if chapter data available)
  - [ ] Markers for notes and highlights
  - [ ] Visual representation of reading journey

---

## Phase 4: Polish & Advanced UX

### 4.1 Accessibility Features
- [ ] Implement global font size adjustment:
  - [ ] Font size selector (small, standard, large)
  - [ ] Apply to all text elements globally
  - [ ] Persist in settings
  - [ ] Independent adjustment for titles/body/UI (if needed)
- [ ] Implement line spacing adjustment:
  - [ ] Line spacing slider or selector
  - [ ] Apply to reading areas
  - [ ] Persist in settings
- [ ] Add high contrast mode:
  - [ ] High contrast toggle in settings
  - [ ] High contrast color palette
  - [ ] Apply to all components
- [ ] Implement High Focus Mode:
  - [ ] Toggle in settings
  - [ ] Hide secondary graphs and cards
  - [ ] Focus on: current book + progress + start session button
  - [ ] Reduce decorative elements
  - [ ] Apply globally when enabled
- [ ] Add reduced motion option:
  - [ ] Settings toggle
  - [ ] Disable/limit animations when enabled
- [ ] Ensure keyboard navigation throughout app:
  - [ ] All interactive elements keyboard accessible
  - [ ] Focus indicators visible
  - [ ] Tab order logical

### 4.2 Productivity Features
- [ ] Implement all keyboard shortcuts:
  - [ ] `Ctrl/Cmd + L` → Open global search / library
  - [ ] `Ctrl/Cmd + N` → New reading session
  - [ ] `Ctrl/Cmd + Shift + B` → Add new book
  - [ ] `Ctrl/Cmd + K` → Open command palette (future)
- [ ] Implement keyboard navigation:
  - [ ] Arrow keys navigate book lists (up/down)
  - [ ] Enter opens book details
  - [ ] Tab navigates through interface elements
  - [ ] Escape closes modals/dialogs
- [ ] Create keyboard shortcuts handler:
  - [ ] Global keyboard event listener
  - [ ] Route shortcuts to appropriate actions
  - [ ] Prevent conflicts with OS shortcuts
- [ ] Implement command palette (future feature):
  - [ ] Fuzzy search for actions
  - [ ] Quick access to all features
  - [ ] Action execution from palette
- [ ] Add shortcuts reference in Settings:
  - [ ] Display all available shortcuts
  - [ ] Organized by category
  - [ ] Keyboard icons display

### 4.3 Data Management
- [ ] Implement partial exports:
  - [ ] Export year statistics (sessions, books completed in year)
  - [ ] Export single book data (book + sessions + notes)
  - [ ] Export notes separately (filtered notes)
- [ ] Enhance import functionality:
  - [ ] Import with overwrite option
  - [ ] Import with merge option
  - [ ] Data validation before import
  - [ ] Preview what will be imported
- [ ] Implement backup validation:
  - [ ] Validate JSON structure
  - [ ] Validate data integrity
  - [ ] Show validation errors
- [ ] Add backup folder location setting:
  - [ ] Display current backup folder
  - [ ] Change location button
  - [ ] Persist in settings
- [ ] Add last backup date indicator:
  - [ ] Display "Last backup: [date]" in Settings
  - [ ] Query `backups` table for most recent full backup
- [ ] Future: Auto-backup preferences (scheduling)

### 4.4 Error Handling & Validation
- [ ] Implement progress correction UI:
  - [ ] Validation warnings display
  - [ ] Inline validation messages
  - [ ] Disable save if validation fails
- [ ] Add data integrity checks:
  - [ ] Check on app startup
  - [ ] Validate foreign key relationships
  - [ ] Check for orphaned records
  - [ ] Report integrity issues
- [ ] Implement error messages:
  - [ ] User-friendly error messages
  - [ ] Actionable solutions in error messages
  - [ ] Error toast/notification system
- [ ] Add fail-safe mechanisms:
  - [ ] Transaction-based database operations
  - [ ] Rollback on errors
  - [ ] Data backup before risky operations
- [ ] Create data audit trail (if needed):
  - [ ] Log important changes (status changes, deletions)
  - [ ] Timestamp and action tracking

### 4.5 Settings & Preferences (Complete)
- [ ] Complete Appearance section:
  - [ ] Theme toggle (light/dark) ✅ (from MVP)
  - [ ] Font size selector (small, standard, large)
  - [ ] Line spacing adjustment
  - [ ] High contrast mode toggle
  - [ ] High Focus Mode toggle
- [ ] Complete Behavior section:
  - [ ] Default progress unit selector (page vs %)
  - [ ] Default session behavior toggle (open timer automatically)
  - [ ] Default start page input (when creating new book)
- [ ] Complete Notifications section:
  - [ ] Daily reminder toggle
  - [ ] "You haven't read today" prompt toggle
  - [ ] Goal reminder preferences
- [ ] Complete Data section:
  - [ ] Backup folder location display and change
  - [ ] Last backup date indicator
  - [ ] Export full backup button
  - [ ] Export partial data options
  - [ ] Import backup button with options
- [ ] Complete Shortcuts section:
  - [ ] Keyboard shortcuts reference display
  - [ ] Organized list of all shortcuts
- [ ] Implement all settings persistence:
  - [ ] Save all settings to `settings` table
  - [ ] Load settings on app startup
  - [ ] Apply settings globally

---

## Phase 5: Advanced Features & Enhancements

### 5.1 Intelligent Features
- [ ] Implement automatic book summary:
  - [ ] Compile notes and highlights
  - [ ] Generate structured summary (text-based initially)
  - [ ] Display in Book Details → Summary tab
  - [ ] Future: AI-generated summaries
- [ ] Implement mind map generation:
  - [ ] Extract themes/concepts from notes
  - [ ] Create visual mind map (use library like d3 or vis.js)
  - [ ] Display in Book Details → Summary tab
  - [ ] Allow manual editing
- [ ] Implement cross-reading:
  - [ ] Find books with similar themes (based on notes/tags)
  - [ ] Create book relationships/connections
  - [ ] Display related books in Book Details
  - [ ] Knowledge network visualization
- [ ] Implement learning map per book:
  - [ ] Group concepts from notes
  - [ ] Visual map of learned concepts
  - [ ] Associate concepts with pages/excerpts
- [ ] Add automatic weekly insights:
  - [ ] Analyze reading patterns
  - [ ] Generate insights ("You read more at night")
  - [ ] Display on Home or Agenda page

### 5.2 Immersive Mode
- [ ] Create immersive reading mode screen:
  - [ ] Full-screen reading interface
  - [ ] Minimal UI (just timer and progress)
- [ ] Implement timer with ambient sounds:
  - [ ] Timer component
  - [ ] Ambient sound options (library sounds, rain, etc.)
  - [ ] Sound controls
- [ ] Add minimalist reading layout:
  - [ ] Hide all navigation
  - [ ] Focus on current book and timer
  - [ ] Exit immersive mode button

### 5.3 Page Scan Feature
- [ ] Implement photo capture:
  - [ ] Camera access (using Tauri's native camera access or file picker)
  - [ ] Photo capture UI (HTML5 camera API or file picker)
  - [ ] Store photo path in `photo_path` field
  - [ ] Save photos to app data directory (using Tauri's fs plugin)
- [ ] Add page scan to session:
  - [ ] Option to attach photo to session
  - [ ] Photo preview (display image in UI)
  - [ ] Upload/copy photo to app storage
- [ ] Future: OCR/page number recognition:
  - [ ] Use Rust OCR library (tesseract-rs or similar) for text recognition
  - [ ] Extract page number from photo
  - [ ] Auto-update current page via Tauri command
  - [ ] Validation of recognized page number

### 5.4 Advanced Export Features
- [ ] Implement book summary export:
  - [ ] Export to PDF:
    - [ ] Use Rust PDF library (printpdf, pdf-writer) in backend
    - [ ] Create Tauri command for PDF generation
    - [ ] Use Tauri dialog for save location
  - [ ] Export to Markdown:
    - [ ] Generate Markdown text in Rust backend
    - [ ] Save to file using Tauri's fs plugin
  - [ ] Include notes, highlights, summary
- [ ] Implement mind map export:
  - [ ] Export as image (PNG/SVG):
    - [ ] Render mind map to canvas/svg in frontend
    - [ ] Convert to image format
    - [ ] Save via Tauri fs plugin
  - [ ] Export as interactive HTML:
    - [ ] Generate HTML with embedded SVG
    - [ ] Save via Tauri fs plugin
- [ ] Implement journal export:
  - [ ] Export journal entries to PDF (same as book summary)
  - [ ] Export journal entries to Markdown
  - [ ] Filter by date range or book
- [ ] Add custom export formats:
  - [ ] User-selectable export options
  - [ ] Custom templates (future)

---

## Phase 6: Testing & Quality Assurance

### 6.1 Unit Tests
- [ ] **Domain Layer Tests**:
  - [ ] Entity validation tests:
    - [ ] Book entity business rules (current_page <= total_pages, etc.)
    - [ ] Session validation (end_page >= start_page)
    - [ ] Value object validation (page_number, progress_percentage)
  - [ ] Domain service tests:
    - [ ] `ProgressCalculator` unit tests (pure functions)
    - [ ] `StatisticsCalculator` unit tests
    - [ ] `GoalProgressCalculator` unit tests
- [ ] **Use Case Tests** (with mocked repositories):
  - [ ] `CreateBookUseCase` tests:
    - [ ] Success case
    - [ ] Validation failures
    - [ ] Repository errors
  - [ ] `CreateSessionUseCase` tests (with progress update)
  - [ ] `UpdateBookStatusUseCase` tests
  - [ ] `CalculateGoalProgressUseCase` tests
  - [ ] Mock repository traits using `mockall` or similar
- [ ] **Repository Integration Tests**:
  - [ ] `SqliteBookRepository` tests with in-memory database:
    - [ ] CRUD operations
    - [ ] Query operations (find_by_status, etc.)
    - [ ] Transaction handling
  - [ ] Similar tests for all repository implementations
- [ ] **Infrastructure Layer Tests**:
  - [ ] Database connection tests
  - [ ] Migration tests
  - [ ] Backup service implementation tests

### 6.2 Integration Tests
- [ ] Feature workflow tests:
  - [ ] Complete book reading flow (add → read → complete)
  - [ ] Session creation and progress update
  - [ ] Note creation and display
  - [ ] Goal tracking workflow
- [ ] Data integrity tests:
  - [ ] Foreign key constraints
  - [ ] Cascade deletions
  - [ ] Data consistency checks
- [ ] Backup/restore tests:
  - [ ] Full backup export/import
  - [ ] Partial export/import
  - [ ] Data validation

### 6.3 UI/UX Testing
- [ ] Accessibility testing:
  - [ ] WCAG AA compliance check
  - [ ] Screen reader compatibility
  - [ ] Keyboard navigation testing
  - [ ] Color contrast verification
- [ ] Theme consistency testing:
  - [ ] Light/dark theme consistency
  - [ ] Font size changes across all screens
  - [ ] High Focus Mode testing
- [ ] Responsive behavior testing:
  - [ ] Window resizing
  - [ ] Different screen sizes
  - [ ] Layout adjustments

### 6.4 Performance Testing
- [ ] Large dataset handling:
  - [ ] 1000+ books performance
  - [ ] 10000+ sessions performance
  - [ ] Query optimization
- [ ] UI rendering performance:
  - [ ] Large book lists rendering
  - [ ] Complex statistics calculations
  - [ ] Chart rendering performance
- [ ] Memory usage:
  - [ ] Memory leaks detection
  - [ ] Efficient data loading

---

## Phase 7: Documentation & Deployment

### 7.1 Documentation
- [ ] Code documentation:
  - [ ] Function/component JSDoc comments
  - [ ] Architecture documentation
  - [ ] Database schema documentation
- [ ] User guide:
  - [ ] Getting started guide
  - [ ] Feature documentation
  - [ ] FAQ section
- [ ] API documentation (if applicable):
  - [ ] Service layer API docs
  - [ ] Component props documentation

### 7.2 Deployment Preparation (Tauri)
- [ ] Build configuration:
  - [ ] Configure `src-tauri/tauri.conf.json`:
    - [ ] App name, version, identifier
    - [ ] Bundle configuration (Windows/Mac/Linux)
    - [ ] Window settings (size, min size, title, etc.)
  - [ ] Optimize frontend build:
    - [ ] Production Vite build (`npm run build`)
    - [ ] Code splitting and tree shaking (handled by Vite)
    - [ ] Asset optimization
- [ ] Tauri build and packaging:
  - [ ] Configure build settings in `tauri.conf.json`:
    - [ ] Bundle identifier (com.example.library)
    - [ ] App icons for all platforms
    - [ ] Code signing (for production)
  - [ ] Build commands:
    - [ ] `npm run tauri:build` - Builds production app
    - [ ] Creates platform-specific installers:
      - [ ] Windows: `.msi` installer
      - [ ] macOS: `.dmg` or `.app` bundle
      - [ ] Linux: `.deb` or `.AppImage`
- [ ] App icons and assets:
  - [ ] Generate app icons (all sizes) in `src-tauri/icons/`
  - [ ] Platform-specific icon formats:
    - [ ] Windows: `.ico`
    - [ ] macOS: `.icns`
    - [ ] Linux: `.png` (various sizes)
- [ ] Testing installers:
  - [ ] Test installation on target platforms
  - [ ] Verify app data directory creation
  - [ ] Test database initialization on fresh install
  - [ ] Test app update/upgrade paths
- [ ] Release notes:
  - [ ] Version changelog
  - [ ] Feature list
  - [ ] Known issues
  - [ ] Platform-specific notes

---

## Implementation Notes

### Priority Order:
1. **Critical Path (MVP)**: Phase 0 → Phase 1 (all) → Basic Phase 2 (tags, session editing)
2. **Enhanced MVP**: Phase 2 (complete) → Phase 3.1 (Rereads) → Phase 4.1 (Basic accessibility)
3. **Advanced**: Phase 3 (remaining) → Phase 4 (remaining) → Phase 5

### Dependencies:
- Database schema must be implemented before any data operations
- Theme system must be set up before UI components
- Core UI primitives needed before feature screens
- Session system depends on books being implemented
- Progress tracking depends on sessions
- Rereads depend on basic sessions and books

### Rust Architecture Principles (Ports & Adapters):
1. **Domain Layer** - Pure business logic, no dependencies on infrastructure
2. **Ports Layer** - Trait definitions (interfaces), defines contracts
3. **Application Layer** - Use cases orchestrate domain logic, depend on ports (traits)
4. **Infrastructure Layer** - Implements ports, concrete database/file system operations
5. **Adapters Layer** - Tauri commands, translates between frontend and application layer
6. **Dependency Flow**: Adapters → Application → Domain (ports point inward)
7. **Testability**: Easy to mock repositories/services for unit testing
8. **Maintainability**: Clear separation of concerns, easy to swap implementations

### Estimated Timeline:
- **Weeks 1-2**: Phase 0 (Foundation)
- **Weeks 3-5**: Phase 1 (MVP Core)
- **Weeks 6-8**: Phase 2 (Enhanced Features)
- **Weeks 9-12**: Phase 3 (Advanced Features)
- **Weeks 13-14**: Phase 4 (Polish)
- **Weeks 15+**: Phase 5-7 (Advanced, Testing, Docs)

### Development Commands:
- `npm run tauri:dev` - Start development server with Tauri (hot reload)
- `npm run dev` - Start Vite dev server only (frontend only)
- `npm run build` - Build frontend for production
- `npm run tauri:build` - Build full desktop app for production
- `cargo check` (in `src-tauri/`) - Check Rust code for errors
- `cargo clippy` (in `src-tauri/`) - Lint Rust code

---

## Quick Reference: File Structure

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── ui/              # Base design system components
│   └── thematic/        # Reading-specific components
├── pages/               # Screen-level pages (or features/)
│   ├── HomePage.tsx
│   ├── LibraryPage.tsx
│   ├── BookDetailsPage.tsx
│   ├── SessionsPage.tsx
│   ├── NotesPage.tsx
│   ├── GoalsAndStatsPage.tsx
│   ├── JournalPage.tsx
│   ├── AgendaPage.tsx
│   ├── SuggestionsPage.tsx
│   ├── ReportsPage.tsx
│   ├── SettingsPage.tsx
│   └── ProgressCorrectionPage.tsx
├── hooks/               # React hooks
│   ├── useBooks.ts
│   ├── useSessions.ts
│   ├── useNotes.ts
│   ├── useGoals.ts
│   └── useSettings.ts
├── lib/                 # Utilities and helpers
│   ├── utils.ts
│   └── api.ts           # Tauri invoke wrapper functions
├── theme/               # Design tokens, theme provider
│   ├── tokens.ts
│   ├── ThemeProvider.tsx
│   └── index.ts
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component with routes
├── main.tsx             # React entry point
└── index.css            # Tailwind CSS directives
```

### Backend (Rust + Tauri - Ports & Adapters Architecture)
```
src-tauri/
├── src/
│   ├── main.rs          # Tauri application entry point, DI setup
│   ├── lib.rs           # Main library, re-exports
│   │
│   ├── domain/          # Domain Layer (Core Business Logic)
│   │   ├── entities/    # Domain entities with business rules
│   │   │   ├── book.rs
│   │   │   ├── reading.rs
│   │   │   ├── session.rs
│   │   │   ├── note.rs
│   │   │   └── goal.rs
│   │   ├── value_objects/  # Value objects (validated types)
│   │   │   ├── page_number.rs
│   │   │   └── progress_percentage.rs
│   │   └── services/    # Domain services (pure business logic)
│   │       ├── progress_calculator.rs
│   │       └── statistics_calculator.rs
│   │
│   ├── ports/           # Ports Layer (Interfaces/Traits)
│   │   ├── repositories/  # Repository traits
│   │   │   ├── book_repository.rs
│   │   │   ├── session_repository.rs
│   │   │   ├── note_repository.rs
│   │   │   └── goal_repository.rs
│   │   └── services/    # Service port traits
│   │       ├── backup_service.rs
│   │       └── export_service.rs
│   │
│   ├── application/     # Application Layer (Use Cases)
│   │   ├── use_cases/
│   │   │   ├── books/
│   │   │   │   ├── create_book.rs
│   │   │   │   ├── update_book.rs
│   │   │   │   └── list_books.rs
│   │   │   ├── sessions/
│   │   │   └── notes/
│   │   ├── services/    # Application services
│   │   │   └── progress_service.rs
│   │   └── dtos/        # Data Transfer Objects
│   │       ├── book_dto.rs
│   │       └── session_dto.rs
│   │
│   ├── infrastructure/  # Infrastructure Layer (Adapters)
│   │   ├── database/
│   │   │   ├── connection.rs
│   │   │   ├── migrations.rs
│   │   │   └── transaction.rs
│   │   ├── repositories/  # Repository implementations
│   │   │   ├── sqlite_book_repository.rs
│   │   │   ├── sqlite_session_repository.rs
│   │   │   └── sqlite_note_repository.rs
│   │   └── services/    # Service implementations
│   │       ├── backup_service_impl.rs
│   │       └── file_service_impl.rs
│   │
│   └── adapters/        # Adapters Layer (API/External)
│       └── tauri/
│           ├── commands/  # Tauri command handlers
│           │   ├── book_commands.rs
│           │   ├── session_commands.rs
│           │   └── backup_commands.rs
│           └── errors.rs  # Error handling/translation
│
├── Cargo.toml           # Rust dependencies
├── tauri.conf.json      # Tauri configuration
├── capabilities/        # Tauri capabilities/permissions
│   └── default.json
└── icons/               # App icons for all platforms
```

### Key Technologies:
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router, Lucide React
- **Backend**: Rust, Tauri v2, Rusqlite (SQLite), Serde (serialization), Chrono (dates)
- **Communication**: Tauri commands (`invoke()`) for frontend ↔ backend communication
- **Database**: SQLite stored in app data directory (managed by Rust backend)

---

This document provides a complete roadmap for implementing the reading application according to all documentation requirements.

