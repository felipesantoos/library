use crate::app::dtos::collection_dto::{
    CollectionDto, CreateCollectionCommand, UpdateCollectionCommand, AddBooksToCollectionCommand,
    ListCollectionsFilters,
};

/// Primary interface for collection service operations
pub trait CollectionService: Send + Sync {
    fn create(&self, command: CreateCollectionCommand) -> Result<CollectionDto, String>;
    fn update(&self, command: UpdateCollectionCommand) -> Result<CollectionDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn list(&self, filters: ListCollectionsFilters) -> Result<Vec<CollectionDto>, String>;
    fn add_books(&self, command: AddBooksToCollectionCommand) -> Result<(), String>;
    fn remove_book(&self, collection_id: i64, book_id: i64) -> Result<(), String>;
}

