use crate::infrastructure::database::integrity::IntegrityChecker;
use crate::infrastructure::database::integrity::{IntegrityReport, IntegrityIssue};
use crate::adapters::tauri::AppState;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct IntegrityReportDto {
    pub is_valid: bool,
    pub issues: Vec<IntegrityIssueDto>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IntegrityIssueDto {
    pub issue_type: String,
    pub table: String,
    pub id: Option<i64>,
    pub description: String,
}

impl From<IntegrityIssue> for IntegrityIssueDto {
    fn from(issue: IntegrityIssue) -> Self {
        IntegrityIssueDto {
            issue_type: issue.issue_type,
            table: issue.table,
            id: issue.id,
            description: issue.description,
        }
    }
}

impl From<IntegrityReport> for IntegrityReportDto {
    fn from(report: IntegrityReport) -> Self {
        IntegrityReportDto {
            is_valid: report.is_valid,
            issues: report.issues.into_iter().map(|i| i.into()).collect(),
        }
    }
}

/// Tauri command: Check database integrity
#[tauri::command]
pub fn check_integrity(
    state: tauri::State<AppState>,
) -> Result<IntegrityReportDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    
    let checker = IntegrityChecker::new(sqlite_conn);
    let report = checker.check_all()?;
    
    Ok(report.into())
}

