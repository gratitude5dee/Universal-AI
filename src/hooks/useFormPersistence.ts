import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseFormPersistenceOptions {
  key: string;
  autoSaveInterval?: number;
}

export function useFormPersistence<T extends Record<string, any>>(
  initialData: T,
  options: UseFormPersistenceOptions
) {
  const { key, autoSaveInterval = 30000 } = options;
  const { toast } = useToast();
  const [data, setData] = useState<T>(initialData);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData(parsed.data);
        setLastSaved(new Date(parsed.timestamp));
        
        toast({
          title: "Draft restored",
          description: "Your previous work has been restored.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [key]);

  // Auto-save functionality
  const saveData = useCallback(() => {
    try {
      const saveObject = {
        data,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(saveObject));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Save failed",
        description: "Could not save your progress. Please try again.",
        variant: "destructive",
      });
    }
  }, [data, key, toast]);

  // Auto-save on interval
  useEffect(() => {
    if (hasUnsavedChanges && autoSaveInterval > 0) {
      const interval = setInterval(() => {
        saveData();
      }, autoSaveInterval);

      return () => clearInterval(interval);
    }
  }, [hasUnsavedChanges, autoSaveInterval, saveData]);

  // Update data and mark as unsaved
  const updateData = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    setData(prev => {
      const newData = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      setHasUnsavedChanges(true);
      return newData;
    });
  }, []);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(key);
    setLastSaved(null);
    setHasUnsavedChanges(false);
  }, [key]);

  // Export data
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration exported",
      description: "Your agent configuration has been downloaded.",
    });
  }, [data, toast]);

  // Import data
  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setData(imported);
        setHasUnsavedChanges(true);
        toast({
          title: "Configuration imported",
          description: "Your agent configuration has been loaded.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid configuration file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  return {
    data,
    updateData,
    saveData,
    clearSavedData,
    exportData,
    importData,
    lastSaved,
    hasUnsavedChanges,
  };
}