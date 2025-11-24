use crate::core::domains::agenda_block::AgendaBlock;
use crate::core::filters::AgendaBlockFilters;

/// Repository trait for agenda blocks
pub trait AgendaRepository: Send + Sync {
    /// Create a new agenda block
    fn create(&self, block: &AgendaBlock) -> Result<AgendaBlock, String>;

    /// Update an existing agenda block
    fn update(&self, block: &AgendaBlock) -> Result<AgendaBlock, String>;

    /// Delete an agenda block by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Find an agenda block by ID
    fn find_by_id(&self, id: i64) -> Result<Option<AgendaBlock>, String>;

    /// Find all agenda blocks with optional filters
    /// All filters are optional and can be combined
    fn find_all(&self, filters: &AgendaBlockFilters) -> Result<Vec<AgendaBlock>, String>;
}

