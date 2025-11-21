use crate::ports::repositories::{TagRepository, BookRepository};

/// Use case for adding tags to a book
pub struct AddTagsToBookUseCase<'a> {
    tag_repository: &'a dyn TagRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> AddTagsToBookUseCase<'a> {
    pub fn new(
        tag_repository: &'a dyn TagRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        AddTagsToBookUseCase {
            tag_repository,
            book_repository,
        }
    }

    pub fn execute(&self, book_id: i64, tag_ids: Vec<i64>) -> Result<(), String> {
        // Validate book exists
        self.book_repository
            .find_by_id(book_id)?
            .ok_or_else(|| format!("Book with id {} not found", book_id))?;

        // Validate all tags exist
        for tag_id in &tag_ids {
            self.tag_repository
                .find_by_id(*tag_id)?
                .ok_or_else(|| format!("Tag with id {} not found", tag_id))?;
        }

        // Add each tag to the book
        for tag_id in tag_ids {
            self.tag_repository.add_to_book(book_id, tag_id)?;
        }

        Ok(())
    }
}

/// Use case for removing a tag from a book
pub struct RemoveTagFromBookUseCase<'a> {
    tag_repository: &'a dyn TagRepository,
}

impl<'a> RemoveTagFromBookUseCase<'a> {
    pub fn new(tag_repository: &'a dyn TagRepository) -> Self {
        RemoveTagFromBookUseCase { tag_repository }
    }

    pub fn execute(&self, book_id: i64, tag_id: i64) -> Result<(), String> {
        self.tag_repository.remove_from_book(book_id, tag_id)?;
        Ok(())
    }
}

