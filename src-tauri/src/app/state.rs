use crate::infra::sqlite::database::DatabaseConnection;
use crate::app::dicontainer::DIContainer;
use std::sync::Mutex;

/// App state containing database connection
/// This is managed by Tauri's state system
pub struct AppState {
    pub(crate) db_connection: Mutex<DatabaseConnection>,
    pub(crate) container: Mutex<DIContainer>,
}

impl AppState {
    pub fn new(db_connection: DatabaseConnection) -> Self {
        let container = DIContainer::new(db_connection.clone());
        AppState {
            db_connection: Mutex::new(db_connection),
            container: Mutex::new(container),
        }
    }
}

