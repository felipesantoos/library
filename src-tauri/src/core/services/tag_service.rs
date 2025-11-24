use crate::app::dtos::tag_dto::{TagDto, CreateTagCommand, AddTagsToBookCommand, ListTagsFilters};
use crate::core::domains::tag::Tag;
use crate::core::interfaces::primary::TagService;
use crate::core::interfaces::secondary::{TagRepository, BookRepository};

/// Implementation of TagService
pub struct TagServiceImpl<'a> {
    tag_repository: &'a dyn TagRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> TagServiceImpl<'a> {
    pub fn new(
        tag_repository: &'a dyn TagRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        TagServiceImpl {
            tag_repository,
            book_repository,
        }
    }
}

impl<'a> TagService for TagServiceImpl<'a> {
    fn create(&self, command: CreateTagCommand) -> Result<TagDto, String> {
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

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if tag exists
        self.tag_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Tag with id {} not found", id))?;

        // Delete via repository (CASCADE will remove book_tags relationships)
        self.tag_repository.delete(id)?;

        Ok(())
    }

    fn list(&self, _filters: ListTagsFilters) -> Result<Vec<TagDto>, String> {
        let tags = self.tag_repository.find_all()?;
        Ok(tags.into_iter().map(TagDto::from).collect())
    }

    fn add_to_book(&self, command: AddTagsToBookCommand) -> Result<(), String> {
        // Validate book exists
        self.book_repository
            .find_by_id(command.book_id)?
            .ok_or_else(|| format!("Book with id {} not found", command.book_id))?;

        // Validate all tags exist
        for tag_id in &command.tag_ids {
            self.tag_repository
                .find_by_id(*tag_id)?
                .ok_or_else(|| format!("Tag with id {} not found", tag_id))?;
        }

        // Add each tag to the book
        for tag_id in command.tag_ids {
            self.tag_repository.add_to_book(command.book_id, tag_id)?;
        }

        Ok(())
    }

    fn remove_from_book(&self, book_id: i64, tag_id: i64) -> Result<(), String> {
        self.tag_repository.remove_from_book(book_id, tag_id)?;
        Ok(())
    }
}

