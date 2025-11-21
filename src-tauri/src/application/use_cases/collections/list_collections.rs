use crate::application::dtos::CollectionDto;
use crate::ports::repositories::CollectionRepository;

/// Use case for listing collections
pub struct ListCollectionsUseCase<'a> {
    collection_repository: &'a dyn CollectionRepository,
}

impl<'a> ListCollectionsUseCase<'a> {
    pub fn new(collection_repository: &'a dyn CollectionRepository) -> Self {
        ListCollectionsUseCase { collection_repository }
    }

    pub fn execute(&self, book_id: Option<i64>) -> Result<Vec<CollectionDto>, String> {
        let collections = if let Some(b_id) = book_id {
            // Get collections for a specific book
            self.collection_repository.find_by_book_id(b_id)?
        } else {
            // Get all collections
            self.collection_repository.find_all()?
        };

        Ok(collections.into_iter().map(CollectionDto::from).collect())
    }
}

