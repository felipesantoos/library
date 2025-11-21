use crate::application::dtos::{GoalDto, CreateGoalCommand, StatisticsDto};
use crate::application::use_cases::goals::{CreateGoalUseCase, GetGoalUseCase, ListGoalsUseCase, DeleteGoalUseCase, GetStatisticsUseCase};
use crate::infrastructure::repositories::{SqliteGoalRepository, SqliteSessionRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new goal
#[tauri::command]
pub fn create_goal(
    command: CreateGoalCommand,
    state: tauri::State<AppState>,
) -> Result<GoalDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteGoalRepository::new(sqlite_conn);
    
    let use_case = CreateGoalUseCase::new(&repository);
    let goal = use_case.execute(command)?;
    Ok(GoalDto::from(goal))
}

/// Tauri command: Get a goal by ID
#[tauri::command]
pub fn get_goal(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<GoalDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteGoalRepository::new(sqlite_conn);
    
    let use_case = GetGoalUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: List all goals with progress
#[tauri::command]
pub fn list_goals(
    include_inactive: Option<bool>,
    state: tauri::State<AppState>,
) -> Result<Vec<GoalDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let goal_repo = SqliteGoalRepository::new(sqlite_conn.clone());
    let session_repo = SqliteSessionRepository::new(sqlite_conn.clone());
    let book_repo = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = ListGoalsUseCase::new(&goal_repo, &session_repo, &book_repo);
    use_case.execute(include_inactive.unwrap_or(false))
}

/// Tauri command: Delete a goal by ID
#[tauri::command]
pub fn delete_goal(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteGoalRepository::new(sqlite_conn);
    
    let use_case = DeleteGoalUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Get statistics
#[tauri::command]
pub fn get_statistics(
    state: tauri::State<AppState>,
) -> Result<StatisticsDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let session_repo = SqliteSessionRepository::new(sqlite_conn.clone());
    let book_repo = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = GetStatisticsUseCase::new(&session_repo, &book_repo);
    use_case.execute()
}

