use crate::domain::entities::Setting;
use crate::ports::repositories::SettingsRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of SettingsRepository
pub struct SqliteSettingsRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteSettingsRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteSettingsRepository { connection }
    }
}

impl SettingsRepository for SqliteSettingsRepository {
    fn get(&self, key: &str) -> Result<Option<Setting>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT key, value, updated_at FROM settings WHERE key = ?1")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let setting_result = stmt.query_row(params![key], |row| {
            let updated_at_str: String = row.get(2)?;
            let updated_at = chrono::DateTime::parse_from_rfc3339(&updated_at_str)
                .map_err(|_| rusqlite::Error::InvalidColumnType(2, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc);

            Ok(Setting {
                key: row.get(0)?,
                value: row.get(1)?,
                updated_at,
            })
        });

        match setting_result {
            Ok(setting) => Ok(Some(setting)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to get setting: {}", e)),
        }
    }

    fn set(&self, setting: &Setting) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let updated_at = setting.updated_at.to_rfc3339();

        conn.execute(
            "INSERT INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3)
             ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = ?3",
            params![setting.key, setting.value, updated_at],
        )
        .map_err(|e| format!("Failed to set setting: {}", e))?;

        Ok(())
    }

    fn get_all(&self) -> Result<Vec<Setting>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT key, value, updated_at FROM settings ORDER BY key")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let setting_iter = stmt
            .query_map([], |row| {
                let updated_at_str: String = row.get(2)?;
                let updated_at = chrono::DateTime::parse_from_rfc3339(&updated_at_str)
                    .map_err(|_| rusqlite::Error::InvalidColumnType(2, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                    .with_timezone(&chrono::Utc);

                Ok(Setting {
                    key: row.get(0)?,
                    value: row.get(1)?,
                    updated_at,
                })
            })
            .map_err(|e| format!("Failed to query settings: {}", e))?;

        let mut settings = Vec::new();
        for setting_result in setting_iter {
            settings.push(setting_result.map_err(|e| format!("Failed to parse setting: {}", e))?);
        }

        Ok(settings)
    }

    fn delete(&self, key: &str) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM settings WHERE key = ?1", params![key])
            .map_err(|e| format!("Failed to delete setting: {}", e))?;

        Ok(())
    }
}

