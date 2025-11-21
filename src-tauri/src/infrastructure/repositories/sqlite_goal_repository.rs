use crate::domain::entities::{Goal, GoalType};
use crate::ports::repositories::GoalRepository;
use rusqlite::params;
use std::sync::{Arc, Mutex};

/// SQLite implementation of GoalRepository
pub struct SqliteGoalRepository {
    connection: Arc<Mutex<rusqlite::Connection>>,
}

impl SqliteGoalRepository {
    pub fn new(connection: Arc<Mutex<rusqlite::Connection>>) -> Self {
        SqliteGoalRepository { connection }
    }

    fn goal_type_to_string(goal_type: &GoalType) -> String {
        match goal_type {
            GoalType::PagesMonthly => "pages_monthly".to_string(),
            GoalType::BooksYearly => "books_yearly".to_string(),
            GoalType::MinutesDaily => "minutes_daily".to_string(),
        }
    }

    fn string_to_goal_type(s: &str) -> Result<GoalType, String> {
        match s {
            "pages_monthly" => Ok(GoalType::PagesMonthly),
            "books_yearly" => Ok(GoalType::BooksYearly),
            "minutes_daily" => Ok(GoalType::MinutesDaily),
            _ => Err(format!("Invalid goal type: {}", s)),
        }
    }

    fn row_to_goal(row: &rusqlite::Row) -> Result<Goal, rusqlite::Error> {
        Ok(Goal {
            id: Some(row.get(0)?),
            goal_type: Self::string_to_goal_type(&row.get::<_, String>(1)?)
                .map_err(|e| rusqlite::Error::InvalidColumnType(1, e, rusqlite::types::Type::Text))?,
            target_value: row.get(2)?,
            period_year: row.get(3)?,
            period_month: row.get(4)?,
            is_active: row.get::<_, i32>(5)? != 0,
            created_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(6, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
            updated_at: chrono::DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?)
                .map_err(|_| rusqlite::Error::InvalidColumnType(7, "Invalid datetime".to_string(), rusqlite::types::Type::Text))?
                .with_timezone(&chrono::Utc),
        })
    }
}

impl GoalRepository for SqliteGoalRepository {
    fn create(&self, goal: &mut Goal) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let goal_type_str = Self::goal_type_to_string(&goal.goal_type);
        let created_at = goal.created_at.to_rfc3339();
        let updated_at = goal.updated_at.to_rfc3339();

        conn.execute(
            "INSERT INTO goals (
                type, target_value, period_year, period_month, is_active,
                created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                goal_type_str,
                goal.target_value,
                goal.period_year,
                goal.period_month,
                if goal.is_active { 1 } else { 0 },
                created_at,
                updated_at
            ],
        )
        .map_err(|e| format!("Failed to insert goal: {}", e))?;

        goal.id = Some(conn.last_insert_rowid());
        Ok(())
    }

    fn update(&self, goal: &Goal) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let id = goal.id.ok_or("Goal ID is required for update".to_string())?;
        let goal_type_str = Self::goal_type_to_string(&goal.goal_type);
        let updated_at = chrono::Utc::now().to_rfc3339();

        conn.execute(
            "UPDATE goals SET
                type = ?2, target_value = ?3, period_year = ?4,
                period_month = ?5, is_active = ?6, updated_at = ?7
            WHERE id = ?1",
            params![
                id,
                goal_type_str,
                goal.target_value,
                goal.period_year,
                goal.period_month,
                if goal.is_active { 1 } else { 0 },
                updated_at
            ],
        )
        .map_err(|e| format!("Failed to update goal: {}", e))?;

        Ok(())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        conn.execute("DELETE FROM goals WHERE id = ?1", params![id])
            .map_err(|e| format!("Failed to delete goal: {}", e))?;

        Ok(())
    }

    fn find_by_id(&self, id: i64) -> Result<Option<Goal>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, type, target_value, period_year, period_month,
                 is_active, created_at, updated_at
                 FROM goals WHERE id = ?1"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let goal_result = stmt
            .query_row(params![id], |row| Self::row_to_goal(row));

        match goal_result {
            Ok(goal) => Ok(Some(goal)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("Failed to find goal: {}", e)),
        }
    }

    fn find_all(&self) -> Result<Vec<Goal>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, type, target_value, period_year, period_month,
                 is_active, created_at, updated_at
                 FROM goals ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let goal_iter = stmt
            .query_map([], |row| Self::row_to_goal(row))
            .map_err(|e| format!("Failed to query goals: {}", e))?;

        let mut goals = Vec::new();
        for goal_result in goal_iter {
            goals.push(goal_result.map_err(|e| format!("Failed to parse goal: {}", e))?);
        }

        Ok(goals)
    }

    fn find_active(&self) -> Result<Vec<Goal>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, type, target_value, period_year, period_month,
                 is_active, created_at, updated_at
                 FROM goals WHERE is_active = 1 ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let goal_iter = stmt
            .query_map([], |row| Self::row_to_goal(row))
            .map_err(|e| format!("Failed to query goals: {}", e))?;

        let mut goals = Vec::new();
        for goal_result in goal_iter {
            goals.push(goal_result.map_err(|e| format!("Failed to parse goal: {}", e))?);
        }

        Ok(goals)
    }

    fn find_by_type(&self, goal_type: GoalType) -> Result<Vec<Goal>, String> {
        let type_str = Self::goal_type_to_string(&goal_type);
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut stmt = conn
            .prepare(
                "SELECT id, type, target_value, period_year, period_month,
                 is_active, created_at, updated_at
                 FROM goals WHERE type = ?1 ORDER BY created_at DESC"
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let goal_iter = stmt
            .query_map(params![type_str], |row| Self::row_to_goal(row))
            .map_err(|e| format!("Failed to query goals: {}", e))?;

        let mut goals = Vec::new();
        for goal_result in goal_iter {
            goals.push(goal_result.map_err(|e| format!("Failed to parse goal: {}", e))?);
        }

        Ok(goals)
    }

    fn find_by_period(
        &self,
        year: Option<i32>,
        month: Option<u32>,
    ) -> Result<Vec<Goal>, String> {
        let conn = self.connection.lock().map_err(|e| format!("Lock error: {}", e))?;
        
        let mut query = "SELECT id, type, target_value, period_year, period_month,
                         is_active, created_at, updated_at
                         FROM goals WHERE 1=1".to_string();
        
        let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

        if let Some(year) = year {
            query.push_str(" AND period_year = ?");
            params_vec.push(Box::new(year));
        }

        if let Some(month) = month {
            query.push_str(" AND period_month = ?");
            params_vec.push(Box::new(month as i32));
        }

        query.push_str(" ORDER BY created_at DESC");

        let mut stmt = conn
            .prepare(&query)
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let rusqlite_params: Vec<&dyn rusqlite::ToSql> = params_vec.iter().map(|p| p.as_ref()).collect();
        
        let goal_iter = stmt
            .query_map(&rusqlite_params[..], |row| Self::row_to_goal(row))
            .map_err(|e| format!("Failed to query goals: {}", e))?;

        let mut goals = Vec::new();
        for goal_result in goal_iter {
            goals.push(goal_result.map_err(|e| format!("Failed to parse goal: {}", e))?);
        }

        Ok(goals)
    }
}

