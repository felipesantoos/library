use serde::{Deserialize, Serialize};

/// Tag entity for organizing books and notes
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Tag {
    pub id: Option<i64>,
    pub name: String,
    pub color: Option<String>, // Hex color code (e.g., "#FF5733")
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl Tag {
    /// Creates a new Tag with validation
    pub fn new(name: String, color: Option<String>) -> Result<Self, String> {
        let name = name.trim().to_string();
        
        if name.is_empty() {
            return Err("Tag name cannot be empty".to_string());
        }

        if name.len() > 50 {
            return Err("Tag name cannot exceed 50 characters".to_string());
        }

        // Validate color format if provided
        if let Some(ref color_str) = color {
            if !color_str.starts_with('#') || color_str.len() != 7 {
                return Err("Color must be a valid hex color (e.g., #FF5733)".to_string());
            }
        }

        Ok(Tag {
            id: None,
            name,
            color,
            created_at: chrono::Utc::now(),
        })
    }

    /// Updates the tag name
    pub fn update_name(&mut self, name: String) -> Result<(), String> {
        let name = name.trim().to_string();
        
        if name.is_empty() {
            return Err("Tag name cannot be empty".to_string());
        }

        if name.len() > 50 {
            return Err("Tag name cannot exceed 50 characters".to_string());
        }

        self.name = name;
        Ok(())
    }

    /// Updates the tag color
    pub fn update_color(&mut self, color: Option<String>) -> Result<(), String> {
        if let Some(ref color_str) = color {
            if !color_str.starts_with('#') || color_str.len() != 7 {
                return Err("Color must be a valid hex color (e.g., #FF5733)".to_string());
            }
        }

        self.color = color;
        Ok(())
    }
}

