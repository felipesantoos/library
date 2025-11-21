use crate::application::dtos::SettingDto;
use crate::application::use_cases::settings::{GetSettingUseCase, SetSettingUseCase, GetAllSettingsUseCase};
use crate::infrastructure::repositories::SqliteSettingsRepository;
use crate::adapters::tauri::AppState;

/// Tauri command: Get a setting by key
#[tauri::command]
pub fn get_setting(
    key: String,
    state: tauri::State<AppState>,
) -> Result<Option<SettingDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteSettingsRepository::new(sqlite_conn);
    
    let use_case = GetSettingUseCase::new(&repository);
    use_case.execute(key)
}

/// Tauri command: Set a setting value
#[tauri::command]
pub fn set_setting(
    key: String,
    value: String,
    state: tauri::State<AppState>,
) -> Result<SettingDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteSettingsRepository::new(sqlite_conn);
    
    let use_case = SetSettingUseCase::new(&repository);
    use_case.execute(key, value)
}

/// Tauri command: Get all settings
#[tauri::command]
pub fn get_all_settings(
    state: tauri::State<AppState>,
) -> Result<Vec<SettingDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteSettingsRepository::new(sqlite_conn);
    
    let use_case = GetAllSettingsUseCase::new(&repository);
    use_case.execute()
}

