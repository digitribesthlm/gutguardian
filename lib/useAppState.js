'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const AIPStage = {
  ELIMINATION: 'Elimination',
  REINTRODUCTION: 'Reintroduction',
  MAINTENANCE: 'Maintenance',
};

export { AIPStage };

export function useAppState() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({
    name: 'Guest',
    currentStage: AIPStage.ELIMINATION,
    startDate: Date.now(),
    triggerFoods: [],
  });
  const [shoppingList, setShoppingList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Helper to make API calls with user ID
  const apiCall = useCallback(async (url, options = {}) => {
    if (!user?.id) return null;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      console.error('API error:', response.status);
      return null;
    }
    
    return response.json();
  }, [user?.id]);

  // Load data from MongoDB on mount / user change
  useEffect(() => {
    if (!user?.id) {
      setLoaded(false);
      return;
    }

    const loadData = async () => {
      try {
        const [logsRes, settingsRes, shoppingRes] = await Promise.all([
          apiCall('/api/logs'),
          apiCall('/api/settings'),
          apiCall('/api/shopping'),
        ]);

        if (logsRes?.logs) setLogs(logsRes.logs);
        if (settingsRes?.settings) {
          setSettings({
            name: settingsRes.settings.name || user.name || 'Guest',
            currentStage: settingsRes.settings.currentStage || AIPStage.ELIMINATION,
            startDate: settingsRes.settings.startDate || Date.now(),
            triggerFoods: settingsRes.settings.triggerFoods || [],
          });
        }
        if (shoppingRes?.items) setShoppingList(shoppingRes.items);
        
        setLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoaded(true);
      }
    };

    loadData();
  }, [user?.id, user?.name, apiCall]);

  // Add a new log entry
  const addLog = useCallback(async (log) => {
    const newLog = {
      ...log,
      id: log.id || uuidv4(),
      timestamp: log.timestamp || Date.now(),
    };

    // Optimistic update
    setLogs((prev) => [...prev, newLog]);

    // Save to MongoDB
    const result = await apiCall('/api/logs', {
      method: 'POST',
      body: JSON.stringify(newLog),
    });
    
    if (!result) {
      console.error('Failed to save journal entry');
    }
  }, [apiCall]);

  // Update settings
  const updateSettings = useCallback(async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    
    // Optimistic update
    setSettings(updated);

    // Save to MongoDB
    await apiCall('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(newSettings),
    });
  }, [settings, apiCall]);

  // Add items to shopping list
  const addToShoppingList = useCallback(async (itemNames) => {
    const newItems = itemNames.map((name) => ({
      id: uuidv4(),
      name,
      checked: false,
      addedAt: Date.now(),
    }));

    // Optimistic update
    setShoppingList((prev) => [...prev, ...newItems]);

    // Save to MongoDB
    await apiCall('/api/shopping', {
      method: 'POST',
      body: JSON.stringify({ items: newItems }),
    });
  }, [apiCall]);

  // Toggle shopping item checked status
  const toggleShoppingItem = useCallback(async (id) => {
    const item = shoppingList.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;

    // Optimistic update
    setShoppingList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: newChecked } : i))
    );

    // Save to MongoDB
    await apiCall('/api/shopping', {
      method: 'PUT',
      body: JSON.stringify({ id, checked: newChecked }),
    });
  }, [shoppingList, apiCall]);

  // Remove a shopping item
  const removeShoppingItem = useCallback(async (id) => {
    // Optimistic update
    setShoppingList((prev) => prev.filter((item) => item.id !== id));

    // Delete from MongoDB
    await apiCall('/api/shopping', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }, [apiCall]);

  // Clear all checked items
  const clearCheckedItems = useCallback(async () => {
    // Optimistic update
    setShoppingList((prev) => prev.filter((item) => !item.checked));

    // Delete from MongoDB
    await apiCall('/api/shopping', {
      method: 'DELETE',
      body: JSON.stringify({ clearChecked: true }),
    });
  }, [apiCall]);

  return {
    logs,
    settings,
    shoppingList,
    loaded,
    addLog,
    updateSettings,
    addToShoppingList,
    toggleShoppingItem,
    removeShoppingItem,
    clearCheckedItems,
  };
}
