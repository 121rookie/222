import React, { useState } from 'react';

function Lobby({ playerData, onUpdatePlayerData, onEnterRoom, onViewCollection }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(null);

  const rooms = window.GameData.rooms;

  // Check for daily reward
  React.useEffect(() => {
    const lastRewardTime = playerData.lastDailyReward || 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - lastRewardTime > oneDay) {
      setShowDailyReward(true);
    }
  }, [playerData]);

  const handleClaimDailyReward = () => {
    const updatedPlayerData = { ...playerData };
    window.GameStorage.addCoins(updatedPlayerData, 50);
    updatedPlayerData.lastDailyReward = Date.now();
    onUpdatePlayerData(updatedPlayerData);
    setShowDailyReward(false);
  };

  const handleUnlockRoom = (roomId) => {
    const room = rooms[roomId];
    if (playerData.coins >= room.unlockCost) {
      const updatedPlayerData = { ...playerData };
      updatedPlayerData.coins -= room.unlockCost;
      window.GameStorage.unlockRoom(updatedPlayerData, roomId);
      onUpdatePlayerData(updatedPlayerData);
      setShowUnlockModal(null);
    }
  };

  const getRoomCardClass = (room) => {
    const isUnlocked = window.GameStorage.isRoomUnlocked(playerData, room.id);
    if (isUnlocked) {
      return 'border-green-400 hover:border-green-300 hover:bg-green-400/10 cursor-pointer';
    }
    return 'border-gray-600 opacity-75 hover:border-gray-500';
  };

  const collectionProgress = window.GameStorage.getCollectionProgress(playerData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              ✨ 奇幻杂物间 ✨
            </h1>
            <p className="text-blue-200">探索神秘房间，收集奇幻物品</p>
          </div>
          
          <div className="text-right text-white">
            <div className="text-2xl font-bold text-yellow-400">💰 {playerData.coins}</div>
            <div className="text-sm text-blue-200">金币</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center text-white">
            <div className="text-3xl font-bold text-green-400">{collectionProgress}%</div>
            <div className="text-sm text-gray-300">收集进度</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center text-white">
            <div className="text-3xl font-bold text-blue-400">
              {playerData.unlockedRooms?.length || 1}
            </div>
            <div className="text-sm text-gray-300">已解锁房间</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center text-white">
            <div className="text-3xl font-bold text-purple-400">
              {playerData.stats?.totalGamesPlayed || 0}
            </div>
            <div className="text-sm text-gray-300">游戏局数</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={onViewCollection}
            className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📚 查看图鉴 ({collectionProgress}% 完成)
          </button>
          
          <button
            onClick={() => setShowDailyReward(true)}
            className="p-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🎁 每日奖励 (50金币)
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🏠 选择房间</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Object.values(rooms).map(room => {
              const isUnlocked = window.GameStorage.isRoomUnlocked(playerData, room.id);
              
              return (
                <div
                  key={room.id}
                  className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 ${getRoomCardClass(room)}`}
                  onClick={() => {
                    if (isUnlocked) {
                      onEnterRoom(room.id);
                    } else if (playerData.coins >= room.unlockCost) {
                      setShowUnlockModal(room.id);
                    }
                  }}
                >
                  {/* Room Background */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${room.background} opacity-20`}></div>
                  
                  <div className="relative z-10">
                    {/* Lock/Unlock Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-2xl">
                        {isUnlocked ? '🔓' : '🔒'}
                      </div>
                      
                      {!isUnlocked && (
                        <div className="text-yellow-400 font-bold">
                          💰 {room.unlockCost}
                        </div>
                      )}
                    </div>

                    {/* Room Info */}
                    <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Room Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>目标分数:</span>
                        <span className="text-white font-semibold">{room.clearTarget}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-300">
                        <span>奖励金币:</span>
                        <span className="text-yellow-400 font-semibold">{room.coinReward}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      {isUnlocked ? (
                        <div className="text-center text-green-400 font-semibold">
                          点击进入 →
                        </div>
                      ) : playerData.coins >= room.unlockCost ? (
                        <div className="text-center text-yellow-400 font-semibold">
                          点击解锁
                        </div>
                      ) : (
                        <div className="text-center text-red-400 font-semibold">
                          金币不足
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Tips */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-3">🎯 游戏提示</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>• 点击物品将其提取到合成槽</div>
            <div>• 3个相同物品可以合成更高级的物品</div>
            <div>• 合成成功可获得额外金币奖励</div>
            <div>• 收集所有物品完成图鉴</div>
          </div>
        </div>
      </div>

      {/* Daily Reward Modal */}
      {showDailyReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-4 text-yellow-600">🎁 每日奖励</h2>
            <p className="text-gray-700 mb-6">
              恭喜！您获得了每日登录奖励！
            </p>
            
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <div className="text-2xl font-bold text-yellow-700">+50 金币</div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleClaimDailyReward}
                className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
              >
                领取奖励
              </button>
              <button
                onClick={() => setShowDailyReward(false)}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                稍后领取
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Room Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              解锁房间
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {rooms[showUnlockModal]?.name}
              </h3>
              <p className="text-gray-600 mt-2">
                {rooms[showUnlockModal]?.description}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="text-xl font-bold text-gray-800">
                花费: {rooms[showUnlockModal]?.unlockCost} 金币
              </div>
              <div className="text-sm text-gray-600 mt-1">
                当前: {playerData.coins} 金币
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleUnlockRoom(showUnlockModal)}
                disabled={playerData.coins < rooms[showUnlockModal]?.unlockCost}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                确认解锁
              </button>
              <button
                onClick={() => setShowUnlockModal(null)}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.Lobby = Lobby;