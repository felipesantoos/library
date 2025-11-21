use serde::{Deserialize, Serialize};
use crate::domain::entities::Collection;

/// Collection Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CollectionDto {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String, // ISO8601 string
    pub updated_at: String, // ISO8601 string
}

impl From<Collection> for CollectionDto {
    fn from(collection: Collection) -> Self {
        CollectionDto {
            id: collection.id,
            name: collection.name,
            description: collection.description,
            created_at: collection.created_at.to_rfc3339(),
            updated_at: collection.updated_at.to_rfc3339(),
        }
    }
}

/// Command for creating a collection
#[derive(Debug, Deserialize)]
pub struct CreateCollectionCommand {
    pub name: String,
    pub description: Option<String>,
}

/// Command for updating a collection
#[derive(Debug, Deserialize)]
pub struct UpdateCollectionCommand {
    pub id: i64,
    pub name: Option<String>,
    pub description: Option<String>,
}

/// Command for adding books to a collection
#[derive(Debug, Deserialize)]
pub struct AddBooksToCollectionCommand {
    pub collection_id: i64,
    pub book_ids: Vec<i64>,
}

