use crate::domain::entities::Setting;
use crate::application::dtos::SettingDto;
use crate::ports::repositories::SettingsRepository;

/// Use case for setting a setting value
pub struct SetSettingUseCase<'a> {
    settings_repository: &'a dyn SettingsRepository,
}

impl<'a> SetSettingUseCase<'a> {
    pub fn new(settings_repository: &'a dyn SettingsRepository) -> Self {
        SetSettingUseCase { settings_repository }
    }

    pub fn execute(&self, key: String, value: String) -> Result<SettingDto, String> {
        let mut setting = Setting::new(key, value);
        self.settings_repository.set(&setting)?;
        Ok(SettingDto::from(setting))
    }
}

