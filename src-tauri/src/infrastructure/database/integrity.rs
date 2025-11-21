use rusqlite::{Connection, Result as SqliteResult};
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntegrityIssue {
    pub issue_type: String,
    pub table: String,
    pub id: Option<i64>,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntegrityReport {
    pub is_valid: bool,
    pub issues: Vec<IntegrityIssue>,
}

/// Performs data integrity checks on the database
pub struct IntegrityChecker {
    connection: Arc<Mutex<Connection>>,
}

impl IntegrityChecker {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        IntegrityChecker { connection }
    }

    /// Runs all integrity checks and returns a report
    pub fn check_all(&self) -> Result<IntegrityReport, String> {
        let mut issues = Vec::new();

        // Check foreign key constraints
        issues.extend(self.check_foreign_keys()?);

        // Check for orphaned records
        issues.extend(self.check_orphaned_records()?);

        // Check for invalid references
        issues.extend(self.check_invalid_references()?);

        // Check for data inconsistencies
        issues.extend(self.check_data_inconsistencies()?);

        let is_valid = issues.is_empty();

        Ok(IntegrityReport { is_valid, issues })
    }

    /// Checks foreign key constraints
    fn check_foreign_keys(&self) -> Result<Vec<IntegrityIssue>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        let mut issues = Vec::new();

        // Check sessions with invalid book_id
        let mut stmt = conn
            .prepare(
                "SELECT s.id, s.book_id FROM reading_sessions s
                 LEFT JOIN books b ON s.book_id = b.id
                 WHERE b.id IS NULL"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let orphaned_sessions = stmt.query_map([], |row| {
            Ok((row.get::<_, i64>(0)?, row.get::<_, i64>(1)?))
        }).map_err(|e| format!("Failed to query: {}", e))?;

        for session_result in orphaned_sessions {
            let (session_id, book_id) = session_result.map_err(|e| format!("Row error: {}", e))?;
            issues.push(IntegrityIssue {
                issue_type: "orphaned_foreign_key".to_string(),
                table: "reading_sessions".to_string(),
                id: Some(session_id),
                description: format!("Session {} references non-existent book {}", session_id, book_id),
            });
        }

        // Check notes with invalid book_id
        let mut stmt = conn
            .prepare(
                "SELECT n.id, n.book_id FROM notes n
                 LEFT JOIN books b ON n.book_id = b.id
                 WHERE n.book_id IS NOT NULL AND b.id IS NULL"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let orphaned_notes = stmt.query_map([], |row| {
            Ok((row.get::<_, i64>(0)?, row.get::<_, i64>(1)?))
        }).map_err(|e| format!("Failed to query: {}", e))?;

        for note_result in orphaned_notes {
            let (note_id, book_id) = note_result.map_err(|e| format!("Row error: {}", e))?;
            issues.push(IntegrityIssue {
                issue_type: "orphaned_foreign_key".to_string(),
                table: "notes".to_string(),
                id: Some(note_id),
                description: format!("Note {} references non-existent book {}", note_id, book_id),
            });
        }

        // Check reading_sessions with invalid reading_id
        let mut stmt = conn
            .prepare(
                "SELECT s.id, s.reading_id FROM reading_sessions s
                 LEFT JOIN book_readings r ON s.reading_id = r.id
                 WHERE s.reading_id IS NOT NULL AND r.id IS NULL"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let orphaned_sessions_by_reading = stmt.query_map([], |row| {
            Ok((row.get::<_, i64>(0)?, row.get::<_, Option<i64>>(1)?))
        }).map_err(|e| format!("Failed to query: {}", e))?;

        for session_result in orphaned_sessions_by_reading {
            let (session_id, reading_id) = session_result.map_err(|e| format!("Row error: {}", e))?;
            if let Some(rid) = reading_id {
                issues.push(IntegrityIssue {
                    issue_type: "orphaned_foreign_key".to_string(),
                    table: "reading_sessions".to_string(),
                    id: Some(session_id),
                    description: format!("Session {} references non-existent reading {}", session_id, rid),
                });
            }
        }

        Ok(issues)
    }

    /// Checks for orphaned records (records without parent)
    fn check_orphaned_records(&self) -> Result<Vec<IntegrityIssue>, String> {
        // Most orphaned record checks are covered by foreign key checks
        // This can be expanded for specific cases
        Ok(Vec::new())
    }

    /// Checks for invalid references (e.g., references to deleted records)
    fn check_invalid_references(&self) -> Result<Vec<IntegrityIssue>, String> {
        // Similar to orphaned records, covered by foreign key checks
        Ok(Vec::new())
    }

    /// Checks for data inconsistencies (e.g., progress > total, dates in future, etc.)
    fn check_data_inconsistencies(&self) -> Result<Vec<IntegrityIssue>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        let mut issues = Vec::new();

        // Check books where current_page_text > total_pages
        let mut stmt = conn
            .prepare(
                "SELECT id, title, current_page_text, total_pages FROM books
                 WHERE total_pages IS NOT NULL
                 AND current_page_text > total_pages"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let inconsistent_books = stmt.query_map([], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, i32>(2)?,
                row.get::<_, i32>(3)?,
            ))
        }).map_err(|e| format!("Failed to query: {}", e))?;

        for book_result in inconsistent_books {
            let (book_id, title, current, total) = book_result.map_err(|e| format!("Row error: {}", e))?;
            issues.push(IntegrityIssue {
                issue_type: "data_inconsistency".to_string(),
                table: "books".to_string(),
                id: Some(book_id),
                description: format!(
                    "Book '{}' has current page ({}) greater than total pages ({})",
                    title, current, total
                ),
            });
        }

        // Check sessions where end_page < start_page
        let mut stmt = conn
            .prepare(
                "SELECT id, book_id, start_page, end_page FROM reading_sessions
                 WHERE start_page IS NOT NULL AND end_page IS NOT NULL
                 AND end_page < start_page"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let inconsistent_sessions = stmt.query_map([], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, i64>(1)?,
                row.get::<_, i32>(2)?,
                row.get::<_, i32>(3)?,
            ))
        }).map_err(|e| format!("Failed to query: {}", e))?;

        for session_result in inconsistent_sessions {
            let (session_id, book_id, start, end) = session_result.map_err(|e| format!("Row error: {}", e))?;
            issues.push(IntegrityIssue {
                issue_type: "data_inconsistency".to_string(),
                table: "reading_sessions".to_string(),
                id: Some(session_id),
                description: format!(
                    "Session {} for book {} has end page ({}) less than start page ({})",
                    session_id, book_id, end, start
                ),
            });
        }

        Ok(issues)
    }
}

