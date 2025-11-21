use crate::ports::repositories::BookRepository;

/// Use case for deleting a book
pub struct DeleteBookUseCase<'a> {
    book_repository: &'a dyn BookRepository,
}

impl<'a> DeleteBookUseCase<'a> {
    pub fn new(book_repository: &'a dyn BookRepository) -> Self {
        DeleteBookUseCase { book_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if book exists
        self.book_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Book with id {} not found", id))?;

        // Delete via repository (cascade deletes should be handled by database)
        self.book_repository.delete(id)?;

        Ok(())
    }
}

