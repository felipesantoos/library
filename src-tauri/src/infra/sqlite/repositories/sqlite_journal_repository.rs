use crate::core::domains::journal_entry::JournalEntry;
use crate::core::interfaces::secondary::journal_repository::JournalRepository;
use rusqlite::{params, Connection, Row};
use std::sync::{Arc, Mutex};
use chrono::{NaiveDate, DateTime, Utc};

pub struct SqliteJournalRepository {
    connection: Arc<Mutex<Connection>>,
}

impl SqliteJournalRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        SqliteJournalRepository { connection }
    }

    fn row_to_entry(&self, row: &Row) -> Result<JournalEntry, rusqlite::Error> {
        let id: i64 = row.get(0)?;
        let entry_date_str: String = row.get(1)?;
        let content: String = row.get(2)?;
        let book_id: Option<i64> = row.get(3)?;
        let created_at_str: String = row.get(4)?;
        let updated_at_str: String = row.get(5)?;

        let entry_date = NaiveDate::parse_from_str(&entry_date_str, "%Y-%m-%d")
            .map_err(|e| rusqlite::Error::InvalidColumnType(0, "entry_date".to_string(), rusqlite::types::Type::Text))?;
        
        let created_at = DateTime::parse_from_rfc3339(&created_at_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(4, "created_at".to_string(), rusqlite::types::Type::Text))?
            .with_timezone(&Utc);
        
        let updated_at = DateTime::parse_from_rfc3339(&updated_at_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(5, "updated_at".to_string(), rusqlite::types::Type::Text))?
            .with_timezone(&Utc);

        Ok(JournalEntry {
            id: Some(id),
            entry_date,
            content,
            book_id,
            created_at,
            updated_at,
        })
    }
}

impl JournalRepository for SqliteJournalRepository {
    fn create(&self, entry: &JournalEntry) -> Result<JournalEntry, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "INSERT INTO journal_entries (entry_date, content, book_id, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                entry.entry_date.format("%Y-%m-%d").to_string(),
                entry.content,
                entry.book_id,
                entry.created_at.to_rfc3339(),
                entry.updated_at.to_rfc3339(),
            ],
        )
        .map_err(|e| format!("Failed to create journal entry: {}", e))?;

        let id = conn.last_insert_rowid();
        drop(conn);

        Ok(JournalEntry {
            id: Some(id),
            entry_date: entry.entry_date,
            content: entry.content.clone(),
            book_id: entry.book_id,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
        })
    }

    fn update(&self, entry: &JournalEntry) -> Result<JournalEntry, String> {
        let id = entry.id.ok_or("Journal entry ID is required for update".to_string())?;
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "UPDATE journal_entries
             SET entry_date = ?1, content = ?2, book_id = ?3, updated_at = ?4
             WHERE id = ?5",
            params![
                entry.entry_date.format("%Y-%m-%d").to_string(),
                entry.content,
                entry.book_id,
                entry.updated_at.to_rfc3339(),
                id,
            ],
        )
        .map_err(|e| format!("Failed to update journal entry: {}", e))?;

        drop(conn);
        Ok(entry.clone())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM journal_entries WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete journal entry: {}", e))?;

        drop(conn);
        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<JournalEntry>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, entry_date, content, book_id, created_at, updated_at
                 FROM journal_entries WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let result = stmt.query_row(params![id], |row| self.row_to_entry(row));
        
        match result {
            Ok(entry) => Ok(Some(entry)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find journal entry: {}", e)),
        }
    }

    fn find_all(
        &self,
        book_id: Option<i64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
    ) -> Result<Vec<JournalEntry>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut query = "SELECT id, entry_date, content, book_id, created_at, updated_at
                        FROM journal_entries WHERE 1=1".to_string();
        let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if let Some(book_id) = book_id {
            query.push_str(" AND book_id = ?");
            params_vec.push(Box::new(book_id));
        }

        if let Some(start_date) = start_date {
            query.push_str(" AND entry_date >= ?");
            params_vec.push(Box::new(start_date.format("%Y-%m-%d").to_string()));
        }

        if let Some(end_date) = end_date {
            query.push_str(" AND entry_date <= ?");
            params_vec.push(Box::new(end_date.format("%Y-%m-%d").to_string()));
        }

        query.push_str(" ORDER BY entry_date DESC, created_at DESC");

        let mut stmt = conn
            .prepare(&query)
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let rows = stmt
            .query_map(rusqlite::params_from_iter(params_vec.iter()), |row| {
                self.row_to_entry(row)
            })
            .map_err(|e| format!("Failed to query journal entries: {}", e))?;

        let mut entries = Vec::new();
        for row_result in rows {
            match row_result {
                Ok(entry) => entries.push(entry),
                Err(e) => return Err(format!("Failed to read journal entry: {}", e)),
            }
        }

        Ok(entries)
    }

    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<JournalEntry>, String> {
        self.find_all(Some(book_id), None, None)
    }

    fn find_by_date_range(
        &self,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<Vec<JournalEntry>, String> {
        self.find_all(None, Some(start_date), Some(end_date))
    }
}

