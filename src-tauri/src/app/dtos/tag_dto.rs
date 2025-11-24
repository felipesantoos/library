use serde::{Deserialize, Serialize};
use crate::core::domains::tag::Tag;

/// Tag Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TagDto {
    pub id: Option<i64>,
    pub name: String,
    pub color: Option<String>,
    pub created_at: String, // ISO8601 string
}

impl From<Tag> for TagDto {
    fn from(tag: Tag) -> Self {
        TagDto {
            id: tag.id,
            name: tag.name,
            color: tag.color,
            created_at: tag.created_at.to_rfc3339(),
        }
    }
}

/// Command for creating a tag
#[derive(Debug, Deserialize)]
pub struct CreateTagCommand {
    pub name: String,
    pub color: Option<String>,
}

/// Command for updating a tag
#[derive(Debug, Deserialize)]
pub struct UpdateTagCommand {
    pub id: i64,
    pub name: Option<String>,
    pub color: Option<String>,
}

/// Command for adding tags to a book
#[derive(Debug, Deserialize)]
pub struct AddTagsToBookCommand {
    pub book_id: i64,
    pub tag_ids: Vec<i64>,
}

/// Filters for listing tags
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ListTagsFilters {
    // Currently no filters, but structure is ready for future additions
}

