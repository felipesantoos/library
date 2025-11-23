use crate::domain::entities::{Book, BookStatus};

/// Repository trait for Book entity (Port/Interface)
pub trait BookRepository: Send + Sync {
    /// Creates a new book
    fn create(&self, book: &mut Book) -> Result<(), String>;

    /// Updates an existing book
    fn update(&self, book: &Book) -> Result<(), String>;

    /// Deletes a book by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Finds a book by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Book>, String>;

    /// Finds all books
    fn find_all(&self) -> Result<Vec<Book>, String>;

    /// Finds books by status
    fn find_by_status(&self, status: BookStatus) -> Result<Vec<Book>, String>;

    /// Finds books by type
    fn find_by_type(&self, book_type: crate::domain::entities::BookType) -> Result<Vec<Book>, String>;

    /// Finds books with filters
    fn find_with_filters(
        &self,
        status: Option<BookStatus>,
        book_type: Option<crate::domain::entities::BookType>,
        is_archived: Option<bool>,
        is_wishlist: Option<bool>,
        collection_id: Option<i64>,
    ) -> Result<Vec<Book>, String>;
}

