use crate::infra::sqlite::repositories::SqliteBackupRepository;
use crate::core::interfaces::secondary::backup_repository::{Backup, BackupType, BackupRepository};
use crate::app::state::AppState;
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BackupMetadata {
    pub backup_type: String, // "full", "year_stats", "single_book", "notes"
    pub year: Option<i32>,
    pub book_id: Option<i64>,
    pub note_count: Option<usize>,
    pub session_count: Option<usize>,
    pub book_count: Option<usize>,
}

/// Tauri command: Register a backup in the database
#[tauri::command]
pub fn register_backup(
    file_path: String,
    file_name: String,
    backup_type: String,
    metadata: Option<BackupMetadata>,
    state: tauri::State<AppState>,
) -> Result<i64, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBackupRepository::new(sqlite_conn);
    
    let backup_type_enum = match backup_type.as_str() {
        "full" => BackupType::Full,
        "year_stats" => BackupType::YearStats,
        "single_book" => BackupType::SingleBook,
        "notes" => BackupType::Partial,
        _ => return Err("Invalid backup type".to_string()),
    };

    let metadata_json = metadata.as_ref()
        .and_then(|m| serde_json::to_string(m).ok());

    let backup = Backup {
        id: None,
        file_path,
        file_name,
        backup_type: backup_type_enum,
        metadata: metadata_json,
        created_at: Utc::now(),
    };

    let created = repository.create(&backup)?;
    Ok(created.id.ok_or("Failed to get backup ID".to_string())?)
}

/// Tauri command: Get most recent backup date
#[tauri::command]
pub fn get_last_backup_date(
    backup_type: Option<String>,
    state: tauri::State<AppState>,
) -> Result<Option<String>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBackupRepository::new(sqlite_conn);
    
    let backup_type_enum = backup_type.as_ref()
        .and_then(|s| match s.as_str() {
            "full" => Some(BackupType::Full),
            "year_stats" => Some(BackupType::YearStats),
            "single_book" => Some(BackupType::SingleBook),
            "notes" => Some(BackupType::Partial),
            _ => None,
        });

    let backup = repository.find_most_recent(backup_type_enum)?;
    
    Ok(backup.map(|b| b.created_at.to_rfc3339()))
}

/// Tauri command: Get backup metadata
#[tauri::command]
pub fn get_backup_metadata(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<Option<BackupMetadata>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBackupRepository::new(sqlite_conn);
    
    let backup = repository.find_by_id(id)?;
    
    if let Some(backup) = backup {
        if let Some(metadata_json) = backup.metadata {
            let metadata: BackupMetadata = serde_json::from_str(&metadata_json)
                .map_err(|e| format!("Failed to parse metadata: {}", e))?;
            Ok(Some(metadata))
        } else {
            Ok(None)
        }
    } else {
        Ok(None)
    }
}

/// Tauri command: Validate backup JSON structure
#[tauri::command]
pub fn validate_backup_json(json_string: String) -> Result<String, String> {
    let value: serde_json::Value = serde_json::from_str(&json_string)
        .map_err(|e| format!("Invalid JSON: {}", e))?;

    // Check required fields
    if !value.is_object() {
        return Err("Backup must be a JSON object".to_string());
    }

    let obj = value.as_object().unwrap();
    
    if !obj.contains_key("version") {
        return Err("Backup must have 'version' field".to_string());
    }

    if !obj.contains_key("data") {
        return Err("Backup must have 'data' field".to_string());
    }

    let data = obj.get("data").unwrap();
    if !data.is_object() {
        return Err("Backup 'data' field must be an object".to_string());
    }

    Ok("Backup structure is valid".to_string())
}

