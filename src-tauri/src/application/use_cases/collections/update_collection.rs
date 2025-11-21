use crate::application::dtos::{CollectionDto, UpdateCollectionCommand};
use crate::ports::repositories::CollectionRepository;

/// Use case for updating a collection
pub struct UpdateCollectionUseCase<'a> {
    collection_repository: &'a dyn CollectionRepository,
}

impl<'a> UpdateCollectionUseCase<'a> {
    pub fn new(collection_repository: &'a dyn CollectionRepository) -> Self {
        UpdateCollectionUseCase { collection_repository }
    }

    pub fn execute(&self, command: UpdateCollectionCommand) -> Result<CollectionDto, String> {
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
}

