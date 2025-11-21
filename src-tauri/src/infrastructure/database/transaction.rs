use rusqlite::Connection;
use std::sync::{Arc, Mutex, MutexGuard};

/// Executes a closure within a database transaction
/// Returns Ok(()) if transaction commits, Err if it rolls back
pub fn with_transaction<F, E>(conn: Arc<Mutex<Connection>>, f: F) -> Result<(), String>
where
    F: FnOnce(&mut MutexGuard<'_, Connection>) -> Result<(), E>,
    E: std::fmt::Display,
{
    // Start transaction
    let mut locked_conn = conn.lock().map_err(|e| format!("Lock error: {}", e))?;
    locked_conn.execute("BEGIN TRANSACTION", [])
        .map_err(|e| format!("Failed to start transaction: {}", e))?;
    
    // Execute the closure
    let result = f(&mut locked_conn);
    
    match result {
        Ok(()) => {
            // Commit transaction
            locked_conn.execute("COMMIT", [])
                .map_err(|e| format!("Failed to commit transaction: {}", e))?;
            Ok(())
        }
        Err(e) => {
            // Rollback transaction
            let _ = locked_conn.execute("ROLLBACK", []);
            Err(format!("Transaction failed: {}", e))
        }
    }
}

