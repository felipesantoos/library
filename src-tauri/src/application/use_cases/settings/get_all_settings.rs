use crate::application::dtos::SettingDto;
use crate::ports::repositories::SettingsRepository;

/// Use case for getting all settings
pub struct GetAllSettingsUseCase<'a> {
    settings_repository: &'a dyn SettingsRepository,
}

impl<'a> GetAllSettingsUseCase<'a> {
    pub fn new(settings_repository: &'a dyn SettingsRepository) -> Self {
        GetAllSettingsUseCase { settings_repository }
    }

    pub fn execute(&self) -> Result<Vec<SettingDto>, String> {
        let settings = self.settings_repository.get_all()?;
        Ok(settings.into_iter().map(SettingDto::from).collect())
    }
}

