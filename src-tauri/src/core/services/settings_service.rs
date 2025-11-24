use crate::app::dtos::SettingDto;
use crate::core::domains::setting::Setting;
use crate::core::interfaces::primary::SettingsService;
use crate::core::interfaces::secondary::SettingsRepository;

/// Implementation of SettingsService
pub struct SettingsServiceImpl<'a> {
    settings_repository: &'a dyn SettingsRepository,
}

impl<'a> SettingsServiceImpl<'a> {
    pub fn new(settings_repository: &'a dyn SettingsRepository) -> Self {
        SettingsServiceImpl { settings_repository }
    }
}

impl<'a> SettingsService for SettingsServiceImpl<'a> {
    fn get(&self, key: String) -> Result<Option<SettingDto>, String> {
        let setting = self.settings_repository.get(&key)?;
        Ok(setting.map(SettingDto::from))
    }

    fn get_all(&self) -> Result<Vec<SettingDto>, String> {
        let settings = self.settings_repository.get_all()?;
        Ok(settings.into_iter().map(SettingDto::from).collect())
    }

    fn set(&self, key: String, value: String) -> Result<(), String> {
        let setting = Setting::new(key, value);
        self.settings_repository.set(&setting)?;
        Ok(())
    }
}

