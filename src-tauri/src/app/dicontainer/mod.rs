use crate::core::services::{
    agenda::AgendaServiceImpl,
    books::BookServiceImpl,
    goals::GoalServiceImpl,
    sessions::SessionServiceImpl,
    notes::NoteServiceImpl,
    journal::JournalServiceImpl,
    collections::CollectionServiceImpl,
    tags::TagServiceImpl,
    readings::ReadingServiceImpl,
    settings::SettingsServiceImpl,
    statistics::StatisticsServiceImpl,
};
use crate::infra::sqlite::database::DatabaseConnection;
use crate::infra::sqlite::repositories::{
    SqliteAgendaRepository, SqliteBookRepository, SqliteGoalRepository,
    SqliteSessionRepository, SqliteNoteRepository, SqliteJournalRepository,
    SqliteCollectionRepository, SqliteTagRepository, SqliteReadingRepository,
    SqliteSettingsRepository,
};

/// Dependency injection container that holds all repositories
/// Services are created on-demand from repositories
pub struct DIContainer {
    // Repositories
    agenda_repository: SqliteAgendaRepository,
    book_repository: SqliteBookRepository,
    goal_repository: SqliteGoalRepository,
    session_repository: SqliteSessionRepository,
    note_repository: SqliteNoteRepository,
    journal_repository: SqliteJournalRepository,
    collection_repository: SqliteCollectionRepository,
    tag_repository: SqliteTagRepository,
    reading_repository: SqliteReadingRepository,
    settings_repository: SqliteSettingsRepository,
}

impl DIContainer {
    pub fn new(db_connection: DatabaseConnection) -> Self {
        let connection = db_connection.get_connection();
        
        // Create all repositories
        let agenda_repo = SqliteAgendaRepository::new(connection.clone());
        let book_repo = SqliteBookRepository::new(connection.clone());
        let goal_repo = SqliteGoalRepository::new(connection.clone());
        let session_repo = SqliteSessionRepository::new(connection.clone());
        let note_repo = SqliteNoteRepository::new(connection.clone());
        let journal_repo = SqliteJournalRepository::new(connection.clone());
        let collection_repo = SqliteCollectionRepository::new(connection.clone());
        let tag_repo = SqliteTagRepository::new(connection.clone());
        let reading_repo = SqliteReadingRepository::new(connection.clone());
        let settings_repo = SqliteSettingsRepository::new(connection);
        
        DIContainer {
            agenda_repository: agenda_repo,
            book_repository: book_repo,
            goal_repository: goal_repo,
            session_repository: session_repo,
            note_repository: note_repo,
            journal_repository: journal_repo,
            collection_repository: collection_repo,
            tag_repository: tag_repo,
            reading_repository: reading_repo,
            settings_repository: settings_repo,
        }
    }
    
    pub fn agenda_service(&self) -> AgendaServiceImpl {
        AgendaServiceImpl::new(&self.agenda_repository)
    }

    pub fn book_service(&self) -> BookServiceImpl {
        BookServiceImpl::new(&self.book_repository, &self.note_repository)
    }

    pub fn goal_service(&self) -> GoalServiceImpl {
        GoalServiceImpl::new(
            &self.goal_repository,
            &self.session_repository,
            &self.book_repository,
        )
    }

    pub fn settings_service(&self) -> SettingsServiceImpl {
        SettingsServiceImpl::new(&self.settings_repository)
    }

    pub fn statistics_service(&self) -> StatisticsServiceImpl {
        StatisticsServiceImpl::new(
            &self.session_repository,
            &self.book_repository,
        )
    }

    pub fn session_service(&self) -> SessionServiceImpl {
        SessionServiceImpl::new(
            &self.session_repository,
            &self.book_repository,
        )
    }

    pub fn note_service(&self) -> NoteServiceImpl {
        NoteServiceImpl::new(
            &self.note_repository,
            &self.book_repository,
        )
    }

    pub fn journal_service(&self) -> JournalServiceImpl {
        JournalServiceImpl::new(&self.journal_repository)
    }

    pub fn collection_service(&self) -> CollectionServiceImpl {
        CollectionServiceImpl::new(
            &self.collection_repository,
            &self.book_repository,
        )
    }

    pub fn tag_service(&self) -> TagServiceImpl {
        TagServiceImpl::new(
            &self.tag_repository,
            &self.book_repository,
        )
    }

    pub fn reading_service(&self) -> ReadingServiceImpl {
        ReadingServiceImpl::new(
            &self.reading_repository,
            &self.book_repository,
        )
    }
}
