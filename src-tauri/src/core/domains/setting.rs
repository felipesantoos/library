use serde::{Deserialize, Serialize};

/// Setting value object - simple key-value pair
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Setting {
    pub key: String,
    pub value: String,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl Setting {
    /// Creates a new Setting
    pub fn new(key: String, value: String) -> Self {
        Setting {
            key,
            value,
            updated_at: chrono::Utc::now(),
        }
    }

    /// Updates the value and timestamp
    pub fn update_value(&mut self, value: String) {
        self.value = value;
        self.updated_at = chrono::Utc::now();
    }
}

