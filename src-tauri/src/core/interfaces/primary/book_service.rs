use crate::app::dtos::{BookDto, CreateBookCommand, UpdateBookCommand, BookSummaryDto, ListBooksFilters};

/// Primary interface for book service operations
pub trait BookService: Send + Sync {
    fn create(&self, command: CreateBookCommand) -> Result<BookDto, String>;
    fn update(&self, command: UpdateBookCommand) -> Result<BookDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<BookDto, String>;
    fn list(&self, filters: ListBooksFilters) -> Result<Vec<BookDto>, String>;
    fn generate_summary(&self, book_id: i64) -> Result<BookSummaryDto, String>;
}

