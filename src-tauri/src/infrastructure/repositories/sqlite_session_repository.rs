use crate::domain::entities::ReadingSession;
use crate::ports::repositories::SessionRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of SessionRepository
pub struct SqliteSessionRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteSessionRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteSessionRepository { connection }
    }

    fn row_to_session(row: &rusqlite::Row) -> Result<ReadingSession, rusqlite::Error> {
        let session_date_str: String = row.get(3)?;
        let session_date = chrono::NaiveDate::parse_from_str(&session_date_str, "%Y-%m-%d")
            .map_err(|_| rusqlite::Error::InvalidColumnType(3, "Invalid date".to_string(), rusqlite::types::Type::Text))?;

        let start_time_str: Option<String> = row.get(4)?;
        let start_time = start_time_str
            .and_then(|s| chrono::NaiveTime::parse_from_str(&s, "%H:%M:%S").ok());

        let end_time_str: Option<String> = row.get(5)?;
        let end_time = end_time_str
            .and_then(|s| chrono::NaiveTime::parse_from_str(&s, "%H:%M:%S").ok());

        Ok(ReadingSession {
            id: Some(row.get(0)?),
            book_id: row.get(1)?,
            reading_id: row.get(2)?,
            session_date,
            start_time,
            end_time,
            start_page: row.get(6)?,
            end_page: row.get(7)?,
            pages_read: row.get(8)?,
            minutes_read: row.get(9)?,
            duration_seconds: row.get(10)?,
            notes: row.get(11)?,
            photo_path: row.get(12)?,
            created_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(13, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
            updated_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(14, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
        })
    }
}

impl SessionRepository for SqliteSessionRepository {
    fn create(&self, session: &mut ReadingSession) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let session_date_str = session.session_date.format("%Y-%m-%d").to_string();
        let start_time_str = session.start_time.map(|t| t.format("%H:%M:%S").to_string());
        let end_time_str = session.end_time.map(|t| t.format("%H:%M:%S").to_string());
        let created_at = session.created_at.to_rfc3339();
        let updated_at = session.updated_at.to_rfc3339();

        conn.execute(
            "INSERT INTO reading_sessions (
                book_id, reading_id, session_date, start_time, end_time,
                start_page, end_page, pages_read, minutes_read, duration_seconds,
                notes, photo_path, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
            params![
                session.book_id,
                session.reading_id,
                session_date_str,
                start_time_str,
                end_time_str,
                session.start_page,
                session.end_page,
                session.pages_read,
                session.minutes_read,
                session.duration_seconds,
                session.notes,
                session.photo_path,
                created_at,
                updated_at
            ],
        )
        .map_err(|e| format!("Failed to insert session: {}", e))?;

        session.id = Some(conn.last_insert_rowid());
        Ok(())
    }

    fn update(&self, session: &ReadingSession) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let id = session.id.ok_or("Session ID is required for update".to_string())?;
        let session_date_str = session.session_date.format("%Y-%m-%d").to_string();
        let start_time_str = session.start_time.map(|t| t.format("%H:%M:%S").to_string());
        let end_time_str = session.end_time.map(|t| t.format("%H:%M:%S").to_string());
        let updated_at = chrono::Utc::now().to_rfc3339();

        conn.execute(
            "UPDATE reading_sessions SET
                book_id = ?2, reading_id = ?3, session_date = ?4, start_time = ?5, end_time = ?6,
                start_page = ?7, end_page = ?8, pages_read = ?9, minutes_read = ?10,
                duration_seconds = ?11, notes = ?12, photo_path = ?13, updated_at = ?14
            WHERE id = ?1",
            params![
                id,
                session.book_id,
                session.reading_id,
                session_date_str,
                start_time_str,
                end_time_str,
                session.start_page,
                session.end_page,
                session.pages_read,
                session.minutes_read,
                session.duration_seconds,
                session.notes,
                session.photo_path,
                updated_at
            ],
        )
        .map_err(|e| format!("Failed to update session: {}", e))?;

        Ok(())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM reading_sessions WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete session: {}", e))?;

        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<ReadingSession>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, session_date, start_time, end_time,
                 start_page, end_page, pages_read, minutes_read, duration_seconds,
                 notes, photo_path, created_at, updated_at
                 FROM reading_sessions WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let session_result = stmt
            .query_row(params![id], |row| Self::row_to_session(row));

        match session_result {
            Ok(session) => Ok(Some(session)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find session: {}", e)),
        }
    }

    fn find_all(&self) -> Result<Vec<ReadingSession>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, session_date, start_time, end_time,
                 start_page, end_page, pages_read, minutes_read, duration_seconds,
                 notes, photo_path, created_at, updated_at
                 FROM reading_sessions ORDER BY session_date DESC, created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let session_iter = stmt
            .query_map([], |row| Self::row_to_session(row))
            .map_err(|e| format!("Failed to query sessions: {}", e))?;

        let mut sessions = Vec::new();
        for session_result in session_iter {
            sessions.push(session_result.map_err(|e| format!("Failed to parse session: {}", e))?);
        }

        Ok(sessions)
    }

    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<ReadingSession>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, session_date, start_time, end_time,
                 start_page, end_page, pages_read, minutes_read, duration_seconds,
                 notes, photo_path, created_at, updated_at
                 FROM reading_sessions WHERE book_id = ?1
                 ORDER BY session_date DESC, created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let session_iter = stmt
            .query_map(params![book_id], |row| Self::row_to_session(row))
            .map_err(|e| format!("Failed to query sessions: {}", e))?;

        let mut sessions = Vec::new();
        for session_result in session_iter {
            sessions.push(session_result.map_err(|e| format!("Failed to parse session: {}", e))?);
        }

        Ok(sessions)
    }

    fn find_by_reading_id(&self, reading_id: i64) -> Result<Vec<ReadingSession>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, session_date, start_time, end_time,
                 start_page, end_page, pages_read, minutes_read, duration_seconds,
                 notes, photo_path, created_at, updated_at
                 FROM reading_sessions WHERE reading_id = ?1
                 ORDER BY session_date DESC, created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let session_iter = stmt
            .query_map(params![reading_id], |row| Self::row_to_session(row))
            .map_err(|e| format!("Failed to query sessions: {}", e))?;

        let mut sessions = Vec::new();
        for session_result in session_iter {
            sessions.push(session_result.map_err(|e| format!("Failed to parse session: {}", e))?);
        }

        Ok(sessions)
    }

    fn find_by_date_range(
        &self,
        start_date: chrono::NaiveDate,
        end_date: chrono::NaiveDate,
    ) -> Result<Vec<ReadingSession>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let start_str = start_date.format("%Y-%m-%d").to_string();
        let end_str = end_date.format("%Y-%m-%d").to_string();

        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_id, session_date, start_time, end_time,
                 start_page, end_page, pages_read, minutes_read, duration_seconds,
                 notes, photo_path, created_at, updated_at
                 FROM reading_sessions 
                 WHERE session_date >= ?1 AND session_date <= ?2
                 ORDER BY session_date DESC, created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let session_iter = stmt
            .query_map(params![start_str, end_str], |row| Self::row_to_session(row))
            .map_err(|e| format!("Failed to query sessions: {}", e))?;

        let mut sessions = Vec::new();
        for session_result in session_iter {
            sessions.push(session_result.map_err(|e| format!("Failed to parse session: {}", e))?);
        }

        Ok(sessions)
    }
}

