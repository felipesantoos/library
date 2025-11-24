use serde::{Deserialize, Serialize, Deserializer};
use crate::core::domains::note::Note;

/// Custom deserializer that treats missing field as None and null as Some(None)
/// The key insight: when field is present as null, we need to return Some(None)
/// When field is missing, we return None
fn deserialize_optional_page<'de, D>(deserializer: D) -> Result<Option<Option<i32>>, D::Error>
where
    D: Deserializer<'de>,
{
    use serde::de::{self, Visitor};
    use std::fmt;

    struct OptionalPageVisitor;

    impl<'de> Visitor<'de> for OptionalPageVisitor {
        type Value = Option<Option<i32>>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("an optional i32 (null, number, or missing)")
        }

        fn visit_none<E>(self) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            // When deserialize_option is used and the value is null,
            // visit_none is called. Since our deserializer is only called
            // when the field exists in the JSON (even if null), we know
            // this means the field is present as null, so return Some(None)
            eprintln!("[deserialize_optional_page] visit_none called - field present as null, returning Some(None)");
            Ok(Some(None))
        }

        fn visit_some<D>(self, deserializer: D) -> Result<Self::Value, D::Error>
        where
            D: Deserializer<'de>,
        {
            // Field is present with a value, deserialize as i32
            let value = i32::deserialize(deserializer)?;
            eprintln!("[deserialize_optional_page] visit_some - number value: {}, returning Some(Some({}))", value, value);
            Ok(Some(Some(value)))
        }

        fn visit_unit<E>(self) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            // null value means clear
            eprintln!("[deserialize_optional_page] visit_unit called - null value, returning Some(None)");
            Ok(Some(None))
        }
        
        fn visit_i32<E>(self, v: i32) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            eprintln!("[deserialize_optional_page] visit_i32 called with value: {}", v);
            Ok(Some(Some(v)))
        }
        
        fn visit_i64<E>(self, v: i64) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            eprintln!("[deserialize_optional_page] visit_i64 called with value: {}, converting to i32", v);
            Ok(Some(Some(v as i32)))
        }
    }

    // Use deserialize_option - this will call visit_none for null values
    deserializer.deserialize_option(OptionalPageVisitor)
}

/// Note Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoteDto {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub page: Option<i32>,
    pub content: String,
    pub created_at: String, // ISO8601 string
    pub updated_at: String, // ISO8601 string
}

impl From<Note> for NoteDto {
    fn from(note: Note) -> Self {
        NoteDto {
            id: note.id,
            book_id: note.book_id,
            reading_id: note.reading_id,
            page: note.page,
            content: note.content,
            created_at: note.created_at.to_rfc3339(),
            updated_at: note.updated_at.to_rfc3339(),
        }
    }
}

/// Command for creating a note
#[derive(Debug, Deserialize)]
pub struct CreateNoteCommand {
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub page: Option<i32>,
    pub content: String,
}

/// Command for updating a note
#[derive(Debug, Deserialize)]
pub struct UpdateNoteCommand {
    pub id: i64,
    #[serde(default, deserialize_with = "deserialize_optional_page")]
    pub page: Option<Option<i32>>, // None = not provided, Some(None) = clear, Some(Some(val)) = set value
    pub content: Option<String>,
}

impl UpdateNoteCommand {
    pub fn new() -> Self {
        Self {
            id: 0,
            page: None,
            content: None,
        }
    }
}

