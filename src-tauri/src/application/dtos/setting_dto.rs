use serde::{Deserialize, Serialize};
use crate::domain::entities::Setting;

/// Setting Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SettingDto {
    pub key: String,
    pub value: String,
    pub updated_at: String, // ISO8601 string
}

impl From<Setting> for SettingDto {
    fn from(setting: Setting) -> Self {
        SettingDto {
            key: setting.key,
            value: setting.value,
            updated_at: setting.updated_at.to_rfc3339(),
        }
    }
}

