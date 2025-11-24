use rusqlite::Connection;
use std::fs;
use std::path::Path;

/// Runs database migrations
pub struct Migration;

impl Migration {
    /// Initializes the database by executing schema.sql
    pub fn initialize_database(conn: &Connection) -> Result<(), String> {
        // Try to read schema.sql from project root (relative to src-tauri)
        let schema_path = Path::new("../schema.sql");
        
        let schema_sql = if schema_path.exists() {
            fs::read_to_string(schema_path)
                .map_err(|e| format!("Failed to read schema.sql: {}", e))?
        } else {
            // If schema.sql doesn't exist in expected location, return error
            return Err("schema.sql not found. Expected at ../schema.sql relative to src-tauri".to_string());
        };

        // Execute schema SQL
        conn.execute_batch(&schema_sql)
            .map_err(|e| format!("Failed to execute schema: {}", e))?;

        Ok(())
    }

    /// Checks if database needs initialization (checks if tables exist)
    pub fn needs_initialization(conn: &Connection) -> Result<bool, String> {
        let mut stmt = conn
            .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='books'")
            .map_err(|e| format!("Failed to check tables: {}", e))?;

        let exists = stmt
            .exists([])
            .map_err(|e| format!("Failed to check if books table exists: {}", e))?;

        Ok(!exists)
    }

    /// Runs all migrations
    pub fn run_migrations(conn: &Connection) -> Result<(), String> {
        // Check if database needs initialization
        if Self::needs_initialization(conn)? {
            Self::initialize_database(conn)?;
            return Ok(());
        }

        // Run incremental migrations for existing databases
        Self::migrate_remove_note_type_and_excerpt(conn)?;
        Self::migrate_remove_sentiment(conn)?;
        Self::migrate_remove_session_notes(conn)?;

        Ok(())
    }

    /// Migration to remove type and excerpt columns from notes table
    /// SQLite doesn't support DROP COLUMN, so we recreate the table
    fn migrate_remove_note_type_and_excerpt(conn: &Connection) -> Result<(), String> {
        // Check if notes table has type or excerpt columns
        let mut stmt = conn
            .prepare("PRAGMA table_info(notes)")
            .map_err(|e| format!("Failed to inspect notes table: {}", e))?;

        let mut column_names = Vec::new();
        let info_rows = stmt
            .query_map([], |row| {
                let name: String = row.get(1)?;
                Ok(name)
            })
            .map_err(|e| format!("Failed to iterate table info: {}", e))?;

        for col in info_rows {
            column_names.push(col.map_err(|e| format!("Failed to read column info: {}", e))?);
        }

        let has_type_column = column_names.iter().any(|c| c == "type");
        let has_excerpt_column = column_names.iter().any(|c| c == "excerpt");

        // If neither column exists, migration is already done
        if !has_type_column && !has_excerpt_column {
            return Ok(());
        }

        // Begin transaction
        let tx = conn.unchecked_transaction()
            .map_err(|e| format!("Failed to begin transaction: {}", e))?;

        // Create new notes table without type and excerpt
        tx.execute(
            "CREATE TABLE notes_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER NOT NULL,
                reading_id INTEGER,
                page INTEGER,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
                FOREIGN KEY (reading_id) REFERENCES book_readings(id) ON DELETE SET NULL
            )",
            [],
        )
        .map_err(|e| format!("Failed to create new notes table: {}", e))?;

        // Copy data from old table to new, preserving content
        // If highlight had excerpt, concatenate it with content if excerpt is not empty
        let copy_sql = if has_excerpt_column {
            "             INSERT INTO notes_new (id, book_id, reading_id, page, content, created_at, updated_at)
             SELECT 
                id,
                book_id,
                reading_id,
                page,
                CASE 
                    WHEN excerpt IS NOT NULL AND excerpt != '' AND content IS NOT NULL AND content != ''
                    THEN excerpt || '\n\n' || content
                    WHEN excerpt IS NOT NULL AND excerpt != '' AND (content IS NULL OR content = '')
                    THEN excerpt
                    ELSE COALESCE(content, '')
                END as content,
                created_at,
                updated_at
             FROM notes"
        } else {
            // No excerpt column, just copy content as is
            "INSERT INTO notes_new (id, book_id, reading_id, page, content, created_at, updated_at)
             SELECT id, book_id, reading_id, page, content, created_at, updated_at
             FROM notes"
        };

        tx.execute(copy_sql, [])
            .map_err(|e| format!("Failed to copy data to new table: {}", e))?;

        // Drop old table (this also drops indexes)
        tx.execute("DROP TABLE notes", [])
            .map_err(|e| format!("Failed to drop old notes table: {}", e))?;

        // Rename new table to notes
        tx.execute("ALTER TABLE notes_new RENAME TO notes", [])
            .map_err(|e| format!("Failed to rename new notes table: {}", e))?;

        // Recreate indexes (without type index)
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_reading_id ON notes(reading_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_page ON notes(page)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;

        // Commit transaction
        tx.commit()
            .map_err(|e| format!("Failed to commit migration: {}", e))?;

        Ok(())
    }

    /// Migration to remove sentiment column from notes table
    fn migrate_remove_sentiment(conn: &Connection) -> Result<(), String> {
        // Check if notes table has sentiment column
        let mut stmt = conn
            .prepare("PRAGMA table_info(notes)")
            .map_err(|e| format!("Failed to inspect notes table: {}", e))?;

        let mut column_names = Vec::new();
        let info_rows = stmt
            .query_map([], |row| {
                let name: String = row.get(1)?;
                Ok(name)
            })
            .map_err(|e| format!("Failed to iterate table info: {}", e))?;

        for col in info_rows {
            column_names.push(col.map_err(|e| format!("Failed to read column info: {}", e))?);
        }

        let has_sentiment_column = column_names.iter().any(|c| c == "sentiment");

        // If sentiment column doesn't exist, migration is already done
        if !has_sentiment_column {
            return Ok(());
        }

        // Begin transaction
        let tx = conn.unchecked_transaction()
            .map_err(|e| format!("Failed to begin transaction: {}", e))?;

        // Create new notes table without sentiment
        tx.execute(
            "CREATE TABLE notes_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER NOT NULL,
                reading_id INTEGER,
                page INTEGER,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
                FOREIGN KEY (reading_id) REFERENCES book_readings(id) ON DELETE SET NULL
            )",
            [],
        )
        .map_err(|e| format!("Failed to create new notes table: {}", e))?;

        // Copy data from old table to new, excluding sentiment
        tx.execute(
            "INSERT INTO notes_new (id, book_id, reading_id, page, content, created_at, updated_at)
             SELECT id, book_id, reading_id, page, content, created_at, updated_at
             FROM notes",
            [],
        )
        .map_err(|e| format!("Failed to copy data to new table: {}", e))?;

        // Drop old table (this also drops indexes)
        tx.execute("DROP TABLE notes", [])
            .map_err(|e| format!("Failed to drop old notes table: {}", e))?;

        // Rename new table to notes
        tx.execute("ALTER TABLE notes_new RENAME TO notes", [])
            .map_err(|e| format!("Failed to rename new notes table: {}", e))?;

        // Recreate indexes (without sentiment index)
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_reading_id ON notes(reading_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_page ON notes(page)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;

        // Commit transaction
        tx.commit()
            .map_err(|e| format!("Failed to commit migration: {}", e))?;

        Ok(())
    }

    /// Migration to remove notes column from reading_sessions table
    /// SQLite doesn't support DROP COLUMN, so we recreate the table
    fn migrate_remove_session_notes(conn: &Connection) -> Result<(), String> {
        // Check if reading_sessions table has notes column
        let mut stmt = conn
            .prepare("PRAGMA table_info(reading_sessions)")
            .map_err(|e| format!("Failed to inspect reading_sessions table: {}", e))?;

        let mut column_names = Vec::new();
        let info_rows = stmt
            .query_map([], |row| {
                let name: String = row.get(1)?;
                Ok(name)
            })
            .map_err(|e| format!("Failed to iterate table info: {}", e))?;

        for col in info_rows {
            column_names.push(col.map_err(|e| format!("Failed to read column info: {}", e))?);
        }

        let has_notes_column = column_names.iter().any(|c| c == "notes");

        // If notes column doesn't exist, migration is already done
        if !has_notes_column {
            return Ok(());
        }

        // Begin transaction
        let tx = conn.unchecked_transaction()
            .map_err(|e| format!("Failed to begin transaction: {}", e))?;

        // Create new reading_sessions table without notes
        tx.execute(
            "CREATE TABLE reading_sessions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER NOT NULL,
                reading_id INTEGER,
                session_date TEXT NOT NULL,
                start_time TEXT,
                end_time TEXT,
                start_page INTEGER,
                end_page INTEGER,
                pages_read INTEGER,
                minutes_read INTEGER,
                duration_seconds INTEGER,
                photo_path TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
                FOREIGN KEY (reading_id) REFERENCES book_readings(id) ON DELETE SET NULL,
                CHECK(end_page IS NULL OR start_page IS NULL OR end_page >= start_page),
                CHECK(duration_seconds IS NULL OR duration_seconds >= 0)
            )",
            [],
        )
        .map_err(|e| format!("Failed to create new reading_sessions table: {}", e))?;

        // Copy data from old table to new, excluding notes
        tx.execute(
            "INSERT INTO reading_sessions_new (
                id, book_id, reading_id, session_date, start_time, end_time,
                start_page, end_page, pages_read, minutes_read, duration_seconds,
                photo_path, created_at, updated_at
            )
            SELECT 
                id, book_id, reading_id, session_date, start_time, end_time,
                start_page, end_page, pages_read, minutes_read, duration_seconds,
                photo_path, created_at, updated_at
            FROM reading_sessions",
            [],
        )
        .map_err(|e| format!("Failed to copy data to new table: {}", e))?;

        // Drop old table (this also drops indexes)
        tx.execute("DROP TABLE reading_sessions", [])
            .map_err(|e| format!("Failed to drop old reading_sessions table: {}", e))?;

        // Rename new table to reading_sessions
        tx.execute("ALTER TABLE reading_sessions_new RENAME TO reading_sessions", [])
            .map_err(|e| format!("Failed to rename new reading_sessions table: {}", e))?;

        // Recreate indexes
        tx.execute("CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_reading_sessions_reading_id ON reading_sessions(reading_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_reading_sessions_session_date ON reading_sessions(session_date)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;
        tx.execute("CREATE INDEX IF NOT EXISTS idx_reading_sessions_date_book ON reading_sessions(session_date, book_id)", [])
            .map_err(|e| format!("Failed to create index: {}", e))?;

        // Commit transaction
        tx.commit()
            .map_err(|e| format!("Failed to commit migration: {}", e))?;

        Ok(())
    }
}
