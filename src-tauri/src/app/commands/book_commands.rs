use crate::app::dtos::{BookDto, CreateBookCommand, UpdateBookCommand, BookSummaryDto, ListBooksFilters};
use crate::app::state::AppState;
use crate::core::interfaces::primary::BookService;

/// Tauri command: Create a new book
#[tauri::command]
pub fn create_book(
    command: CreateBookCommand,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.book_service().create(command)
}

/// Tauri command: Get a book by ID
#[tauri::command]
pub fn get_book(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.book_service().get(id)
}

/// Tauri command: List all books with optional filters
#[tauri::command]
pub fn list_books(
    filters: Option<ListBooksFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<BookDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    let result = container.book_service().list(filters.unwrap_or_default());
    eprintln!("[list_books] Returning {} books", result.as_ref().map(|books| books.len()).unwrap_or(0));
    result
}

/// Tauri command: Update an existing book
#[tauri::command]
pub fn update_book(
    command: UpdateBookCommand,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.book_service().update(command)
}

/// Tauri command: Delete a book by ID
#[tauri::command]
pub fn delete_book(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.book_service().delete(id)
}

/// Tauri command: Generate automatic book summary from notes and highlights
#[tauri::command]
pub fn generate_book_summary(
    book_id: i64,
    state: tauri::State<AppState>,
) -> Result<BookSummaryDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.book_service().generate_summary(book_id)
}

