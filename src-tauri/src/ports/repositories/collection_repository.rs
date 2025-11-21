use crate::domain::entities::Collection;

/// Repository trait for Collection entity (Port/Interface)
pub trait CollectionRepository: Send + Sync {
    /// Creates a new collection
    fn create(&self, collection: &mut Collection) -> Result<(), String>;

    /// Updates an existing collection
    fn update(&self, collection: &Collection) -> Result<(), String>;

    /// Deletes a collection by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Finds a collection by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Collection>, String>;

    /// Finds a collection by name
    fn find_by_name(&self, name: &str) -> Result<Option<Collection>, String>;

    /// Finds all collections
    fn find_all(&self) -> Result<Vec<Collection>, String>;

    /// Finds collections by book ID (collections containing a book)
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Collection>, String>;

    /// Adds a book to a collection (creates book_collections relationship)
    fn add_book(&self, book_id: i64, collection_id: i64) -> Result<(), String>;

    /// Removes a book from a collection (deletes book_collections relationship)
    fn remove_book(&self, book_id: i64, collection_id: i64) -> Result<(), String>;

    /// Removes all books from a collection
    fn remove_all_books(&self, collection_id: i64) -> Result<(), String>;
}

