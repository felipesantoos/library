use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BackupType {
    Full,
    Partial,
    YearStats,
    SingleBook,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Backup {
    pub id: Option<i64>,
    pub file_path: String,
    pub file_name: String,
    pub backup_type: BackupType,
    pub metadata: Option<String>, // JSON string with details
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Repository trait for backup metadata
pub trait BackupRepository {
    /// Create a new backup record
    fn create(&self, backup: &Backup) -> Result<Backup, String>;

    /// Find backup by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Backup>, String>;

    /// Find most recent backup of a specific type
    fn find_most_recent(&self, backup_type: Option<BackupType>) -> Result<Option<Backup>, String>;

    /// Find all backups, optionally filtered by type
    fn find_all(&self, backup_type: Option<BackupType>) -> Result<Vec<Backup>, String>;

    /// Delete backup record by ID
    fn delete(&self, id: i64) -> Result<(), String>;
}

