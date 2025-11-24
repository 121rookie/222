import React from 'react';

function ItemCard({ item, position, onExtract, extractable = true, showGlow = false }) {
  const itemData = window.GameData.items[item.id];
  
  if (!itemData) return null;

  const handleClick = () => {
    if (extractable && onExtract) {
      onExtract(item);
    }
  };

  const rarityGradient = window.GameData.getRarityColor(itemData.rarity);

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-110 hover:z-50 ${
        showGlow ? 'animate-pulse' : ''
      } ${extractable ? 'hover:drop-shadow-2xl' : 'opacity-75'}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) rotate(${position.rotation || 0}deg) scale(${position.scale || 1})`,
        zIndex: position.z || 1
      }}
      onClick={handleClick}
    >
      <div className={`relative p-2 rounded-lg bg-gradient-to-br ${rarityGradient} shadow-lg border-2 border-white/30`}>
        <img
          src={itemData.image}
          alt={itemData.name}
          className="w-12 h-12 object-contain"
          draggable={false}
        />
        
        {/* Tier indicator */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black">
          {itemData.tier}
        </div>
        
        {/* Glow effect for special items */}
        {showGlow && (
          <div className="absolute inset-0 rounded-lg bg-yellow-400/30 animate-ping"></div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {itemData.name}
      </div>
    </div>
  );
}

window.ItemCard = ItemCard;