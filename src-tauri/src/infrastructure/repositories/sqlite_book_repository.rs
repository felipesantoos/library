use crate::domain::entities::{Book, BookStatus, BookType};
use crate::ports::repositories::BookRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of BookRepository
pub struct SqliteBookRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteBookRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteBookRepository { connection }
    }

    // Helper methods for conversion between domain and database
    fn status_to_string(status: &BookStatus) -> String {
        match status {
            BookStatus::NotStarted => "not_started".to_string(),
            BookStatus::Reading => "reading".to_string(),
            BookStatus::Paused => "paused".to_string(),
            BookStatus::Abandoned => "abandoned".to_string(),
            BookStatus::Completed => "completed".to_string(),
            BookStatus::Rereading => "rereading".to_string(),
        }
    }

    fn string_to_status(s: &str) -> Result<BookStatus, String> {
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

    fn type_to_string(book_type: &BookType) -> String {
        match book_type {
            BookType::PhysicalBook => "physical_book".to_string(),
            BookType::Ebook => "ebook".to_string(),
            BookType::Audiobook => "audiobook".to_string(),
            BookType::Article => "article".to_string(),
            BookType::Pdf => "PDF".to_string(),
            BookType::Comic => "comic".to_string(),
        }
    }

    fn string_to_type(s: &str) -> Result<BookType, String> {
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

    // Helper function to parse datetime from SQLite (supports both SQLite format and RFC3339)
    fn parse_datetime(s: &str) -> Result<chrono::DateTime<chrono::Utc>, rusqlite::Error> {
        // Try RFC3339 first (used when saving)
        if let Ok(dt) = chrono::DateTime::parse_from_rfc3339(s) {
            return Ok(dt.with_timezone(&chrono::Utc));
        }
        
        // Try SQLite datetime format (YYYY-MM-DD HH:MM:SS)
        if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S") {
            return Ok(dt.and_utc());
        }
        
        // Try SQLite datetime format with microseconds (YYYY-MM-DD HH:MM:SS.ffffff)
        if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S%.f") {
            return Ok(dt.and_utc());
        }
        
        Err(rusqlite::Error::InvalidColumnType(
            0,
            format!("Invalid datetime format: {}", s),
            rusqlite::types::Type::Text,
        ))
    }

    fn row_to_book(row: &rusqlite::Row) -> Result<Book, rusqlite::Error> {
        Ok(Book {
            id: Some(row.get(0)?),
            title: row.get(1)?,
            author: row.get(2)?,
            genre: row.get(3)?,
            book_type: Self::string_to_type(&row.get::<_, String>(4)?)
                .map_err(|e| rusqlite::Error::InvalidColumnType(4, e, rusqlite::types::Type::Text))?,
            isbn: row.get(5)?,
            publication_year: row.get(6)?,
            total_pages: row.get(7)?,
            total_minutes: row.get(8)?,
            current_page_text: row.get(9)?,
            current_minutes_audio: row.get(10)?,
            status: Self::string_to_status(&row.get::<_, String>(11)?)
                .map_err(|e| rusqlite::Error::InvalidColumnType(11, e, rusqlite::types::Type::Text))?,
            is_archived: row.get::<_, i32>(12)? != 0,
            is_wishlist: row.get::<_, i32>(13)? != 0,
            cover_url: row.get(14)?,
            url: row.get(15)?,
            added_at: Self::parse_datetime(&row.get::<_, String>(16)?)?,
            updated_at: Self::parse_datetime(&row.get::<_, String>(17)?)?,
            status_changed_at: row.get::<_, Option<String>>(18)?
                .and_then(|s| Self::parse_datetime(&s).ok()),
        })
    }
}

impl BookRepository for SqliteBookRepository {
    fn create(&self, book: &mut Book) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let status_str = Self::status_to_string(&book.status);
        let type_str = Self::type_to_string(&book.book_type);
        let added_at = book.added_at.to_rfc3339();
        let updated_at = book.updated_at.to_rfc3339();
        let status_changed_at = book.status_changed_at.as_ref().map(|dt| dt.to_rfc3339());

        conn.execute(
            "INSERT INTO books (
                title, author, genre, type, isbn, publication_year,
                total_pages, total_minutes, current_page_text, current_minutes_audio,
                status, is_archived, is_wishlist, cover_url, url,
                added_at, updated_at, status_changed_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)",
            params![
                book.title,
                book.author,
                book.genre,
                type_str,
                book.isbn,
                book.publication_year,
                book.total_pages,
                book.total_minutes,
                book.current_page_text,
                book.current_minutes_audio,
                status_str,
                if book.is_archived { 1 } else { 0 },
                if book.is_wishlist { 1 } else { 0 },
                book.cover_url,
                book.url,
                added_at,
                updated_at,
                status_changed_at
            ],
        )
        .map_err(|e| format!("Failed to insert book: {}", e))?;

        book.id = Some(conn.last_insert_rowid());
        Ok(())
    }

    fn update(&self, book: &Book) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let status_str = Self::status_to_string(&book.status);
        let type_str = Self::type_to_string(&book.book_type);
        let updated_at = chrono::Utc::now().to_rfc3339();
        let status_changed_at = book.status_changed_at.as_ref().map(|dt| dt.to_rfc3339());

        let id = book.id.ok_or("Book ID is required for update".to_string())?;

        conn.execute(
            "UPDATE books SET
                title = ?2, author = ?3, genre = ?4, type = ?5, isbn = ?6,
                publication_year = ?7, total_pages = ?8, total_minutes = ?9,
                current_page_text = ?10, current_minutes_audio = ?11,
                status = ?12, is_archived = ?13, is_wishlist = ?14,
                cover_url = ?15, url = ?16, updated_at = ?17, status_changed_at = ?18
            WHERE id = ?1",
            params![
                id,
                book.title,
                book.author,
                book.genre,
                type_str,
                book.isbn,
                book.publication_year,
                book.total_pages,
                book.total_minutes,
                book.current_page_text,
                book.current_minutes_audio,
                status_str,
                if book.is_archived { 1 } else { 0 },
                if book.is_wishlist { 1 } else { 0 },
                book.cover_url,
                book.url,
                updated_at,
                status_changed_at
            ],
        )
        .map_err(|e| format!("Failed to update book: {}", e))?;

        Ok(())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM books WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete book: {}", e))?;

        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Book>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, title, author, genre, type, isbn, publication_year,
                 total_pages, total_minutes, current_page_text, current_minutes_audio,
                 status, is_archived, is_wishlist, cover_url, url,
                 added_at, updated_at, status_changed_at
                 FROM books WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let book_result = stmt
            .query_row(params![id], |row| Self::row_to_book(row));

        match book_result {
            Ok(book) => Ok(Some(book)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find book: {}", e)),
        }
    }

    fn find_all(&self) -> Result<Vec<Book>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, title, author, genre, type, isbn, publication_year,
                 total_pages, total_minutes, current_page_text, current_minutes_audio,
                 status, is_archived, is_wishlist, cover_url, url,
                 added_at, updated_at, status_changed_at
                 FROM books ORDER BY added_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let book_iter = stmt
            .query_map([], |row| Self::row_to_book(row))
            .map_err(|e| format!("Failed to query books: {}", e))?;

        let mut books = Vec::new();
        for book_result in book_iter {
            books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
        }

        Ok(books)
    }

    fn find_by_status(&self, status: BookStatus) -> Result<Vec<Book>, String> {
        let status_str = Self::status_to_string(&status);
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, title, author, genre, type, isbn, publication_year,
                 total_pages, total_minutes, current_page_text, current_minutes_audio,
                 status, is_archived, is_wishlist, cover_url, url,
                 added_at, updated_at, status_changed_at
                 FROM books WHERE status = ?1 ORDER BY added_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let book_iter = stmt
            .query_map(params![status_str], |row| Self::row_to_book(row))
            .map_err(|e| format!("Failed to query books: {}", e))?;

        let mut books = Vec::new();
        for book_result in book_iter {
            books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
        }

        Ok(books)
    }

    fn find_by_type(&self, book_type: BookType) -> Result<Vec<Book>, String> {
        let type_str = Self::type_to_string(&book_type);
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, title, author, genre, type, isbn, publication_year,
                 total_pages, total_minutes, current_page_text, current_minutes_audio,
                 status, is_archived, is_wishlist, cover_url, url,
                 added_at, updated_at, status_changed_at
                 FROM books WHERE type = ?1 ORDER BY added_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let book_iter = stmt
            .query_map(params![type_str], |row| Self::row_to_book(row))
            .map_err(|e| format!("Failed to query books: {}", e))?;

        let mut books = Vec::new();
        for book_result in book_iter {
            books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
        }

        Ok(books)
    }

    fn find_with_filters(
        &self,
        status: Option<BookStatus>,
        book_type: Option<BookType>,
        is_archived: Option<bool>,
        is_wishlist: Option<bool>,
    ) -> Result<Vec<Book>, String> {
        // Build dynamic query and collect parameters
        let mut query = "SELECT id, title, author, genre, type, isbn, publication_year,
                         total_pages, total_minutes, current_page_text, current_minutes_audio,
                         status, is_archived, is_wishlist, cover_url, url,
                         added_at, updated_at, status_changed_at
                         FROM books WHERE 1=1".to_string();
        
        let mut status_str: Option<String> = None;
        let mut type_str: Option<String> = None;
        let mut archived_val: Option<i32> = None;
        let mut wishlist_val: Option<i32> = None;

        if let Some(status) = status {
            query.push_str(" AND status = ?");
            status_str = Some(Self::status_to_string(&status));
        }

        if let Some(book_type) = book_type {
            query.push_str(" AND type = ?");
            type_str = Some(Self::type_to_string(&book_type));
        }

        if let Some(archived) = is_archived {
            query.push_str(" AND is_archived = ?");
            archived_val = Some(if archived { 1 } else { 0 });
        }

        if let Some(wishlist) = is_wishlist {
            query.push_str(" AND is_wishlist = ?");
            wishlist_val = Some(if wishlist { 1 } else { 0 });
        }

        query.push_str(" ORDER BY added_at DESC");

        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(&query)
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        // Execute query based on parameters and collect results immediately
        let mut books = Vec::new();
        
        match (status_str.as_ref(), type_str.as_ref(), archived_val.as_ref(), wishlist_val.as_ref()) {
            (None, None, None, None) => {
                let book_iter = stmt.query_map([], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), None, None, None) => {
                let book_iter = stmt.query_map(params![s], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, Some(t), None, None) => {
                let book_iter = stmt.query_map(params![t], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, None, Some(a), None) => {
                let book_iter = stmt.query_map(params![a], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, None, None, Some(w)) => {
                let book_iter = stmt.query_map(params![w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), Some(t), None, None) => {
                let book_iter = stmt.query_map(params![s, t], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), None, Some(a), None) => {
                let book_iter = stmt.query_map(params![s, a], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), None, None, Some(w)) => {
                let book_iter = stmt.query_map(params![s, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, Some(t), Some(a), None) => {
                let book_iter = stmt.query_map(params![t, a], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, Some(t), None, Some(w)) => {
                let book_iter = stmt.query_map(params![t, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, None, Some(a), Some(w)) => {
                let book_iter = stmt.query_map(params![a, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), Some(t), Some(a), None) => {
                let book_iter = stmt.query_map(params![s, t, a], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), Some(t), None, Some(w)) => {
                let book_iter = stmt.query_map(params![s, t, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), None, Some(a), Some(w)) => {
                let book_iter = stmt.query_map(params![s, a, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (None, Some(t), Some(a), Some(w)) => {
                let book_iter = stmt.query_map(params![t, a, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
            (Some(s), Some(t), Some(a), Some(w)) => {
                let book_iter = stmt.query_map(params![s, t, a, w], |row| Self::row_to_book(row))
                    .map_err(|e| format!("Failed to query books: {}", e))?;
                for book_result in book_iter {
                    books.push(book_result.map_err(|e| format!("Failed to parse book: {}", e))?);
                }
            }
        }

        Ok(books)
    }
}

