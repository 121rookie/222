import React, { useState, useEffect } from 'react';

function FantasyJunkRoom() {
  const [gameState, setGameState] = useState('loading'); // loading, lobby, playing, collection
  const [currentRoom, setCurrentRoom] = useState(null);
  const [playerData, setPlayerData] = useState(null);

  // Initialize game
  useEffect(() => {
    // Load player data
    const data = window.GameStorage.loadPlayerData();
    setPlayerData(data);
    
    // Short loading screen
    setTimeout(() => {
      setGameState('lobby');
    }, 1000);
  }, []);

  // Save player data whenever it changes
  useEffect(() => {
    if (playerData) {
      window.GameStorage.savePlayerData(playerData);
    }
  }, [playerData]);

  const handleUpdatePlayerData = (newData) => {
    setPlayerData(newData);
  };

  const handleEnterRoom = (roomId) => {
    setCurrentRoom(roomId);
    setGameState('playing');
  };

  const handleBackToLobby = () => {
    setCurrentRoom(null);
    setGameState('lobby');
  };

  const handleViewCollection = () => {
    setGameState('collection');
  };

  if (gameState === 'loading' || !playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold mb-4">奇幻杂物间</h1>
          <div className="text-lg text-blue-200 mb-8">正在加载神秘的魔法世界...</div>
          
          {/* Loading animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  switch (gameState) {
    case 'lobby':
      return (
        <window.Lobby
          playerData={playerData}
          onUpdatePlayerData={handleUpdatePlayerData}
          onEnterRoom={handleEnterRoom}
          onViewCollection={handleViewCollection}
        />
      );
      
    case 'playing':
      return (
        <window.GameScene
          room={currentRoom}
          playerData={playerData}
          onUpdatePlayerData={handleUpdatePlayerData}
          onBackToLobby={handleBackToLobby}
        />
      );
      
    case 'collection':
      return (
        <window.Collection
          playerData={playerData}
          onClose={handleBackToLobby}
        />
      );
      
    default:
      return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">游戏状态错误</h2>
            <button
              onClick={() => setGameState('lobby')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              返回大厅
            </button>
          </div>
        </div>
      );
  }
}

window.FantasyJunkRoom = FantasyJunkRoom;