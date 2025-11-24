use crate::app::dtos::SettingDto;
use crate::app::state::AppState;
use crate::core::interfaces::primary::SettingsService;

/// Tauri command: Get a setting by key
#[tauri::command]
pub fn get_setting(
    key: String,
    state: tauri::State<AppState>,
) -> Result<Option<SettingDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.settings_service().get(key)
}

/// Tauri command: Set a setting value
#[tauri::command]
pub fn set_setting(
    key: String,
    value: String,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.settings_service().set(key, value)
}

/// Tauri command: Get all settings
#[tauri::command]
pub fn get_all_settings(
    state: tauri::State<AppState>,
) -> Result<Vec<SettingDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.settings_service().get_all()
}

