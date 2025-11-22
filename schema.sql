-- SQLite Database Schema for Reading Application
-- Based on the complete system requirements documentation

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- books: Main book/library entity
-- Stores all book metadata, progress tracking, and organization status
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    genre TEXT,
    type TEXT NOT NULL CHECK(type IN ('physical_book', 'ebook', 'audiobook', 'article', 'PDF', 'comic')),
    isbn TEXT,
    publication_year INTEGER,
    total_pages INTEGER,
    total_minutes INTEGER, -- For audiobooks
    current_page_text INTEGER DEFAULT 0,
    current_minutes_audio INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started', 'reading', 'paused', 'abandoned', 'completed', 'rereading')),
    is_archived INTEGER DEFAULT 0 CHECK(is_archived IN (0, 1)),
    is_wishlist INTEGER DEFAULT 0 CHECK(is_wishlist IN (0, 1)),
    cover_url TEXT,
    url TEXT, -- For articles and PDFs
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    status_changed_at TEXT -- When status was last changed
);

-- book_readings: Tracks multiple readings (rereads) of the same book
-- Allows comparison between different reading cycles
CREATE TABLE book_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    reading_number INTEGER NOT NULL, -- 1 = first read, 2 = first reread, etc.
    started_at TEXT,
    completed_at TEXT,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started', 'reading', 'paused', 'abandoned', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE(book_id, reading_number)
);

-- reading_sessions: Individual reading sessions
-- Records when, how long, and how much was read in each session
CREATE TABLE reading_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    reading_id INTEGER, -- FK to book_readings (null for first reading cycle)
    session_date TEXT NOT NULL,
    start_time TEXT, -- ISO8601 time format
    end_time TEXT, -- ISO8601 time format
    start_page INTEGER,
    end_page INTEGER,
    pages_read INTEGER,
    minutes_read INTEGER,
    duration_seconds INTEGER, -- Total duration in seconds
    notes TEXT, -- Quick session notes
    photo_path TEXT, -- Path to page scan photo (if used)
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES book_readings(id) ON DELETE SET NULL,
    CHECK(end_page IS NULL OR start_page IS NULL OR end_page >= start_page),
    CHECK(duration_seconds IS NULL OR duration_seconds >= 0)
);

-- notes: Table for book annotations and notes
CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    reading_id INTEGER, -- FK to book_readings (null for first reading cycle)
    page INTEGER,
    content TEXT NOT NULL, -- Note content
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (reading_id) REFERENCES book_readings(id) ON DELETE SET NULL
);

-- ============================================================================
-- ORGANIZATION TABLES
-- ============================================================================

-- tags: Custom tags for organizing books and notes
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT, -- Optional hex color code
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- book_tags: Many-to-many relationship between books and tags
CREATE TABLE book_tags (
    book_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (book_id, tag_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- note_tags: Many-to-many relationship between notes and tags
CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- collections: Custom book collections (e.g., "Classics", "To reread")
CREATE TABLE collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- book_collections: Many-to-many relationship between books and collections
CREATE TABLE book_collections (
    book_id INTEGER NOT NULL,
    collection_id INTEGER NOT NULL,
    PRIMARY KEY (book_id, collection_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

-- ============================================================================
-- GOALS & TRACKING TABLES
-- ============================================================================

-- goals: Reading goals (monthly pages, yearly books, daily minutes)
CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('pages_monthly', 'books_yearly', 'minutes_daily')),
    target_value INTEGER NOT NULL CHECK(target_value > 0),
    period_year INTEGER,
    period_month INTEGER CHECK(period_month IS NULL OR (period_month >= 1 AND period_month <= 12)),
    is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK(
        (type = 'pages_monthly' AND period_year IS NOT NULL AND period_month IS NOT NULL) OR
        (type = 'books_yearly' AND period_year IS NOT NULL AND period_month IS NULL) OR
        (type = 'minutes_daily' AND period_year IS NULL AND period_month IS NULL)
    )
);

-- journal_entries: Reading journal entries (daily reflections)
CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date TEXT NOT NULL, -- Date of the journal entry
    content TEXT NOT NULL,
    book_id INTEGER, -- Optional reference to a book
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
);

-- agenda_blocks: Planned reading blocks in the agenda/calendar
CREATE TABLE agenda_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER, -- Optional: which book to read
    scheduled_date TEXT NOT NULL, -- Date of the planned reading
    start_time TEXT, -- ISO8601 time format
    end_time TEXT, -- ISO8601 time format
    is_completed INTEGER DEFAULT 0 CHECK(is_completed IN (0, 1)),
    completed_session_id INTEGER, -- FK to reading_sessions if completed
    notes TEXT, -- Optional notes about the planned block
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_session_id) REFERENCES reading_sessions(id) ON DELETE SET NULL
);

-- ============================================================================
-- SETTINGS & DATA MANAGEMENT TABLES
-- ============================================================================

-- settings: User preferences and configuration (key-value store)
-- Values can be JSON strings for complex settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- backups: Backup metadata and history
CREATE TABLE backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT NOT NULL, -- Full path to backup file
    file_name TEXT NOT NULL, -- Just the filename
    backup_type TEXT NOT NULL CHECK(backup_type IN ('full', 'partial', 'year_stats', 'single_book')),
    metadata TEXT, -- JSON string with details about what was backed up
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- books indexes
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_type ON books(type);
CREATE INDEX idx_books_is_archived ON books(is_archived);
CREATE INDEX idx_books_is_wishlist ON books(is_wishlist);
CREATE INDEX idx_books_added_at ON books(added_at);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);

-- book_readings indexes
CREATE INDEX idx_book_readings_book_id ON book_readings(book_id);
CREATE INDEX idx_book_readings_status ON book_readings(status);
CREATE INDEX idx_book_readings_started_at ON book_readings(started_at);

-- reading_sessions indexes
CREATE INDEX idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_reading_id ON reading_sessions(reading_id);
CREATE INDEX idx_reading_sessions_session_date ON reading_sessions(session_date);
CREATE INDEX idx_reading_sessions_date_book ON reading_sessions(session_date, book_id);

-- notes indexes
CREATE INDEX idx_notes_book_id ON notes(book_id);
CREATE INDEX idx_notes_reading_id ON notes(reading_id);
CREATE INDEX idx_notes_page ON notes(page);
CREATE INDEX idx_notes_created_at ON notes(created_at);

-- tags indexes
CREATE INDEX idx_tags_name ON tags(name);

-- collections indexes
CREATE INDEX idx_collections_name ON collections(name);

-- goals indexes
CREATE INDEX idx_goals_type ON goals(type);
CREATE INDEX idx_goals_period_year ON goals(period_year);
CREATE INDEX idx_goals_is_active ON goals(is_active);
CREATE INDEX idx_goals_period ON goals(period_year, period_month);

-- journal_entries indexes
CREATE INDEX idx_journal_entries_entry_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_book_id ON journal_entries(book_id);

-- agenda_blocks indexes
CREATE INDEX idx_agenda_blocks_scheduled_date ON agenda_blocks(scheduled_date);
CREATE INDEX idx_agenda_blocks_book_id ON agenda_blocks(book_id);
CREATE INDEX idx_agenda_blocks_is_completed ON agenda_blocks(is_completed);

-- backups indexes
CREATE INDEX idx_backups_backup_type ON backups(backup_type);
CREATE INDEX idx_backups_created_at ON backups(created_at);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Trigger to update updated_at timestamp on books
CREATE TRIGGER update_books_timestamp 
AFTER UPDATE ON books
BEGIN
    UPDATE books SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on reading_sessions
CREATE TRIGGER update_reading_sessions_timestamp 
AFTER UPDATE ON reading_sessions
BEGIN
    UPDATE reading_sessions SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on notes
CREATE TRIGGER update_notes_timestamp 
AFTER UPDATE ON notes
BEGIN
    UPDATE notes SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on collections
CREATE TRIGGER update_collections_timestamp 
AFTER UPDATE ON collections
BEGIN
    UPDATE collections SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on goals
CREATE TRIGGER update_goals_timestamp 
AFTER UPDATE ON goals
BEGIN
    UPDATE goals SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on journal_entries
CREATE TRIGGER update_journal_entries_timestamp 
AFTER UPDATE ON journal_entries
BEGIN
    UPDATE journal_entries SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on agenda_blocks
CREATE TRIGGER update_agenda_blocks_timestamp 
AFTER UPDATE ON agenda_blocks
BEGIN
    UPDATE agenda_blocks SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update settings updated_at timestamp
CREATE TRIGGER update_settings_timestamp 
AFTER UPDATE ON settings
BEGIN
    UPDATE settings SET updated_at = datetime('now') WHERE key = NEW.key;
END;

-- Trigger to update status_changed_at when book status changes
CREATE TRIGGER update_book_status_changed_at 
AFTER UPDATE OF status ON books
WHEN OLD.status != NEW.status
BEGIN
    UPDATE books SET status_changed_at = datetime('now') WHERE id = NEW.id;
END;

