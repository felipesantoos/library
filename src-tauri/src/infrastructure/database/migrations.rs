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
        }

        // Future: Add version tracking and incremental migrations here
        // For now, we just initialize once

        Ok(())
    }
}
