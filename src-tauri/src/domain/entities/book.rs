use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BookStatus {
    NotStarted,
    Reading,
    Paused,
    Abandoned,
    Completed,
    Rereading,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum BookType {
    PhysicalBook,
    Ebook,
    Audiobook,
    Article,
    Pdf,
    Comic,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Book {
    pub id: Option<i64>,
    pub title: String,
    pub author: Option<String>,
    pub genre: Option<String>,
    pub book_type: BookType,
    pub isbn: Option<String>,
    pub publication_year: Option<i32>,
    pub total_pages: Option<i32>,
    pub total_minutes: Option<i32>, // For audiobooks
    pub current_page_text: i32,
    pub current_minutes_audio: i32,
    pub status: BookStatus,
    pub is_archived: bool,
    pub is_wishlist: bool,
    pub cover_url: Option<String>,
    pub url: Option<String>,
    pub added_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub status_changed_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl Book {
    /// Creates a new Book entity with validation
    pub fn new(
        title: String,
        book_type: BookType,
        total_pages: Option<i32>,
        total_minutes: Option<i32>,
    ) -> Result<Self, String> {
        if title.trim().is_empty() {
            return Err("Title cannot be empty".to_string());
        }

        // Validate that either pages or minutes are provided based on type
        match book_type {
            BookType::Audiobook => {
                if total_minutes.is_none() || total_minutes.unwrap_or(0) <= 0 {
                    return Err("Audiobook must have total_minutes > 0".to_string());
                }
            }
            _ => {
                if total_pages.is_none() || total_pages.unwrap_or(0) <= 0 {
                    return Err("Book must have total_pages > 0".to_string());
                }
            }
        }

        Ok(Book {
            id: None,
            title,
            author: None,
            genre: None,
            book_type,
            isbn: None,
            publication_year: None,
            total_pages,
            total_minutes,
            current_page_text: 0,
            current_minutes_audio: 0,
            status: BookStatus::NotStarted,
            is_archived: false,
            is_wishlist: false,
            cover_url: None,
            url: None,
            added_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
            status_changed_at: None,
        })
    }

    /// Validates that current_page doesn't exceed total_pages
    pub fn validate_current_page(&self) -> Result<(), String> {
        if let Some(total) = self.total_pages {
            if self.current_page_text > total {
                return Err(format!(
                    "Current page ({}) cannot exceed total pages ({})",
                    self.current_page_text, total
                ));
            }
        }
        Ok(())
    }

    /// Calculates progress percentage based on type
    pub fn calculate_progress(&self) -> f64 {
        match self.book_type {
            BookType::Audiobook => {
                if let Some(total) = self.total_minutes {
                    if total > 0 {
                        (self.current_minutes_audio as f64 / total as f64 * 100.0).min(100.0)
                    } else {
                        0.0
                    }
                } else {
                    0.0
                }
            }
            _ => {
                if let Some(total) = self.total_pages {
                    if total > 0 {
                        (self.current_page_text as f64 / total as f64 * 100.0).min(100.0)
                    } else {
                        0.0
                    }
                } else {
                    0.0
                }
            }
        }
    }

    /// Marks book as reading
    pub fn mark_as_reading(&mut self) {
        if self.status != BookStatus::Reading {
            self.status = BookStatus::Reading;
            self.status_changed_at = Some(chrono::Utc::now());
            self.updated_at = chrono::Utc::now();
        }
    }

    /// Marks book as completed
    pub fn mark_as_completed(&mut self) {
        self.status = BookStatus::Completed;
        self.status_changed_at = Some(chrono::Utc::now());
        self.updated_at = chrono::Utc::now();
    }

    /// Updates current page with validation
    pub fn update_current_page(&mut self, page: i32) -> Result<(), String> {
        if let Some(total) = self.total_pages {
            if page > total {
                return Err(format!(
                    "Current page ({}) cannot exceed total pages ({})",
                    page, total
                ));
            }
            if page < 0 {
                return Err("Current page cannot be negative".to_string());
            }
        }
        self.current_page_text = page;
        self.updated_at = chrono::Utc::now();
        Ok(())
    }

    /// Updates current audio minutes with validation
    pub fn update_current_minutes_audio(&mut self, minutes: i32) -> Result<(), String> {
        if let Some(total) = self.total_minutes {
            if minutes > total {
                return Err(format!(
                    "Current minutes ({}) cannot exceed total minutes ({})",
                    minutes, total
                ));
            }
            if minutes < 0 {
                return Err("Current minutes cannot be negative".to_string());
            }
        }
        self.current_minutes_audio = minutes;
        self.updated_at = chrono::Utc::now();
        Ok(())
    }
}

