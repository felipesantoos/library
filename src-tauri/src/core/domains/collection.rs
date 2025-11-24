use serde::{Deserialize, Serialize};

/// Collection entity for organizing books into groups
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Collection {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl Collection {
    /// Creates a new Collection with validation
    pub fn new(name: String, description: Option<String>) -> Result<Self, String> {
        let name = name.trim().to_string();
        
        if name.is_empty() {
            return Err("Collection name cannot be empty".to_string());
        }

        if name.len() > 100 {
            return Err("Collection name cannot exceed 100 characters".to_string());
        }

        let description = description.map(|d| d.trim().to_string()).filter(|d| !d.is_empty());

        if let Some(ref desc) = description {
            if desc.len() > 500 {
                return Err("Collection description cannot exceed 500 characters".to_string());
            }
        }

        let now = chrono::Utc::now();
        Ok(Collection {
            id: None,
            name,
            description,
            created_at: now,
            updated_at: now,
        })
    }

    /// Updates the collection name
    pub fn update_name(&mut self, name: String) -> Result<(), String> {
        let name = name.trim().to_string();
        
        if name.is_empty() {
            return Err("Collection name cannot be empty".to_string());
        }

        if name.len() > 100 {
            return Err("Collection name cannot exceed 100 characters".to_string());
        }

        self.name = name;
        self.updated_at = chrono::Utc::now();
        Ok(())
    }

    /// Updates the collection description
    pub fn update_description(&mut self, description: Option<String>) -> Result<(), String> {
        let description = description
            .map(|d| d.trim().to_string())
            .filter(|d| !d.is_empty());

        if let Some(ref desc) = description {
            if desc.len() > 500 {
                return Err("Collection description cannot exceed 500 characters".to_string());
            }
        }

        self.description = description;
        self.updated_at = chrono::Utc::now();
        Ok(())
    }
}

