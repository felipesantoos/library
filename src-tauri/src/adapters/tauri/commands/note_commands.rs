use crate::application::dtos::{NoteDto, CreateNoteCommand, UpdateNoteCommand};
use crate::application::use_cases::notes::{CreateNoteUseCase, GetNoteUseCase, ListNotesUseCase, DeleteNoteUseCase, UpdateNoteUseCase};
use crate::infrastructure::repositories::{SqliteNoteRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new note
#[tauri::command]
pub fn create_note(
    command: CreateNoteCommand,
    state: tauri::State<AppState>,
) -> Result<NoteDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let note_repository = SqliteNoteRepository::new(sqlite_conn.clone());
    let book_repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = CreateNoteUseCase::new(&note_repository, &book_repository);
    use_case.execute(command)
}

/// Tauri command: Get a note by ID
#[tauri::command]
pub fn get_note(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<NoteDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteNoteRepository::new(sqlite_conn);
    
    let use_case = GetNoteUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: List all notes with optional filters
#[tauri::command]
pub fn list_notes(
    book_id: Option<i64>,
    search_query: Option<String>,
    state: tauri::State<AppState>,
) -> Result<Vec<NoteDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteNoteRepository::new(sqlite_conn);
    
    let use_case = ListNotesUseCase::new(&repository);
    use_case.execute(book_id, search_query)
}

/// Tauri command: Update an existing note
#[tauri::command]
pub fn update_note(
    command: UpdateNoteCommand,
    state: tauri::State<AppState>,
) -> Result<NoteDto, String> {
    eprintln!("[update_note command] Received command: id={}, page={:?}, content={:?}", 
              command.id, command.page, command.content);
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteNoteRepository::new(sqlite_conn);
    
    let use_case = UpdateNoteUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Delete a note by ID
#[tauri::command]
pub fn delete_note(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteNoteRepository::new(sqlite_conn);
    
    let use_case = DeleteNoteUseCase::new(&repository);
    use_case.execute(id)
}

