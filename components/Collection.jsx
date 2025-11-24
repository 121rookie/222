import React from 'react';

function Collection({ playerData, onClose }) {
  const allItems = window.GameData.items;
  const collectedItems = playerData.collectedItems || {};

  const getItemsByTier = (tier) => {
    return Object.values(allItems).filter(item => item.tier === tier);
  };

  const getTierTitle = (tier) => {
    switch (tier) {
      case 1: return '基础物品';
      case 2: return '稀有物品';
      case 3: return '传奇物品';
      default: return '未知物品';
    }
  };

  const totalItems = Object.keys(allItems).length;
  const collectedCount = Object.keys(collectedItems).length;
  const completionRate = Math.round((collectedCount / totalItems) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">📚 物品图鉴</h1>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            返回大厅
          </button>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-2">收集进度</h2>
            <div className="text-4xl font-bold text-yellow-400 mb-2">{completionRate}%</div>
            <div className="text-lg">已收集 {collectedCount}/{totalItems} 种物品</div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Items by Tier */}
        {[1, 2, 3].map(tier => (
          <div key={tier} className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-3 ${
                tier === 1 ? 'bg-gray-400' : tier === 2 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}></span>
              {getTierTitle(tier)}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {getItemsByTier(tier).map(item => {
                const collected = collectedItems[item.id] || 0;
                const isCollected = collected > 0;
                
                return (
                  <div
                    key={item.id}
                    className={`relative bg-white/10 backdrop-blur-sm rounded-lg p-4 border-2 transition-all duration-300 ${
                      isCollected
                        ? 'border-green-400 hover:border-green-300 hover:bg-green-400/20'
                        : 'border-gray-600 opacity-50'
                    }`}
                  >
                    {/* Item Image */}
                    <div className="aspect-square mb-2 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-contain ${
                          isCollected ? '' : 'filter grayscale'
                        }`}
                      />
                      
                      {/* Collection count */}
                      {isCollected && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {collected}
                        </div>
                      )}
                      
                      {/* Lock overlay for uncollected */}
                      {!isCollected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <div className="text-3xl">🔒</div>
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${
                        isCollected ? 'text-white' : 'text-gray-400'
                      }`}>
                        {item.name}
                      </div>
                      
                      {isCollected && (
                        <div className="text-xs text-gray-300 mt-1">
                          {item.description}
                        </div>
                      )}
                      
                      {!isCollected && (
                        <div className="text-xs text-gray-500 mt-1">
                          ??? 未解锁 ???
                        </div>
                      )}
                    </div>

                    {/* Rarity indicator */}
                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full ${
                      item.rarity === 'common' ? 'bg-gray-400' :
                      item.rarity === 'rare' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Collection Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">收集统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {playerData.stats?.totalItemsCollected || 0}
              </div>
              <div className="text-sm text-gray-300">总收集数量</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {playerData.stats?.totalGamesPlayed || 0}
              </div>
              <div className="text-sm text-gray-300">游戏局数</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {playerData.stats?.totalCoinsEarned || 0}
              </div>
              <div className="text-sm text-gray-300">累计金币</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Collection = Collection;