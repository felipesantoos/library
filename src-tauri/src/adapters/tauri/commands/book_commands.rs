use crate::application::dtos::{BookDto, CreateBookCommand, UpdateBookCommand};
use crate::application::use_cases::books::{CreateBookUseCase, GetBookUseCase, ListBooksUseCase, UpdateBookUseCase, DeleteBookUseCase};
use crate::infrastructure::repositories::SqliteBookRepository;
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new book
#[tauri::command]
pub fn create_book(
    command: CreateBookCommand,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = CreateBookUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Get a book by ID
#[tauri::command]
pub fn get_book(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = GetBookUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: List all books with optional filters
#[tauri::command]
pub fn list_books(
    status: Option<String>,
    book_type: Option<String>,
    is_archived: Option<bool>,
    is_wishlist: Option<bool>,
    state: tauri::State<AppState>,
) -> Result<Vec<BookDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = ListBooksUseCase::new(&repository);
    use_case.execute(status, book_type, is_archived, is_wishlist)
}

/// Tauri command: Update an existing book
#[tauri::command]
pub fn update_book(
    command: UpdateBookCommand,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = UpdateBookUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Delete a book by ID
#[tauri::command]
pub fn delete_book(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = DeleteBookUseCase::new(&repository);
    use_case.execute(id)
}

