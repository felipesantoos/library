use crate::app::dtos::{BookDto, CreateBookCommand, UpdateBookCommand, BookSummaryDto};

/// Primary interface for book service operations
pub trait BookService: Send + Sync {
    fn create(&self, command: CreateBookCommand) -> Result<BookDto, String>;
    fn update(&self, command: UpdateBookCommand) -> Result<BookDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<BookDto, String>;
    fn list(
        &self,
        status: Option<String>,
        book_type: Option<String>,
        is_archived: Option<bool>,
        is_wishlist: Option<bool>,
        collection_id: Option<i64>,
    ) -> Result<Vec<BookDto>, String>;
    fn generate_summary(&self, book_id: i64) -> Result<BookSummaryDto, String>;
}

