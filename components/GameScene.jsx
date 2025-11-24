import React, { useState, useEffect, useRef, useCallback } from 'react';

function GameScene({ room, playerData, onUpdatePlayerData, onBackToLobby }) {
  const [gameItems, setGameItems] = useState([]);
  const [mergeItems, setMergeItems] = useState([null, null, null]);
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, paused, completed, failed
  const [showParticles, setShowParticles] = useState([]);
  const [showAdOffer, setShowAdOffer] = useState(false);
  const gameAreaRef = useRef(null);

  const roomData = window.GameData.rooms[room];

  // Initialize game
  useEffect(() => {
    if (roomData) {
      setTargetScore(roomData.clearTarget);
      generateInitialItems();
    }
  }, [room, roomData]);

  // Generate random items in the room
  const generateInitialItems = useCallback(() => {
    const items = [];
    const itemCount = 15 + Math.floor(Math.random() * 10); // 15-25 items
    
    for (let i = 0; i < itemCount; i++) {
      const itemId = window.GameData.getRandomItem(room);
      if (itemId) {
        items.push({
          id: itemId,
          uniqueId: `${itemId}_${Date.now()}_${i}`,
          position: {
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 70,
            z: i,
            rotation: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.4
          }
        });
      }
    }
    
    setGameItems(items);
  }, [room]);

  // Extract item from game area
  const handleExtractItem = useCallback((item) => {
    // Remove item from game area
    setGameItems(prev => prev.filter(i => i.uniqueId !== item.uniqueId));
    
    // Try to add to merge slots
    const emptySlotIndex = mergeItems.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      const newMergeItems = [...mergeItems];
      newMergeItems[emptySlotIndex] = item;
      setMergeItems(newMergeItems);
      
      // Add to collection
      const updatedPlayerData = { ...playerData };
      window.GameStorage.addItemToCollection(updatedPlayerData, item.id);
      onUpdatePlayerData(updatedPlayerData);
      
      // Increase score
      setScore(prev => prev + 1);
      
      // Show particle effect
      setShowParticles(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        text: '+1'
      }]);
    }
  }, [mergeItems, playerData, onUpdatePlayerData]);

  // Handle merge completion
  const handleMerge = useCallback((newItemId) => {
    // Clear merge slots
    setMergeItems([null, null, null]);
    
    // Add merged item to collection
    const updatedPlayerData = { ...playerData };
    window.GameStorage.addItemToCollection(updatedPlayerData, newItemId);
    
    // Award bonus coins for merge
    const bonusCoins = 10;
    window.GameStorage.addCoins(updatedPlayerData, bonusCoins);
    
    onUpdatePlayerData(updatedPlayerData);
    
    // Increase score significantly
    setScore(prev => prev + 5);
    
    // Show merge particles
    setShowParticles(prev => [...prev, {
      id: Date.now(),
      x: 50,
      y: 90,
      text: `合成成功! +${bonusCoins} 金币`,
      color: 'text-yellow-400',
      duration: 2000
    }]);
  }, [playerData, onUpdatePlayerData]);

  // Handle slot click (remove item)
  const handleSlotClick = useCallback((index) => {
    if (mergeItems[index]) {
      const newMergeItems = [...mergeItems];
      newMergeItems[index] = null;
      setMergeItems(newMergeItems);
    }
  }, [mergeItems]);

  // Check win condition
  useEffect(() => {
    if (score >= targetScore && gameState === 'playing') {
      setGameState('completed');
      
      // Award room completion rewards
      const updatedPlayerData = { ...playerData };
      window.GameStorage.addCoins(updatedPlayerData, roomData.coinReward);
      updatedPlayerData.stats.totalGamesPlayed++;
      
      onUpdatePlayerData(updatedPlayerData);
    }
  }, [score, targetScore, gameState, playerData, onUpdatePlayerData, roomData]);

  // Handle particle cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(prev => prev.slice(1));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [showParticles]);

  // Handle game failure (no more extractable items and score not reached)
  useEffect(() => {
    if (gameItems.length === 0 && score < targetScore && gameState === 'playing') {
      setShowAdOffer(true);
    }
  }, [gameItems.length, score, targetScore, gameState]);

  const handleWatchAd = () => {
    setShowAdOffer(false);
    // Simulate ad watching - regenerate some items
    const newItems = [];
    const itemCount = 5;
    
    for (let i = 0; i < itemCount; i++) {
      const itemId = window.GameData.getRandomItem(room);
      if (itemId) {
        newItems.push({
          id: itemId,
          uniqueId: `${itemId}_${Date.now()}_revival_${i}`,
          position: {
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            z: 1000 + i,
            rotation: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.4
          }
        });
      }
    }
    
    setGameItems(prev => [...prev, ...newItems]);
    
    // Bonus coins for watching ad
    const updatedPlayerData = { ...playerData };
    window.GameStorage.addCoins(updatedPlayerData, 20);
    onUpdatePlayerData(updatedPlayerData);
  };

  const handleRestart = () => {
    setScore(0);
    setMergeItems([null, null, null]);
    setGameState('playing');
    setShowAdOffer(false);
    generateInitialItems();
  };

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">房间未找到</h2>
          <button
            onClick={onBackToLobby}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            返回大厅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${roomData.background} relative overflow-hidden`}>
      {/* Header */}
      <div className="relative z-40 p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <button
            onClick={onBackToLobby}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            ← 返回大厅
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold">{roomData.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span>进度: {score}/{targetScore}</span>
              <span>金币: {playerData.coins}</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-64 bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-white text-right">
            <div>收集率</div>
            <div className="text-lg font-bold">
              {window.GameStorage.getCollectionProgress(playerData)}%
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative w-full h-[calc(100vh-80px)] overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-xl"></div>
        </div>

        {/* Game Items */}
        {gameItems.map(item => (
          <window.ItemCard
            key={item.uniqueId}
            item={item}
            position={item.position}
            onExtract={handleExtractItem}
            extractable={gameState === 'playing'}
          />
        ))}

        {/* Particle Effects */}
        {showParticles.map(particle => (
          <div
            key={particle.id}
            className={`absolute pointer-events-none animate-bounce z-50 font-bold text-lg ${
              particle.color || 'text-green-400'
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {particle.text}
          </div>
        ))}
      </div>

      {/* Merge Slots */}
      <window.MergeSlots
        mergeItems={mergeItems}
        onMerge={handleMerge}
        onSlotClick={handleSlotClick}
      />

      {/* Game Completed Modal */}
      {gameState === 'completed' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 房间清理完成！</h2>
            <p className="text-gray-700 mb-2">最终分数: {score}</p>
            <p className="text-gray-700 mb-4">获得金币: {roomData.coinReward}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                再次挑战
              </button>
              <button
                onClick={onBackToLobby}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                返回大厅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad Offer Modal */}
      {showAdOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">需要帮助？</h2>
            <p className="text-gray-700 mb-4">
              物品不够了！观看广告获得更多物品和奖励金币。
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleWatchAd}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                📺 观看广告 (+5物品 +20金币)
              </button>
              <button
                onClick={() => setGameState('failed')}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                放弃本局
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Failed Modal */}
      {gameState === 'failed' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-red-600">游戏结束</h2>
            <p className="text-gray-700 mb-4">
              分数: {score}/{targetScore}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                重新开始
              </button>
              <button
                onClick={onBackToLobby}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                返回大厅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.GameScene = GameScene;