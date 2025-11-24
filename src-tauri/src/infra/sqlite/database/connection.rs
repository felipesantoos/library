use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

/// Database connection wrapper
pub struct DatabaseConnection {
    connection: Arc<Mutex<Connection>>,
}

impl DatabaseConnection {
    /// Creates a new database connection
    pub fn new() -> Result<Self, String> {
        let db_path = Self::get_database_path()?;
        
        // Ensure parent directory exists
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| {
                format!("Failed to create database directory: {}", e)
            })?;
        }

        let conn = Connection::open(&db_path).map_err(|e| {
            format!("Failed to open database: {}", e)
        })?;

        // Enable foreign keys
        conn.execute("PRAGMA foreign_keys = ON", [])
            .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

        Ok(DatabaseConnection {
            connection: Arc::new(Mutex::new(conn)),
        })
    }

    /// Gets a reference to the connection (for use in repositories)
    pub fn get_connection(&self) -> Arc<Mutex<Connection>> {
        self.connection.clone()
    }

    /// Gets the database file path in app data directory
    fn get_database_path() -> Result<PathBuf, String> {
        let app_data_dir = dirs::data_dir()
            .ok_or("Failed to get app data directory")?;
        
        let app_dir = app_data_dir.join("library");
        Ok(app_dir.join("library.db"))
    }

    /// Gets the database path (public for migrations)
    pub fn database_path() -> Result<PathBuf, String> {
        Self::get_database_path()
    }
}

impl Clone for DatabaseConnection {
    fn clone(&self) -> Self {
        DatabaseConnection {
            connection: self.connection.clone(),
        }
    }
}

unsafe impl Send for DatabaseConnection {}
unsafe impl Sync for DatabaseConnection {}

