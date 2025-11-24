use chrono::NaiveDate;

/// Filters for querying agenda blocks
/// All fields are optional and can be combined
#[derive(Debug, Clone, Default)]
pub struct AgendaBlockFilters {
    pub book_id: Option<i64>,
    pub start_date: Option<NaiveDate>,
    pub end_date: Option<NaiveDate>,
    pub is_completed: Option<bool>,
}

impl AgendaBlockFilters {
    /// Create a new empty filter (returns all blocks)
    pub fn new() -> Self {
        Self::default()
    }

    /// Filter by book ID
    pub fn with_book_id(mut self, book_id: i64) -> Self {
        self.book_id = Some(book_id);
        self
    }

    /// Filter by start date (inclusive)
    pub fn with_start_date(mut self, start_date: NaiveDate) -> Self {
        self.start_date = Some(start_date);
        self
    }

    /// Filter by end date (inclusive)
    pub fn with_end_date(mut self, end_date: NaiveDate) -> Self {
        self.end_date = Some(end_date);
        self
    }

    /// Filter by date range (inclusive)
    pub fn with_date_range(mut self, start_date: NaiveDate, end_date: NaiveDate) -> Self {
        self.start_date = Some(start_date);
        self.end_date = Some(end_date);
        self
    }

    /// Filter by specific date
    pub fn with_date(mut self, date: NaiveDate) -> Self {
        self.start_date = Some(date);
        self.end_date = Some(date);
        self
    }

    /// Filter by completion status
    pub fn with_is_completed(mut self, is_completed: bool) -> Self {
        self.is_completed = Some(is_completed);
        self
    }
}

