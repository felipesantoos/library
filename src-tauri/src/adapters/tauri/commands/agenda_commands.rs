use crate::application::dtos::agenda_block_dto::{
    CreateAgendaBlockCommand, UpdateAgendaBlockCommand, MarkBlockCompletedCommand, AgendaBlockDto,
};
use crate::application::use_cases::agenda::{
    CreateAgendaBlockUseCase, UpdateAgendaBlockUseCase, DeleteAgendaBlockUseCase,
    ListAgendaBlocksUseCase, GetAgendaBlockUseCase, MarkBlockCompletedUseCase,
};
use crate::infrastructure::repositories::SqliteAgendaRepository;
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new agenda block
#[tauri::command]
pub fn create_agenda_block(
    command: CreateAgendaBlockCommand,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteAgendaRepository::new(sqlite_conn);
    
    let use_case = CreateAgendaBlockUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Update an agenda block
#[tauri::command]
pub fn update_agenda_block(
    command: UpdateAgendaBlockCommand,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteAgendaRepository::new(sqlite_conn);
    
    let use_case = UpdateAgendaBlockUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Delete an agenda block by ID
#[tauri::command]
pub fn delete_agenda_block(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteAgendaRepository::new(sqlite_conn);
    
    let use_case = DeleteAgendaBlockUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Get an agenda block by ID
#[tauri::command]
pub fn get_agenda_block(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteAgendaRepository::new(sqlite_conn);
    
    let use_case = GetAgendaBlockUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: List agenda blocks with optional filters
#[tauri::command]
pub fn list_agenda_blocks(
    book_id: Option<i64>,
    start_date: Option<String>,
    end_date: Option<String>,
    is_completed: Option<bool>,
    state: tauri::State<AppState>,
) -> Result<Vec<AgendaBlockDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteAgendaRepository::new(sqlite_conn);
    
    let use_case = ListAgendaBlocksUseCase::new(&repository);
    use_case.execute(book_id, start_date, end_date, is_completed)
}

/// Tauri command: Mark an agenda block as completed and link it to a session
#[tauri::command]
pub fn mark_agenda_block_completed(
    command: MarkBlockCompletedCommand,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteAgendaRepository::new(sqlite_conn);
    
    let use_case = MarkBlockCompletedUseCase::new(&repository);
    use_case.execute(command)
}

