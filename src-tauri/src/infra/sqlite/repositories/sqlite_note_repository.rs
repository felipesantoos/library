use crate::core::domains::note::Note;
use crate::core::interfaces::secondary::NoteRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of NoteRepository
pub struct SqliteNoteRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteNoteRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteNoteRepository { connection }
    }

    fn row_to_note(row: &rusqlite::Row) -> Result<Note, rusqlite::Error> {
        Ok(Note {
            id: Some(row.get(0)?),
            book_id: row.get(1)?,
            reading_id: row.get(2)?,
            page: row.get(3)?,
            content: row.get(4)?,
            created_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(5, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
            updated_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(6, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
        })
    }
}

impl NoteRepository for SqliteNoteRepository {
    fn create(&self, note: &mut Note) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let created_at = note.created_at.to_rfc3339();
        let updated_at = note.updated_at.to_rfc3339();

        conn.execute(
            "INSERT INTO notes (
                book_id, reading_id, page, content,
                created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                note.book_id,
                note.reading_id,
                note.page,
                note.content,
                created_at,
                updated_at
            ],
        )
        .map_err(|e| format!("Failed to insert note: {}", e))?;

        note.id = Some(conn.last_insert_rowid());
        Ok(())
    }

    fn update(&self, note: &Note) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let id = note.id.ok_or("Note ID is required for update".to_string())?;
        let updated_at = chrono::Utc::now().to_rfc3339();

        conn.execute(
            "UPDATE notes SET
                book_id = ?2, reading_id = ?3, page = ?4, content = ?5,
                updated_at = ?6
            WHERE id = ?1",
            params![
                id,
                note.book_id,
                note.reading_id,
                note.page,
                note.content,
                updated_at
            ],
        )
        .map_err(|e| format!("Failed to update note: {}", e))?;

        Ok(())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM notes WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete note: {}", e))?;

        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Note>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, content,
                 created_at, updated_at
                 FROM notes WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_result = stmt
            .query_row(params![id], |row| Self::row_to_note(row));

        match note_result {
            Ok(note) => Ok(Some(note)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find note: {}", e)),
        }
    }

    fn find_all(&self) -> Result<Vec<Note>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, content,
                 created_at, updated_at
                 FROM notes ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_iter = stmt
            .query_map([], |row| Self::row_to_note(row))
            .map_err(|e| format!("Failed to query notes: {}", e))?;

        let mut notes = Vec::new();
        for note_result in note_iter {
            notes.push(note_result.map_err(|e| format!("Failed to parse note: {}", e))?);
        }

        Ok(notes)
    }

    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Note>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, content,
                 created_at, updated_at
                 FROM notes WHERE book_id = ?1 ORDER BY page, created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_iter = stmt
            .query_map(params![book_id], |row| Self::row_to_note(row))
            .map_err(|e| format!("Failed to query notes: {}", e))?;

        let mut notes = Vec::new();
        for note_result in note_iter {
            notes.push(note_result.map_err(|e| format!("Failed to parse note: {}", e))?);
        }

        Ok(notes)
    }

    fn find_by_reading_id(&self, reading_id: i64) -> Result<Vec<Note>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, content,
                 created_at, updated_at
                 FROM notes WHERE reading_id = ?1 ORDER BY page, created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_iter = stmt
            .query_map(params![reading_id], |row| Self::row_to_note(row))
            .map_err(|e| format!("Failed to query notes: {}", e))?;

        let mut notes = Vec::new();
        for note_result in note_iter {
            notes.push(note_result.map_err(|e| format!("Failed to parse note: {}", e))?);
        }

        Ok(notes)
    }

    fn search_by_content(&self, query: &str) -> Result<Vec<Note>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        let search_query = format!("%{}%", query);
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, content,
                 created_at, updated_at
                 FROM notes WHERE content LIKE ?1
                 ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_iter = stmt
            .query_map(params![search_query], |row| Self::row_to_note(row))
            .map_err(|e| format!("Failed to query notes: {}", e))?;

        let mut notes = Vec::new();
        for note_result in note_iter {
            notes.push(note_result.map_err(|e| format!("Failed to parse note: {}", e))?);
        }

        Ok(notes)
    }
}

