use crate::core::domains::tag::Tag;
use crate::core::interfaces::secondary::TagRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of TagRepository
pub struct SqliteTagRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteTagRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteTagRepository { connection }
    }

    fn row_to_tag(row: &rusqlite::Row) -> Result<Tag, rusqlite::Error> {
        Ok(Tag {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            color: row.get(2)?,
            created_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(3, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
        })
    }
}

impl TagRepository for SqliteTagRepository {
    fn create(&self, tag: &mut Tag) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let created_at = tag.created_at.to_rfc3339();

        conn.execute(
            "INSERT INTO tags (name, color, created_at) VALUES (?1, ?2, ?3)",
            params![tag.name, tag.color, created_at],
        )
        .map_err(|e| format!("Failed to insert tag: {}", e))?;

        tag.id = Some(conn.last_insert_rowid());
        Ok(())
    }

    fn update(&self, tag: &Tag) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let id = tag.id.ok_or("Tag ID is required for update".to_string())?;

        conn.execute(
            "UPDATE tags SET name = ?2, color = ?3 WHERE id = ?1",
            params![id, tag.name, tag.color],
        )
        .map_err(|e| format!("Failed to update tag: {}", e))?;

        Ok(())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM tags WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete tag: {}", e))?;

        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Tag>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT id, name, color, created_at FROM tags WHERE id = ?1")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let tag_result = stmt.query_row(params![id], |row| Self::row_to_tag(row));

        match tag_result {
            Ok(tag) => Ok(Some(tag)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find tag: {}", e)),
        }
    }

    fn find_by_name(&self, name: &str) -> Result<Option<Tag>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT id, name, color, created_at FROM tags WHERE name = ?1")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let tag_result = stmt.query_row(params![name], |row| Self::row_to_tag(row));

        match tag_result {
            Ok(tag) => Ok(Some(tag)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find tag: {}", e)),
        }
    }

    fn find_all(&self) -> Result<Vec<Tag>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT id, name, color, created_at FROM tags ORDER BY name")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let tag_iter = stmt
            .query_map([], |row| Self::row_to_tag(row))
            .map_err(|e| format!("Failed to query tags: {}", e))?;

        let mut tags = Vec::new();
        for tag_result in tag_iter {
            tags.push(tag_result.map_err(|e| format!("Failed to parse tag: {}", e))?);
        }

        Ok(tags)
    }

    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Tag>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT t.id, t.name, t.color, t.created_at
                 FROM tags t
                 INNER JOIN book_tags bt ON t.id = bt.tag_id
                 WHERE bt.book_id = ?1
                 ORDER BY t.name"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let tag_iter = stmt
            .query_map(params![book_id], |row| Self::row_to_tag(row))
            .map_err(|e| format!("Failed to query tags: {}", e))?;

        let mut tags = Vec::new();
        for tag_result in tag_iter {
            tags.push(tag_result.map_err(|e| format!("Failed to parse tag: {}", e))?);
        }

        Ok(tags)
    }

    fn add_to_book(&self, book_id: i64, tag_id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "INSERT OR IGNORE INTO book_tags (book_id, tag_id) VALUES (?1, ?2)",
            params![book_id, tag_id],
        )
        .map_err(|e| format!("Failed to add tag to book: {}", e))?;

        Ok(())
    }

    fn remove_from_book(&self, book_id: i64, tag_id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "DELETE FROM book_tags WHERE book_id = ?1 AND tag_id = ?2",
            params![book_id, tag_id],
        )
        .map_err(|e| format!("Failed to remove tag from book: {}", e))?;

        Ok(())
    }

    fn remove_all_from_book(&self, book_id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "DELETE FROM book_tags WHERE book_id = ?1",
            params![book_id],
        )
        .map_err(|e| format!("Failed to remove tags from book: {}", e))?;

        Ok(())
    }
}

