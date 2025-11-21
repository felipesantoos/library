use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDate};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JournalEntry {
    pub id: Option<i64>,
    pub entry_date: NaiveDate,
    pub content: String,
    pub book_id: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl JournalEntry {
    /// Creates a new JournalEntry with validation
    pub fn new(
        entry_date: NaiveDate,
        content: String,
        book_id: Option<i64>,
    ) -> Result<Self, String> {
        if content.trim().is_empty() {
            return Err("Content cannot be empty".to_string());
        }

        let now = Utc::now();
        Ok(JournalEntry {
            id: None,
            entry_date,
            content,
            book_id,
            created_at: now,
            updated_at: now,
        })
    }

    /// Updates the entry content
    pub fn update_content(&mut self, content: String) -> Result<(), String> {
        if content.trim().is_empty() {
            return Err("Content cannot be empty".to_string());
        }
        self.content = content;
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Updates the entry date
    pub fn update_date(&mut self, entry_date: NaiveDate) {
        self.entry_date = entry_date;
        self.updated_at = Utc::now();
    }

    /// Updates the associated book
    pub fn update_book(&mut self, book_id: Option<i64>) {
        self.book_id = book_id;
        self.updated_at = Utc::now();
    }
}

