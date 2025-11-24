use crate::core::domains::tag::Tag;

/// Repository trait for Tag entity (Port/Interface)
pub trait TagRepository: Send + Sync {
    /// Creates a new tag
    fn create(&self, tag: &mut Tag) -> Result<(), String>;

    /// Updates an existing tag
    fn update(&self, tag: &Tag) -> Result<(), String>;

    /// Deletes a tag by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Finds a tag by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Tag>, String>;

    /// Finds a tag by name
    fn find_by_name(&self, name: &str) -> Result<Option<Tag>, String>;

    /// Finds all tags
    fn find_all(&self) -> Result<Vec<Tag>, String>;

    /// Finds tags by book ID (tags associated with a book)
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Tag>, String>;

    /// Adds a tag to a book (creates book_tags relationship)
    fn add_to_book(&self, book_id: i64, tag_id: i64) -> Result<(), String>;

    /// Removes a tag from a book (deletes book_tags relationship)
    fn remove_from_book(&self, book_id: i64, tag_id: i64) -> Result<(), String>;

    /// Removes all tags from a book
    fn remove_all_from_book(&self, book_id: i64) -> Result<(), String>;
}

