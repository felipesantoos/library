use crate::app::dtos::collection_dto::{
    CollectionDto, CreateCollectionCommand, UpdateCollectionCommand, AddBooksToCollectionCommand,
};
use crate::core::domains::collection::Collection;
use crate::core::interfaces::primary::CollectionService;
use crate::core::interfaces::secondary::{CollectionRepository, BookRepository};

/// Implementation of CollectionService
pub struct CollectionServiceImpl<'a> {
    collection_repository: &'a dyn CollectionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> CollectionServiceImpl<'a> {
    pub fn new(
        collection_repository: &'a dyn CollectionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        CollectionServiceImpl {
            collection_repository,
            book_repository,
        }
    }
}

impl<'a> CollectionService for CollectionServiceImpl<'a> {
    fn create(&self, command: CreateCollectionCommand) -> Result<CollectionDto, String> {
        // Check if collection with same name already exists
        if let Ok(Some(_)) = self.collection_repository.find_by_name(&command.name) {
            return Err(format!("Collection with name '{}' already exists", command.name));
        }

        // Create collection entity with validation
        let mut collection = Collection::new(command.name, command.description)?;

        // Save via repository
        self.collection_repository.create(&mut collection)?;

        // Convert to DTO and return
        Ok(CollectionDto::from(collection))
    }

    fn update(&self, command: UpdateCollectionCommand) -> Result<CollectionDto, String> {
        // Get existing collection
        let mut collection = self.collection_repository
            .find_by_id(command.id)?
            .ok_or_else(|| format!("Collection with id {} not found", command.id))?;

        // Update fields if provided
        if let Some(name) = command.name {
            collection.update_name(name)?;
        }

        if command.description.is_some() {
            collection.update_description(command.description)?;
        }

        // Update timestamp
        collection.updated_at = chrono::Utc::now();

        // Save via repository
        self.collection_repository.update(&collection)?;

        // Convert to DTO and return
        Ok(CollectionDto::from(collection))
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if collection exists
        self.collection_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Collection with id {} not found", id))?;

        // Delete via repository (CASCADE will remove book_collections relationships)
        self.collection_repository.delete(id)?;

        Ok(())
    }

    fn list(&self) -> Result<Vec<CollectionDto>, String> {
        let collections = self.collection_repository.find_all()?;
        Ok(collections.into_iter().map(CollectionDto::from).collect())
    }

    fn add_books(&self, command: AddBooksToCollectionCommand) -> Result<(), String> {
        // Validate collection exists
        self.collection_repository
            .find_by_id(command.collection_id)?
            .ok_or_else(|| format!("Collection with id {} not found", command.collection_id))?;

        // Validate all books exist
        for book_id in &command.book_ids {
            self.book_repository
                .find_by_id(*book_id)?
                .ok_or_else(|| format!("Book with id {} not found", book_id))?;
        }

        // Add each book to the collection
        for book_id in command.book_ids {
            self.collection_repository.add_book(book_id, command.collection_id)?;
        }

        Ok(())
    }

    fn remove_book(&self, collection_id: i64, book_id: i64) -> Result<(), String> {
        self.collection_repository.remove_book(book_id, collection_id)?;
        Ok(())
    }
}

