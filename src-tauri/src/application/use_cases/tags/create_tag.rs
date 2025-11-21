use crate::domain::entities::Tag;
use crate::application::dtos::{TagDto, CreateTagCommand};
use crate::ports::repositories::TagRepository;

/// Use case for creating a new tag
pub struct CreateTagUseCase<'a> {
    tag_repository: &'a dyn TagRepository,
}

impl<'a> CreateTagUseCase<'a> {
    pub fn new(tag_repository: &'a dyn TagRepository) -> Self {
        CreateTagUseCase { tag_repository }
    }

    pub fn execute(&self, command: CreateTagCommand) -> Result<TagDto, String> {
        // Check if tag with same name already exists
        if let Ok(Some(_)) = self.tag_repository.find_by_name(&command.name) {
            return Err(format!("Tag with name '{}' already exists", command.name));
        }

        // Create tag entity with validation
        let mut tag = Tag::new(command.name, command.color)?;

        // Save via repository
        self.tag_repository.create(&mut tag)?;

        // Convert to DTO and return
        Ok(TagDto::from(tag))
    }
}

