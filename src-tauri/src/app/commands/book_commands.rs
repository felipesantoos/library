use crate::app::dtos::{BookDto, CreateBookCommand, UpdateBookCommand, BookSummaryDto};
use crate::app::state::AppState;
use crate::core::interfaces::primary::BookService;
use serde::Deserialize;

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

/// Filters for listing books
#[derive(Debug, Deserialize)]
pub struct ListBooksFilters {
    pub status: Option<String>,
    pub book_type: Option<String>,
    #[serde(default)]
    pub is_archived: Option<bool>,
    #[serde(default)]
    pub is_wishlist: Option<bool>,
    #[serde(default)]
    pub collection_id: Option<i64>,
}

/// Tauri command: List all books with optional filters
#[tauri::command]
pub fn list_books(
    filters: Option<ListBooksFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<BookDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    
    // Extract filter values, defaulting to None if filters is None
    let (status, book_type, is_archived, is_wishlist, collection_id) = if let Some(f) = filters {
        eprintln!("[list_books] Received filters: status={:?}, book_type={:?}, is_archived={:?}, is_wishlist={:?}, collection_id={:?}", 
                  f.status, f.book_type, f.is_archived, f.is_wishlist, f.collection_id);
        (f.status, f.book_type, f.is_archived, f.is_wishlist, f.collection_id)
    } else {
        eprintln!("[list_books] No filters provided");
        (None, None, None, None, None)
    };
    
    let result = container.book_service().list(status, book_type, is_archived, is_wishlist, collection_id);
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

