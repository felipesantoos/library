use crate::ports::repositories::TagRepository;

/// Use case for deleting a tag
pub struct DeleteTagUseCase<'a> {
    tag_repository: &'a dyn TagRepository,
}

impl<'a> DeleteTagUseCase<'a> {
    pub fn new(tag_repository: &'a dyn TagRepository) -> Self {
        DeleteTagUseCase { tag_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if tag exists
        self.tag_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Tag with id {} not found", id))?;

        // Delete via repository (CASCADE will remove book_tags relationships)
        self.tag_repository.delete(id)?;

        Ok(())
    }
}

