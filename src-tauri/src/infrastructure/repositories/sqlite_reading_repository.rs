use crate::domain::entities::reading::{Reading, ReadingStatus};
use crate::ports::repositories::reading_repository::ReadingRepository;
use rusqlite::{params, Connection, Row};
use std::sync::{Arc, Mutex};
use chrono::{DateTime, Utc};

pub struct SqliteReadingRepository {
    connection: Arc<Mutex<Connection>>,
}

impl SqliteReadingRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        SqliteReadingRepository { connection }
    }

    fn status_to_string(status: &ReadingStatus) -> &'static str {
        match status {
            ReadingStatus::NotStarted => "not_started",
            ReadingStatus::Reading => "reading",
            ReadingStatus::Paused => "paused",
            ReadingStatus::Abandoned => "abandoned",
            ReadingStatus::Completed => "completed",
        }
    }

    fn string_to_status(s: &str) -> Result<ReadingStatus, String> {
        match s {
            "not_started" => Ok(ReadingStatus::NotStarted),
            "reading" => Ok(ReadingStatus::Reading),
            "paused" => Ok(ReadingStatus::Paused),
            "abandoned" => Ok(ReadingStatus::Abandoned),
            "completed" => Ok(ReadingStatus::Completed),
            _ => Err(format!("Invalid reading status: {}", s)),
        }
    }

    fn row_to_reading(&self, row: &Row) -> Result<Reading, rusqlite::Error> {
        let id: i64 = row.get(0)?;
        let book_id: i64 = row.get(1)?;
        let reading_number: i32 = row.get(2)?;
        let started_at_str: Option<String> = row.get(3)?;
        let completed_at_str: Option<String> = row.get(4)?;
        let status_str: String = row.get(5)?;
        let created_at_str: String = row.get(6)?;

        let started_at = started_at_str
            .map(|s| DateTime::parse_from_rfc3339(&s).map(|dt| dt.with_timezone(&Utc)))
            .transpose()
            .map_err(|_| rusqlite::Error::InvalidColumnType(3, "started_at".to_string(), rusqlite::types::Type::Text))?;

        let completed_at = completed_at_str
            .map(|s| DateTime::parse_from_rfc3339(&s).map(|dt| dt.with_timezone(&Utc)))
            .transpose()
            .map_err(|_| rusqlite::Error::InvalidColumnType(4, "completed_at".to_string(), rusqlite::types::Type::Text))?;

        let created_at = DateTime::parse_from_rfc3339(&created_at_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(6, "created_at".to_string(), rusqlite::types::Type::Text))?
            .with_timezone(&Utc);

        let status = Self::string_to_status(&status_str)
            .map_err(|e| rusqlite::Error::InvalidColumnType(5, "status".to_string(), rusqlite::types::Type::Text))?;

        Ok(Reading {
            id: Some(id),
            book_id,
            reading_number,
            started_at,
            completed_at,
            status,
            created_at,
        })
    }
}

impl ReadingRepository for SqliteReadingRepository {
    fn create(&self, reading: &Reading) -> Result<Reading, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "INSERT INTO book_readings (book_id, reading_number, started_at, completed_at, status, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                reading.book_id,
                reading.reading_number,
                reading.started_at.map(|dt| dt.to_rfc3339()),
                reading.completed_at.map(|dt| dt.to_rfc3339()),
                Self::status_to_string(&reading.status),
                reading.created_at.to_rfc3339(),
            ],
        )
        .map_err(|e| format!("Failed to create reading: {}", e))?;

        let id = conn.last_insert_rowid();
        drop(conn);

        Ok(Reading {
            id: Some(id),
            book_id: reading.book_id,
            reading_number: reading.reading_number,
            started_at: reading.started_at,
            completed_at: reading.completed_at,
            status: reading.status.clone(),
            created_at: reading.created_at,
        })
    }

    fn update(&self, reading: &Reading) -> Result<Reading, String> {
        let id = reading.id.ok_or("Reading ID is required for update".to_string())?;
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "UPDATE book_readings
             SET started_at = ?1, completed_at = ?2, status = ?3
             WHERE id = ?4",
            params![
                reading.started_at.map(|dt| dt.to_rfc3339()),
                reading.completed_at.map(|dt| dt.to_rfc3339()),
                Self::status_to_string(&reading.status),
                id,
            ],
        )
        .map_err(|e| format!("Failed to update reading: {}", e))?;

        drop(conn);
        Ok(reading.clone())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM book_readings WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete reading: {}", e))?;

        drop(conn);
        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Reading>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_number, started_at, completed_at, status, created_at
                 FROM book_readings WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let result = stmt.query_row(params![id], |row| self.row_to_reading(row));
        
        match result {
            Ok(reading) => Ok(Some(reading)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find reading: {}", e)),
        }
    }

    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Reading>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_number, started_at, completed_at, status, created_at
                 FROM book_readings WHERE book_id = ?1 ORDER BY reading_number ASC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let rows = stmt
            .query_map(params![book_id], |row| self.row_to_reading(row))
            .map_err(|e| format!("Failed to query readings: {}", e))?;

        let mut readings = Vec::new();
        for row_result in rows {
            match row_result {
                Ok(reading) => readings.push(reading),
                Err(e) => return Err(format!("Failed to read reading: {}", e)),
            }
        }

        Ok(readings)
    }

    fn find_current_reading(&self, book_id: i64) -> Result<Option<Reading>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, reading_number, started_at, completed_at, status, created_at
                 FROM book_readings 
                 WHERE book_id = ?1 AND status IN ('reading', 'paused')
                 ORDER BY reading_number DESC
                 LIMIT 1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let result = stmt.query_row(params![book_id], |row| self.row_to_reading(row));
        
        match result {
            Ok(reading) => Ok(Some(reading)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find current reading: {}", e)),
        }
    }

    fn get_next_reading_number(&self, book_id: i64) -> Result<i32, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT MAX(reading_number) FROM book_readings WHERE book_id = ?1")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let max_number: Result<i32, rusqlite::Error> = stmt.query_row(params![book_id], |row| row.get(0));
        
        match max_number {
            Ok(value) => Ok(value + 1),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(1),
            Err(e) => Err(format!("Failed to query max reading number: {}", e)),
        }
    }
}

