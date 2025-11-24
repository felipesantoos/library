use crate::app::dtos::tag_dto::{TagDto, CreateTagCommand, AddTagsToBookCommand};

/// Primary interface for tag service operations
pub trait TagService: Send + Sync {
    fn create(&self, command: CreateTagCommand) -> Result<TagDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn list(&self) -> Result<Vec<TagDto>, String>;
    fn add_to_book(&self, command: AddTagsToBookCommand) -> Result<(), String>;
    fn remove_from_book(&self, book_id: i64, tag_id: i64) -> Result<(), String>;
}

