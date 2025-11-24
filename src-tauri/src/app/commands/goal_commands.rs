use crate::app::dtos::goal_dto::{GoalDto, CreateGoalCommand, StatisticsDto as GoalStatisticsDto, MonthlyPagesDto, ListGoalsFilters};
use crate::app::state::AppState;
use crate::core::interfaces::primary::GoalService;
use crate::core::interfaces::secondary::{SessionRepository, BookRepository};
use crate::core::domains::book::BookStatus;
use chrono::Datelike;

/// Tauri command: Create a new goal
#[tauri::command]
pub fn create_goal(
    command: CreateGoalCommand,
    state: tauri::State<AppState>,
) -> Result<GoalDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.goal_service().create(command)
}

/// Tauri command: Get a goal by ID
#[tauri::command]
pub fn get_goal(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<GoalDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.goal_service().get(id)
}

/// Tauri command: List all goals with progress
#[tauri::command]
pub fn list_goals(
    filters: Option<ListGoalsFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<GoalDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.goal_service().list(filters.unwrap_or_default())
}

/// Tauri command: Delete a goal by ID
#[tauri::command]
pub fn delete_goal(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.goal_service().delete(id)
}

/// Tauri command: Get statistics
#[tauri::command]
pub fn get_statistics(
    state: tauri::State<AppState>,
) -> Result<GoalStatisticsDto, String> {
    // This returns GoalStatisticsDto which is different from StatisticsDto
    // We need to calculate this from repositories directly
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    
    // Get repositories from container (we need to add getters for repositories or calculate directly)
    // For now, we'll create a temporary implementation
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let session_repo = crate::infra::sqlite::repositories::SqliteSessionRepository::new(sqlite_conn.clone());
    let book_repo = crate::infra::sqlite::repositories::SqliteBookRepository::new(sqlite_conn);
    
    let now = chrono::Utc::now();
    let current_date = now.date_naive();
    let current_year = Datelike::year(&current_date);
    let current_month = Datelike::month(&current_date);

    // Pages read this month
    let month_start = chrono::NaiveDate::from_ymd_opt(current_year, current_month, 1)
        .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
    
    // Calculate last day of month
    let next_month = if current_month == 12 {
        chrono::NaiveDate::from_ymd_opt(current_year + 1, 1, 1)
    } else {
        chrono::NaiveDate::from_ymd_opt(current_year, current_month + 1, 1)
    };
    let month_end = next_month
        .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())
        .pred_opt()
        .unwrap_or(month_start);
    
    let month_sessions = session_repo.find_by_date_range(month_start, month_end)?;
    let pages_read_this_month: i32 = month_sessions.iter()
        .map(|s| s.pages_read.unwrap_or(0))
        .sum();
    let sessions_this_month = month_sessions.len() as i32;

    // Total pages read
    let all_sessions = session_repo.find_all()?;
    let total_pages_read: i32 = all_sessions.iter()
        .map(|s| s.pages_read.unwrap_or(0))
        .sum();

    // Books completed
    let all_books = book_repo.find_all()?;
    let books_completed = all_books.iter()
        .filter(|b| b.status == BookStatus::Completed)
        .count() as i32;

    // Average pages per session
    let average_pages_per_session = if sessions_this_month > 0 {
        pages_read_this_month as f64 / sessions_this_month as f64
    } else {
        0.0
    };

    // Pages per month (last 12 months)
    let mut pages_per_month = Vec::new();
    for i in 0..12 {
        let date = now.date_naive() - chrono::Duration::days(30 * i);
        let year = Datelike::year(&date);
        let month = Datelike::month(&date);
        let month_start = chrono::NaiveDate::from_ymd_opt(year, month, 1)
            .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
        
        // Calculate last day of month
        let next_month = if month == 12 {
            chrono::NaiveDate::from_ymd_opt(year + 1, 1, 1)
        } else {
            chrono::NaiveDate::from_ymd_opt(year, month + 1, 1)
        };
        let month_end = next_month
            .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())
            .pred_opt()
            .unwrap_or(month_start);
        
        if let Ok(sessions) = session_repo.find_by_date_range(month_start, month_end) {
            let pages: i32 = sessions.iter()
                .map(|s| s.pages_read.unwrap_or(0))
                .sum();
            pages_per_month.push(MonthlyPagesDto {
                year,
                month,
                pages,
            });
        }
    }
    pages_per_month.reverse();

    Ok(GoalStatisticsDto {
        pages_read_this_month,
        total_pages_read,
        books_completed,
        sessions_this_month,
        average_pages_per_session,
        pages_per_month,
    })
}

