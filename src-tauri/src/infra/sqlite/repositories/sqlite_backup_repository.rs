use crate::core::interfaces::secondary::backup_repository::{Backup, BackupRepository, BackupType};
use rusqlite::{params, Connection, Row};
use std::sync::{Arc, Mutex};
use chrono::{DateTime, Utc};

pub struct SqliteBackupRepository {
    connection: Arc<Mutex<Connection>>,
}

impl SqliteBackupRepository {
    pub fn new(connection: Arc<Mutex<Connection>>) -> Self {
        SqliteBackupRepository { connection }
    }

    fn backup_type_to_string(backup_type: &BackupType) -> &'static str {
        match backup_type {
            BackupType::Full => "full",
            BackupType::Partial => "partial",
            BackupType::YearStats => "year_stats",
            BackupType::SingleBook => "single_book",
        }
    }

    fn string_to_backup_type(s: &str) -> Result<BackupType, String> {
        match s {
            "full" => Ok(BackupType::Full),
            "partial" => Ok(BackupType::Partial),
            "year_stats" => Ok(BackupType::YearStats),
            "single_book" => Ok(BackupType::SingleBook),
            _ => Err(format!("Invalid backup type: {}", s)),
        }
    }

    fn row_to_backup(&self, row: &Row) -> Result<Backup, rusqlite::Error> {
        let id: i64 = row.get(0)?;
        let file_path: String = row.get(1)?;
        let file_name: String = row.get(2)?;
        let backup_type_str: String = row.get(3)?;
        let metadata: Option<String> = row.get(4)?;
        let created_at_str: String = row.get(5)?;

        let backup_type = Self::string_to_backup_type(&backup_type_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(3, "backup_type".to_string(), rusqlite::types::Type::Text))?;

        let created_at = DateTime::parse_from_rfc3339(&created_at_str)
            .map_err(|_| rusqlite::Error::InvalidColumnType(5, "created_at".to_string(), rusqlite::types::Type::Text))?
            .with_timezone(&Utc);

        Ok(Backup {
            id: Some(id),
            file_path,
            file_name,
            backup_type,
            metadata,
            created_at,
        })
    }
}

impl BackupRepository for SqliteBackupRepository {
    fn create(&self, backup: &Backup) -> Result<Backup, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "INSERT INTO backups (file_path, file_name, backup_type, metadata, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                backup.file_path,
                backup.file_name,
                Self::backup_type_to_string(&backup.backup_type),
                backup.metadata,
                backup.created_at.to_rfc3339(),
            ],
        )
        .map_err(|e| format!("Failed to create backup record: {}", e))?;

        let id = conn.last_insert_rowid();
        drop(conn);

        Ok(Backup {
            id: Some(id),
            file_path: backup.file_path.clone(),
            file_name: backup.file_name.clone(),
            backup_type: backup.backup_type.clone(),
            metadata: backup.metadata.clone(),
            created_at: backup.created_at,
        })
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Backup>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, file_path, file_name, backup_type, metadata, created_at
                 FROM backups WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let result = stmt.query_row(params![id], |row| self.row_to_backup(row));
        
        match result {
            Ok(backup) => Ok(Some(backup)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find backup: {}", e)),
        }
    }

    fn find_most_recent(&self, backup_type: Option<BackupType>) -> Result<Option<Backup>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let result = if let Some(bt) = backup_type {
            let type_str = Self::backup_type_to_string(&bt);
            let mut stmt = conn.prepare(
                "SELECT id, file_path, file_name, backup_type, metadata, created_at
                 FROM backups WHERE backup_type = ?1 ORDER BY created_at DESC LIMIT 1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;
            
            stmt.query_row(params![type_str], |row| self.row_to_backup(row))
        } else {
            let mut stmt = conn.prepare(
                "SELECT id, file_path, file_name, backup_type, metadata, created_at
                 FROM backups ORDER BY created_at DESC LIMIT 1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;
            
            stmt.query_row([], |row| self.row_to_backup(row))
        };
        
        match result {
            Ok(backup) => Ok(Some(backup)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find most recent backup: {}", e)),
        }
    }

    fn find_all(&self, backup_type: Option<BackupType>) -> Result<Vec<Backup>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut backups = Vec::new();
        
        if let Some(bt) = backup_type {
            let type_str = Self::backup_type_to_string(&bt);
            let mut stmt = conn.prepare(
                "SELECT id, file_path, file_name, backup_type, metadata, created_at
                 FROM backups WHERE backup_type = ?1 ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;
            
            let rows = stmt.query_map(params![type_str], |row| self.row_to_backup(row))
                .map_err(|e| format!("Failed to query backups: {}", e))?;
            
            for row_result in rows {
                match row_result {
                    Ok(backup) => backups.push(backup),
                    Err(e) => return Err(format!("Failed to read backup: {}", e)),
                }
            }
        } else {
            let mut stmt = conn.prepare(
                "SELECT id, file_path, file_name, backup_type, metadata, created_at
                 FROM backups ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;
            
            let rows = stmt.query_map([], |row| self.row_to_backup(row))
                .map_err(|e| format!("Failed to query backups: {}", e))?;
            
            for row_result in rows {
                match row_result {
                    Ok(backup) => backups.push(backup),
                    Err(e) => return Err(format!("Failed to read backup: {}", e)),
                }
            }
        }

        Ok(backups)
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM backups WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete backup: {}", e))?;

        drop(conn);
        Ok(())
    }
}

