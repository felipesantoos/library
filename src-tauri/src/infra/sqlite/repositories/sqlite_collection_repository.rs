use crate::core::domains::collection::Collection;
use crate::core::interfaces::secondary::CollectionRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of CollectionRepository
pub struct SqliteCollectionRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteCollectionRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteCollectionRepository { connection }
    }

    fn row_to_collection(row: &rusqlite::Row) -> Result<Collection, rusqlite::Error> {
        Ok(Collection {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            description: row.get(2)?,
            created_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(3, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
            updated_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(4, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
        })
    }
}

impl CollectionRepository for SqliteCollectionRepository {
    fn create(&self, collection: &mut Collection) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let created_at = collection.created_at.to_rfc3339();
        let updated_at = collection.updated_at.to_rfc3339();

        conn.execute(
            "INSERT INTO collections (name, description, created_at, updated_at) VALUES (?1, ?2, ?3, ?4)",
            params![collection.name, collection.description, created_at, updated_at],
        )
        .map_err(|e| format!("Failed to insert collection: {}", e))?;

        collection.id = Some(conn.last_insert_rowid());
        Ok(())
    }

    fn update(&self, collection: &Collection) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let id = collection.id.ok_or("Collection ID is required for update".to_string())?;
        let updated_at = collection.updated_at.to_rfc3339();

        conn.execute(
            "UPDATE collections SET name = ?2, description = ?3, updated_at = ?4 WHERE id = ?1",
            params![id, collection.name, collection.description, updated_at],
        )
        .map_err(|e| format!("Failed to update collection: {}", e))?;

        Ok(())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM collections WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete collection: {}", e))?;

        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Collection>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT id, name, description, created_at, updated_at FROM collections WHERE id = ?1")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let collection_result = stmt.query_row(params![id], |row| Self::row_to_collection(row));

        match collection_result {
            Ok(collection) => Ok(Some(collection)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find collection: {}", e)),
        }
    }

    fn find_by_name(&self, name: &str) -> Result<Option<Collection>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT id, name, description, created_at, updated_at FROM collections WHERE name = ?1")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let collection_result = stmt.query_row(params![name], |row| Self::row_to_collection(row));

        match collection_result {
            Ok(collection) => Ok(Some(collection)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find collection: {}", e)),
        }
    }

    fn find_all(&self) -> Result<Vec<Collection>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare("SELECT id, name, description, created_at, updated_at FROM collections ORDER BY name")
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let collection_iter = stmt
            .query_map([], |row| Self::row_to_collection(row))
            .map_err(|e| format!("Failed to query collections: {}", e))?;

        let mut collections = Vec::new();
        for collection_result in collection_iter {
            collections.push(collection_result.map_err(|e| format!("Failed to parse collection: {}", e))?);
        }

        Ok(collections)
    }

    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Collection>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT c.id, c.name, c.description, c.created_at, c.updated_at
                 FROM collections c
                 INNER JOIN book_collections bc ON c.id = bc.collection_id
                 WHERE bc.book_id = ?1
                 ORDER BY c.name"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let collection_iter = stmt
            .query_map(params![book_id], |row| Self::row_to_collection(row))
            .map_err(|e| format!("Failed to query collections: {}", e))?;

        let mut collections = Vec::new();
        for collection_result in collection_iter {
            collections.push(collection_result.map_err(|e| format!("Failed to parse collection: {}", e))?);
        }

        Ok(collections)
    }

    fn add_book(&self, book_id: i64, collection_id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        eprintln!("[SqliteCollectionRepository::add_book] Adding book_id={} to collection_id={}", book_id, collection_id);
        
        let rows_affected = conn.execute(
            "INSERT OR IGNORE INTO book_collections (book_id, collection_id) VALUES (?1, ?2)",
            params![book_id, collection_id],
        )
        .map_err(|e| format!("Failed to add book to collection: {}", e))?;

        eprintln!("[SqliteCollectionRepository::add_book] Insert completed, rows_affected={}", rows_affected);
        
        // Verify the insertion
        let verify_query = "SELECT COUNT(*) FROM book_collections WHERE book_id = ?1 AND collection_id = ?2";
        if let Ok(mut verify_stmt) = conn.prepare(verify_query) {
            if let Ok(count) = verify_stmt.query_row(params![book_id, collection_id], |row| row.get::<_, i64>(0)) {
                eprintln!("[SqliteCollectionRepository::add_book] Verification: {} record(s) found for book_id={}, collection_id={}", count, book_id, collection_id);
            }
        }

        Ok(())
    }

    fn remove_book(&self, book_id: i64, collection_id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "DELETE FROM book_collections WHERE book_id = ?1 AND collection_id = ?2",
            params![book_id, collection_id],
        )
        .map_err(|e| format!("Failed to remove book from collection: {}", e))?;

        Ok(())
    }

    fn remove_all_books(&self, collection_id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute(
            "DELETE FROM book_collections WHERE collection_id = ?1",
            params![collection_id],
        )
        .map_err(|e| format!("Failed to remove books from collection: {}", e))?;

        Ok(())
    }
}

