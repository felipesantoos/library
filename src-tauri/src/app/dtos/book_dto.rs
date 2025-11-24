use serde::{Deserialize, Serialize};
use crate::core::domains::book::{Book, BookStatus, BookType};

/// Book Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookDto {
    pub id: Option<i64>,
    pub title: String,
    pub author: Option<String>,
    pub genre: Option<String>,
    pub book_type: String, // Serialized BookType
    pub isbn: Option<String>,
    pub publication_year: Option<i32>,
    pub total_pages: Option<i32>,
    pub total_minutes: Option<i32>,
    pub current_page_text: i32,
    pub current_minutes_audio: i32,
    pub status: String, // Serialized BookStatus
    pub is_archived: bool,
    pub is_wishlist: bool,
    pub cover_url: Option<String>,
    pub url: Option<String>,
    pub added_at: String, // ISO8601 string
    pub updated_at: String, // ISO8601 string
    pub status_changed_at: Option<String>, // ISO8601 string
    pub progress_percentage: f64,
}

impl From<Book> for BookDto {
    fn from(book: Book) -> Self {
        // Calculate progress before moving fields
        let progress_percentage = book.calculate_progress();
        
        BookDto {
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            book_type: book_type_to_string(&book.book_type),
            isbn: book.isbn,
            publication_year: book.publication_year,
            total_pages: book.total_pages,
            total_minutes: book.total_minutes,
            current_page_text: book.current_page_text,
            current_minutes_audio: book.current_minutes_audio,
            status: book_status_to_string(&book.status),
            is_archived: book.is_archived,
            is_wishlist: book.is_wishlist,
            cover_url: book.cover_url,
            url: book.url,
            added_at: book.added_at.to_rfc3339(),
            updated_at: book.updated_at.to_rfc3339(),
            status_changed_at: book.status_changed_at.map(|dt| dt.to_rfc3339()),
            progress_percentage,
        }
    }
}

impl TryFrom<BookDto> for Book {
    type Error = String;

    fn try_from(dto: BookDto) -> Result<Self, Self::Error> {
        Ok(Book {
            id: dto.id,
            title: dto.title,
            author: dto.author,
            genre: dto.genre,
            book_type: string_to_book_type(&dto.book_type)?,
            isbn: dto.isbn,
            publication_year: dto.publication_year,
            total_pages: dto.total_pages,
            total_minutes: dto.total_minutes,
            current_page_text: dto.current_page_text,
            current_minutes_audio: dto.current_minutes_audio,
            status: string_to_book_status(&dto.status)?,
            is_archived: dto.is_archived,
            is_wishlist: dto.is_wishlist,
            cover_url: dto.cover_url,
            url: dto.url,
            added_at: chrono::DateTime::parse_from_rfc3339(&dto.added_at)
                .map_err(|e| format!("Invalid added_at: {}", e))?
                .with_timezone(&chrono::Utc),
            updated_at: chrono::DateTime::parse_from_rfc3339(&dto.updated_at)
                .map_err(|e| format!("Invalid updated_at: {}", e))?
                .with_timezone(&chrono::Utc),
            status_changed_at: dto.status_changed_at.map(|s| {
                chrono::DateTime::parse_from_rfc3339(&s)
                    .ok()
                    .map(|dt| dt.with_timezone(&chrono::Utc))
            }).flatten(),
        })
    }
}

fn book_status_to_string(status: &BookStatus) -> String {
    match status {
        BookStatus::NotStarted => "not_started".to_string(),
        BookStatus::Reading => "reading".to_string(),
        BookStatus::Paused => "paused".to_string(),
        BookStatus::Abandoned => "abandoned".to_string(),
        BookStatus::Completed => "completed".to_string(),
        BookStatus::Rereading => "rereading".to_string(),
    }
}

fn string_to_book_status(s: &str) -> Result<BookStatus, String> {
    match s {
        "not_started" => Ok(BookStatus::NotStarted),
        "reading" => Ok(BookStatus::Reading),
        "paused" => Ok(BookStatus::Paused),
        "abandoned" => Ok(BookStatus::Abandoned),
        "completed" => Ok(BookStatus::Completed),
        "rereading" => Ok(BookStatus::Rereading),
        _ => Err(format!("Invalid status: {}", s)),
    }
}

fn book_type_to_string(book_type: &BookType) -> String {
    match book_type {
        BookType::PhysicalBook => "physical_book".to_string(),
        BookType::Ebook => "ebook".to_string(),
        BookType::Audiobook => "audiobook".to_string(),
        BookType::Article => "article".to_string(),
        BookType::Pdf => "PDF".to_string(),
        BookType::Comic => "comic".to_string(),
    }
}

fn string_to_book_type(s: &str) -> Result<BookType, String> {
    match s {
        "physical_book" => Ok(BookType::PhysicalBook),
        "ebook" => Ok(BookType::Ebook),
        "audiobook" => Ok(BookType::Audiobook),
        "article" => Ok(BookType::Article),
        "PDF" => Ok(BookType::Pdf),
        "comic" => Ok(BookType::Comic),
        _ => Err(format!("Invalid book type: {}", s)),
    }
}

/// Command for creating a book
#[derive(Debug, Deserialize)]
pub struct CreateBookCommand {
    pub title: String,
    pub author: Option<String>,
    pub genre: Option<String>,
    pub book_type: String,
    pub isbn: Option<String>,
    pub publication_year: Option<i32>,
    pub total_pages: Option<i32>,
    pub total_minutes: Option<i32>,
    pub cover_url: Option<String>,
    pub url: Option<String>,
}

/// Command for updating a book
#[derive(Debug, Deserialize)]
pub struct UpdateBookCommand {
    pub id: i64,
    pub title: Option<String>,
    pub author: Option<String>,
    pub genre: Option<String>,
    pub book_type: Option<String>,
    pub isbn: Option<String>,
    pub publication_year: Option<i32>,
    pub total_pages: Option<i32>,
    pub total_minutes: Option<i32>,
    pub current_page_text: Option<i32>,
    pub current_minutes_audio: Option<i32>,
    pub status: Option<String>,
    pub is_archived: Option<bool>,
    pub is_wishlist: Option<bool>,
    pub cover_url: Option<String>,
    pub url: Option<String>,
}

