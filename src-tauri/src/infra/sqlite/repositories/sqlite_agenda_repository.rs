use crate::core::domains::agenda_block::AgendaBlock;
use crate::core::interfaces::secondary::agenda_repository::AgendaRepository;
use crate::core::filters::AgendaBlockFilters;
use rusqlite::{params, types::Value, Connection, Row};
use std::sync::{Arc, Mutex};
use chrono::{NaiveDate, DateTime, Utc};

pub struct SqliteAgendaRepository {
    connection: Arc<Mutex<Connection>>,
}

impl SqliteAgendaRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        SqliteAgendaRepository { connection }
    }

    fn row_to_block(&self, row: &Row) -> Result<AgendaBlock, rusqlite::Error> {
        let id: i64 = row.get(0)?;
        let book_id: Option<i64> = row.get(1)?;
        let scheduled_date_str: String = row.get(2)?;
        let start_time: Option<String> = row.get(3)?;
        let end_time: Option<String> = row.get(4)?;
        let is_completed: i32 = row.get(5)?;
        let completed_session_id: Option<i64> = row.get(6)?;
        let notes: Option<String> = row.get(7)?;
        let created_at_str: String = row.get(8)?;
        let updated_at_str: String = row.get(9)?;

        let scheduled_date = NaiveDate::parse_from_str(&scheduled_date_str, "%Y-%m-%d")
            .map_err(|e| rusqlite::Error::InvalidColumnType(2, "scheduled_date".to_string(), rusqlite::types::Type::Text))?;
        
        let created_at = DateTime::parse_from_rfc3339(&created_at_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(8, "created_at".to_string(), rusqlite::types::Type::Text))?
            .with_timezone(&Utc);
        
        let updated_at = DateTime::parse_from_rfc3339(&updated_at_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(9, "updated_at".to_string(), rusqlite::types::Type::Text))?
            .with_timezone(&Utc);

        Ok(AgendaBlock {
            id: Some(id),
            book_id,
            scheduled_date,
            start_time,
            end_time,
            is_completed: is_completed != 0,
            completed_session_id,
            notes,
            created_at,
            updated_at,
        })
    }
}

impl AgendaRepository for SqliteAgendaRepository {
    fn create(&self, block: &AgendaBlock) -> Result<AgendaBlock, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "INSERT INTO agenda_blocks (book_id, scheduled_date, start_time, end_time, is_completed, completed_session_id, notes, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                block.book_id,
                block.scheduled_date.format("%Y-%m-%d").to_string(),
                block.start_time,
                block.end_time,
                if block.is_completed { 1 } else { 0 },
                block.completed_session_id,
                block.notes,
                block.created_at.to_rfc3339(),
                block.updated_at.to_rfc3339(),
            ],
        )
        .map_err(|e| format!("Failed to create agenda block: {}", e))?;

        let id = conn.last_insert_rowid();
        drop(conn);

        Ok(AgendaBlock {
            id: Some(id),
            scheduled_date: block.scheduled_date,
            start_time: block.start_time.clone(),
            end_time: block.end_time.clone(),
            is_completed: block.is_completed,
            completed_session_id: block.completed_session_id,
            notes: block.notes.clone(),
            created_at: block.created_at,
            updated_at: block.updated_at,
            book_id: block.book_id,
        })
    }

    fn update(&self, block: &AgendaBlock) -> Result<AgendaBlock, String> {
        let id = block.id.ok_or("Agenda block ID is required for update".to_string())?;
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "UPDATE agenda_blocks
             SET book_id = ?1, scheduled_date = ?2, start_time = ?3, end_time = ?4, 
                 is_completed = ?5, completed_session_id = ?6, notes = ?7, updated_at = ?8
             WHERE id = ?9",
            params![
                block.book_id,
                block.scheduled_date.format("%Y-%m-%d").to_string(),
                block.start_time,
                block.end_time,
                if block.is_completed { 1 } else { 0 },
                block.completed_session_id,
                block.notes,
                block.updated_at.to_rfc3339(),
                id,
            ],
        )
        .map_err(|e| format!("Failed to update agenda block: {}", e))?;

        // Fetch the updated block from database to ensure we have the latest data
        // (especially important if there are triggers that modify fields)
        drop(conn);
        self.find_by_id(id)
            .and_then(|opt| opt.ok_or_else(|| format!("Agenda block with id {} not found after update", id)))
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM agenda_blocks WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete agenda block: {}", e))?;

        drop(conn);
        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<AgendaBlock>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, scheduled_date, start_time, end_time, is_completed, 
                        completed_session_id, notes, created_at, updated_at
                 FROM agenda_blocks WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let result = stmt.query_row(params![id], |row| self.row_to_block(row));
        
        match result {
            Ok(block) => Ok(Some(block)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find agenda block: {}", e)),
        }
    }

    fn find_all(&self, filters: &AgendaBlockFilters) -> Result<Vec<AgendaBlock>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut query = "SELECT id, book_id, scheduled_date, start_time, end_time, is_completed, 
                                completed_session_id, notes, created_at, updated_at
                        FROM agenda_blocks WHERE 1=1".to_string();
        let mut param_values: Vec<Value> = Vec::new();

        if let Some(book_id) = filters.book_id {
            query.push_str(" AND book_id = ?");
            param_values.push(Value::Integer(book_id));
        }

        if let Some(start_date) = filters.start_date {
            query.push_str(" AND scheduled_date >= ?");
            param_values.push(Value::Text(start_date.format("%Y-%m-%d").to_string()));
        }

        if let Some(end_date) = filters.end_date {
            query.push_str(" AND scheduled_date <= ?");
            param_values.push(Value::Text(end_date.format("%Y-%m-%d").to_string()));
        }

        if let Some(is_completed) = filters.is_completed {
            query.push_str(" AND is_completed = ?");
            param_values.push(Value::Integer(if is_completed { 1 } else { 0 }));
        }

        query.push_str(" ORDER BY scheduled_date ASC, start_time ASC");

        let mut stmt = conn
            .prepare(&query)
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let rows = stmt
            .query_map(rusqlite::params_from_iter(param_values.iter()), |row| {
                self.row_to_block(row)
            })
            .map_err(|e| format!("Failed to query agenda blocks: {}", e))?;

        let mut blocks = Vec::new();
        for row_result in rows {
            blocks.push(row_result.map_err(|e| format!("Failed to read agenda block: {}", e))?);
        }

        Ok(blocks)
    }
}

