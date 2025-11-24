use crate::app::dtos::setting_dto::SettingDto;

/// Primary interface for settings service operations
pub trait SettingsService: Send + Sync {
    fn get(&self, key: String) -> Result<Option<SettingDto>, String>;
    fn get_all(&self) -> Result<Vec<SettingDto>, String>;
    fn set(&self, key: String, value: String) -> Result<(), String>;
}

