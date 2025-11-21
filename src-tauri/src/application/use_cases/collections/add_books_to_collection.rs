use crate::ports::repositories::{CollectionRepository, BookRepository};

/// Use case for adding books to a collection
pub struct AddBooksToCollectionUseCase<'a> {
    collection_repository: &'a dyn CollectionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> AddBooksToCollectionUseCase<'a> {
    pub fn new(
        collection_repository: &'a dyn CollectionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        AddBooksToCollectionUseCase {
            collection_repository,
            book_repository,
        }
    }

    pub fn execute(&self, collection_id: i64, book_ids: Vec<i64>) -> Result<(), String> {
        // Validate collection exists
        self.collection_repository
            .find_by_id(collection_id)?
            .ok_or_else(|| format!("Collection with id {} not found", collection_id))?;

        // Validate all books exist
        for book_id in &book_ids {
            self.book_repository
                .find_by_id(*book_id)?
                .ok_or_else(|| format!("Book with id {} not found", book_id))?;
        }

        // Add each book to the collection
        for book_id in book_ids {
            self.collection_repository.add_book(book_id, collection_id)?;
        }

        Ok(())
    }
}

/// Use case for removing a book from a collection
pub struct RemoveBookFromCollectionUseCase<'a> {
    collection_repository: &'a dyn CollectionRepository,
}

impl<'a> RemoveBookFromCollectionUseCase<'a> {
    pub fn new(collection_repository: &'a dyn CollectionRepository) -> Self {
        RemoveBookFromCollectionUseCase { collection_repository }
    }

    pub fn execute(&self, book_id: i64, collection_id: i64) -> Result<(), String> {
        self.collection_repository.remove_book(book_id, collection_id)?;
        Ok(())
    }
}

