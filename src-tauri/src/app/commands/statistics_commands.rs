use crate::app::dtos::statistics_dto::StatisticsDto;
use crate::app::state::AppState;
use crate::core::interfaces::primary::statistics_service::StatisticsService;

/// Tauri command: Get statistics
#[tauri::command]
pub fn get_statistics(
    state: tauri::State<AppState>,
) -> Result<StatisticsDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.statistics_service().get()
}

