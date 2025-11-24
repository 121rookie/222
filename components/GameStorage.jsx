import React from 'react';

// Game storage utilities
window.GameStorage = {
  // Default player data
  getDefaultPlayerData: () => ({
    coins: 100,
    unlockedRooms: ['starter-room'],
    collectedItems: {},
    roomProgress: {},
    settings: {
      soundEnabled: true,
      musicEnabled: true
    },
    stats: {
      totalGamesPlayed: 0,
      totalItemsCollected: 0,
      totalCoinsEarned: 0
    },
    lastPlayTime: Date.now()
  }),

  // Load player data
  loadPlayerData: () => {
    try {
      const saved = localStorage.getItem('fantasyJunkRoom_playerData');
      if (saved) {
        const data = JSON.parse(saved);
        return { ...window.GameStorage.getDefaultPlayerData(), ...data };
      }
    } catch (error) {
      console.warn('Failed to load player data:', error);
    }
    return window.GameStorage.getDefaultPlayerData();
  },

  // Save player data
  savePlayerData: (playerData) => {
    try {
      localStorage.setItem('fantasyJunkRoom_playerData', JSON.stringify(playerData));
    } catch (error) {
      console.warn('Failed to save player data:', error);
    }
  },

  // Add item to collection
  addItemToCollection: (playerData, itemId) => {
    if (!playerData.collectedItems[itemId]) {
      playerData.collectedItems[itemId] = 0;
    }
    playerData.collectedItems[itemId]++;
    playerData.stats.totalItemsCollected++;
  },

  // Add coins
  addCoins: (playerData, amount) => {
    playerData.coins += amount;
    playerData.stats.totalCoinsEarned += amount;
  },

  // Check if room is unlocked
  isRoomUnlocked: (playerData, roomId) => {
    return playerData.unlockedRooms.includes(roomId);
  },

  // Unlock room
  unlockRoom: (playerData, roomId) => {
    if (!playerData.unlockedRooms.includes(roomId)) {
      playerData.unlockedRooms.push(roomId);
    }
  },

  // Get collection progress
  getCollectionProgress: (playerData) => {
    const totalItems = Object.keys(window.GameData.items).length;
    const collectedItems = Object.keys(playerData.collectedItems).length;
    return Math.round((collectedItems / totalItems) * 100);
  }
};