import React, { useEffect } from 'react';

function MergeSlots({ mergeItems, onMerge, onSlotClick }) {
  // Check for merge when items change
  useEffect(() => {
    const filledSlots = mergeItems.filter(item => item !== null);
    
    if (filledSlots.length === 3) {
      // Check if all items are the same
      const firstItemId = filledSlots[0].id;
      const allSame = filledSlots.every(item => item.id === firstItemId);
      
      if (allSame) {
        const itemData = window.GameData.items[firstItemId];
        if (itemData && itemData.mergeTo) {
          // Trigger merge after a short delay for visual effect
          setTimeout(() => {
            onMerge(itemData.mergeTo);
          }, 500);
        }
      }
    }
  }, [mergeItems, onMerge]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="text-white text-center mb-2 text-sm font-semibold">
          合成槽位 (需要3个相同物品)
        </div>
        
        <div className="flex space-x-3">
          {mergeItems.map((item, index) => (
            <div
              key={index}
              className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                item ? 'border-green-400 bg-green-400/20' : 'border-gray-400 bg-gray-800/50 hover:bg-gray-700/50'
              }`}
              onClick={() => onSlotClick(index)}
            >
              {item ? (
                <div className="relative">
                  <img
                    src={window.GameData.items[item.id]?.image}
                    alt={window.GameData.items[item.id]?.name}
                    className="w-10 h-10 object-contain"
                  />
                  
                  {/* Merge animation when 3 items are ready */}
                  {mergeItems.filter(i => i && i.id === item.id).length === 3 && (
                    <div className="absolute inset-0 bg-yellow-400/50 rounded animate-ping"></div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-2xl">+</div>
              )}
            </div>
          ))}
        </div>
        
        {/* Merge progress indicator */}
        <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(mergeItems.filter(item => item !== null).length / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

window.MergeSlots = MergeSlots;