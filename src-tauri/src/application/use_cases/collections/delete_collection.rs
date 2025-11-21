use crate::ports::repositories::CollectionRepository;

/// Use case for deleting a collection
pub struct DeleteCollectionUseCase<'a> {
    collection_repository: &'a dyn CollectionRepository,
}

impl<'a> DeleteCollectionUseCase<'a> {
    pub fn new(collection_repository: &'a dyn CollectionRepository) -> Self {
        DeleteCollectionUseCase { collection_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if collection exists
        self.collection_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Collection with id {} not found", id))?;

        // Delete via repository (CASCADE will remove book_collections relationships)
        self.collection_repository.delete(id)?;

        Ok(())
    }
}

