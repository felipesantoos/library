use crate::domain::entities::Collection;
use crate::application::dtos::{CollectionDto, CreateCollectionCommand};
use crate::ports::repositories::CollectionRepository;

/// Use case for creating a new collection
pub struct CreateCollectionUseCase<'a> {
    collection_repository: &'a dyn CollectionRepository,
}

impl<'a> CreateCollectionUseCase<'a> {
    pub fn new(collection_repository: &'a dyn CollectionRepository) -> Self {
        CreateCollectionUseCase { collection_repository }
    }

    pub fn execute(&self, command: CreateCollectionCommand) -> Result<CollectionDto, String> {
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
}

