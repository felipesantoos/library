use crate::application::dtos::SettingDto;
use crate::ports::repositories::SettingsRepository;

/// Use case for getting a setting by key
pub struct GetSettingUseCase<'a> {
    settings_repository: &'a dyn SettingsRepository,
}

impl<'a> GetSettingUseCase<'a> {
    pub fn new(settings_repository: &'a dyn SettingsRepository) -> Self {
        GetSettingUseCase { settings_repository }
    }

    pub fn execute(&self, key: String) -> Result<Option<SettingDto>, String> {
        let setting = self.settings_repository.get(&key)?;
        Ok(setting.map(SettingDto::from))
    }
}

