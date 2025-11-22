import { useState } from 'react';
import { validateBackupJson } from '@/hooks/useBackup';
import { toast } from '@/utils/toast';

export function useImportActions() {
  const [importing, setImporting] = useState(false);

  const handleImportBackup = async () => {
    try {
      setImporting(true);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          setImporting(false);
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const jsonString = event.target?.result as string;
            
            await validateBackupJson(jsonString);
            
            const backupData = JSON.parse(jsonString);
            
            const preview = `This backup contains:\n` +
              `- Books: ${backupData.data?.books?.length || 0}\n` +
              `- Sessions: ${backupData.data?.sessions?.length || 0}\n` +
              `- Notes: ${backupData.data?.notes?.length || 0}\n` +
              `- Goals: ${backupData.data?.goals?.length || 0}\n\n` +
              `What would you like to do?`;
            
            confirm(preview + '\n\nOK = Merge with existing data\nCancel = Overwrite all data');
            toast.info('Import functionality will be implemented in the next phase');
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            toast.error(`Invalid backup file: ${message}`);
          } finally {
            setImporting(false);
          }
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    } catch (err) {
      toast.handleError(err, 'Failed to import backup');
      setImporting(false);
    }
  };

  return {
    importing,
    handleImportBackup,
  };
}

