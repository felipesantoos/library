pub mod commands;
pub mod errors;

use crate::infrastructure::database::DatabaseConnection;
use std::sync::Mutex;

/// App state containing database connection
/// This is managed by Tauri's state system
pub struct AppState {
    pub(crate) db_connection: Mutex<DatabaseConnection>,
}

impl AppState {
    pub fn new(db_connection: DatabaseConnection) -> Self {
        AppState {
            db_connection: Mutex::new(db_connection),
        }
    }
}

