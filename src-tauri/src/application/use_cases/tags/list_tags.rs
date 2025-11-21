use crate::application::dtos::TagDto;
use crate::ports::repositories::TagRepository;

/// Use case for listing tags
pub struct ListTagsUseCase<'a> {
    tag_repository: &'a dyn TagRepository,
}

impl<'a> ListTagsUseCase<'a> {
    pub fn new(tag_repository: &'a dyn TagRepository) -> Self {
        ListTagsUseCase { tag_repository }
    }

    pub fn execute(&self, book_id: Option<i64>) -> Result<Vec<TagDto>, String> {
        let tags = if let Some(b_id) = book_id {
            // Get tags for a specific book
            self.tag_repository.find_by_book_id(b_id)?
        } else {
            // Get all tags
            self.tag_repository.find_all()?
        };

        Ok(tags.into_iter().map(TagDto::from).collect())
    }
}

