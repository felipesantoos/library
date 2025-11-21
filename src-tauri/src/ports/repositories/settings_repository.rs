use crate::domain::entities::Setting;

/// Repository trait for Setting entity (Port/Interface)
pub trait SettingsRepository: Send + Sync {
    /// Gets a setting by key
    fn get(&self, key: &str) -> Result<Option<Setting>, String>;

    /// Sets a setting (creates if doesn't exist, updates if exists)
    fn set(&self, setting: &Setting) -> Result<(), String>;

    /// Gets all settings
    fn get_all(&self) -> Result<Vec<Setting>, String>;

    /// Deletes a setting by key
    fn delete(&self, key: &str) -> Result<(), String>;
}

