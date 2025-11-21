use crate::application::dtos::journal_entry_dto::{
    CreateJournalEntryCommand, UpdateJournalEntryCommand, JournalEntryDto,
};
use crate::application::use_cases::journal::{
    CreateJournalEntryUseCase, UpdateJournalEntryUseCase, DeleteJournalEntryUseCase,
    ListJournalEntriesUseCase, GetJournalEntryUseCase,
};
use crate::infrastructure::repositories::SqliteJournalRepository;
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new journal entry
#[tauri::command]
pub fn create_journal_entry(
    command: CreateJournalEntryCommand,
    state: tauri::State<AppState>,
) -> Result<JournalEntryDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteJournalRepository::new(sqlite_conn);
    
    let use_case = CreateJournalEntryUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Update a journal entry
#[tauri::command]
pub fn update_journal_entry(
    command: UpdateJournalEntryCommand,
    state: tauri::State<AppState>,
) -> Result<JournalEntryDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteJournalRepository::new(sqlite_conn);
    
    let use_case = UpdateJournalEntryUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Delete a journal entry by ID
#[tauri::command]
pub fn delete_journal_entry(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteJournalRepository::new(sqlite_conn);
    
    let use_case = DeleteJournalEntryUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Get a journal entry by ID
#[tauri::command]
pub fn get_journal_entry(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<JournalEntryDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteJournalRepository::new(sqlite_conn);
    
    let use_case = GetJournalEntryUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: List journal entries with optional filters
#[tauri::command]
pub fn list_journal_entries(
    book_id: Option<i64>,
    start_date: Option<String>,
    end_date: Option<String>,
    state: tauri::State<AppState>,
) -> Result<Vec<JournalEntryDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteJournalRepository::new(sqlite_conn);
    
    let use_case = ListJournalEntriesUseCase::new(&repository);
    use_case.execute(book_id, start_date, end_date)
}

