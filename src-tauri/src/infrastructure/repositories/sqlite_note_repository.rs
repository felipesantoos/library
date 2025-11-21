use crate::domain::entities::{Note, NoteType, Sentiment};
use crate::ports::repositories::NoteRepository;
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

    fn note_type_to_string(note_type: &NoteType) -> String {
        match note_type {
            NoteType::Note => "note".to_string(),
            NoteType::Highlight => "highlight".to_string(),
        }
    }

    fn string_to_note_type(s: &str) -> Result<NoteType, String> {
        match s {
            "note" => Ok(NoteType::Note),
            "highlight" => Ok(NoteType::Highlight),
            _ => Err(format!("Invalid note type: {}", s)),
        }
    }

    fn sentiment_to_string(sentiment: &Sentiment) -> String {
        match sentiment {
            Sentiment::Inspiration => "inspiration".to_string(),
            Sentiment::Doubt => "doubt".to_string(),
            Sentiment::Reflection => "reflection".to_string(),
            Sentiment::Learning => "learning".to_string(),
        }
    }

    fn string_to_sentiment(s: &str) -> Result<Sentiment, String> {
        match s {
            "inspiration" => Ok(Sentiment::Inspiration),
            "doubt" => Ok(Sentiment::Doubt),
            "reflection" => Ok(Sentiment::Reflection),
            "learning" => Ok(Sentiment::Learning),
            _ => Err(format!("Invalid sentiment: {}", s)),
        }
    }

    fn row_to_note(row: &rusqlite::Row) -> Result<Note, rusqlite::Error> {
        let note_type_str: String = row.get(4)?;
        let sentiment_str: Option<String> = row.get(7)?;

        Ok(Note {
            id: Some(row.get(0)?),
            book_id: row.get(1)?,
            reading_id: row.get(2)?,
            page: row.get(3)?,
            note_type: Self::string_to_note_type(&note_type_str)
                .map_err(|e| rusqlite::Error::InvalidColumnType(4, e, rusqlite::types::Type::Text))?,
            excerpt: row.get(5)?,
            content: row.get(6)?,
            sentiment: sentiment_str
                .map(|s| Self::string_to_sentiment(&s))
                .transpose()
                .map_err(|e| rusqlite::Error::InvalidColumnType(7, e, rusqlite::types::Type::Text))?,
            created_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(8, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
            updated_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(9, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
        })
    }
}

impl NoteRepository for SqliteNoteRepository {
    fn create(&self, note: &mut Note) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let note_type_str = Self::note_type_to_string(&note.note_type);
        let sentiment_str = note.sentiment.as_ref().map(|s| Self::sentiment_to_string(s));
        let created_at = note.created_at.to_rfc3339();
        let updated_at = note.updated_at.to_rfc3339();

        conn.execute(
            "INSERT INTO notes (
                book_id, reading_id, page, type, excerpt, content,
                sentiment, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                note.book_id,
                note.reading_id,
                note.page,
                note_type_str,
                note.excerpt,
                note.content,
                sentiment_str,
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
        let note_type_str = Self::note_type_to_string(&note.note_type);
        let sentiment_str = note.sentiment.as_ref().map(|s| Self::sentiment_to_string(s));
        let updated_at = chrono::Utc::now().to_rfc3339();

        conn.execute(
            "UPDATE notes SET
                book_id = ?2, reading_id = ?3, page = ?4, type = ?5,
                excerpt = ?6, content = ?7, sentiment = ?8, updated_at = ?9
            WHERE id = ?1",
            params![
                id,
                note.book_id,
                note.reading_id,
                note.page,
                note_type_str,
                note.excerpt,
                note.content,
                sentiment_str,
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
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
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
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
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
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
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
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
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

    fn find_by_type(&self, note_type: NoteType) -> Result<Vec<Note>, String> {
        let type_str = Self::note_type_to_string(&note_type);
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
                 FROM notes WHERE type = ?1 ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_iter = stmt
            .query_map(params![type_str], |row| Self::row_to_note(row))
            .map_err(|e| format!("Failed to query notes: {}", e))?;

        let mut notes = Vec::new();
        for note_result in note_iter {
            notes.push(note_result.map_err(|e| format!("Failed to parse note: {}", e))?);
        }

        Ok(notes)
    }

    fn find_by_sentiment(&self, sentiment: Sentiment) -> Result<Vec<Note>, String> {
        let sentiment_str = Self::sentiment_to_string(&sentiment);
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
                 FROM notes WHERE sentiment = ?1 ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let note_iter = stmt
            .query_map(params![sentiment_str], |row| Self::row_to_note(row))
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
                "SELECT id, book_id, reading_id, page, type, excerpt, content,
                 sentiment, created_at, updated_at
                 FROM notes WHERE content LIKE ?1 OR excerpt LIKE ?1
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

