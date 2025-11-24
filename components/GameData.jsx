import React from 'react';

// Game data definitions
window.GameData = {
  items: {
    // Tier 1 - Basic items
    'glowing-bottle': {
      id: 'glowing-bottle',
      name: '发光瓶子',
      tier: 1,
      rarity: 'common',
      image: 'assets/glowing-bottle.webp',
      description: '装满神秘光芒的小瓶子',
      mergeTo: 'magic-potion'
    },
    'eye-book': {
      id: 'eye-book',
      name: '眼睛古书',
      tier: 1,
      rarity: 'common',
      image: 'assets/eye-book.webp',
      description: '封面长着一只眼睛的神秘古书',
      mergeTo: 'wisdom-tome'
    },
    'heart-container': {
      id: 'heart-container',
      name: '心脏容器',
      tier: 1,
      rarity: 'common',
      image: 'assets/heart-container.webp',
      description: '装着跳动心脏的玻璃容器',
      mergeTo: 'life-essence'
    },
    'broken-dagger': {
      id: 'broken-dagger',
      name: '破损匕首',
      tier: 1,
      rarity: 'common',
      image: 'assets/broken-dagger.webp',
      description: '锈迹斑斑的破旧匕首',
      mergeTo: 'short-sword'
    },
    
    // Tier 2 - Merged items
    'magic-potion': {
      id: 'magic-potion',
      name: '魔法药水',
      tier: 2,
      rarity: 'rare',
      image: 'assets/glowing-bottle.webp',
      description: '由发光瓶子合成的强力药水',
      mergeTo: 'elixir-of-life'
    },
    'wisdom-tome': {
      id: 'wisdom-tome',
      name: '智慧典籍',
      tier: 2,
      rarity: 'rare',
      image: 'assets/eye-book.webp',
      description: '汇聚古老智慧的法典',
      mergeTo: 'arcane-codex'
    },
    'life-essence': {
      id: 'life-essence',
      name: '生命精华',
      tier: 2,
      rarity: 'rare',
      image: 'assets/heart-container.webp',
      description: '蕴含生命力的神秘精华',
      mergeTo: 'soul-crystal'
    },
    'short-sword': {
      id: 'short-sword',
      name: '完整短剑',
      tier: 2,
      rarity: 'rare',
      image: 'assets/short-sword.webp',
      description: '重新锻造的锋利短剑',
      mergeTo: 'enchanted-blade'
    },
    
    // Tier 3 - Legendary items
    'elixir-of-life': {
      id: 'elixir-of-life',
      name: '生命灵药',
      tier: 3,
      rarity: 'legendary',
      image: 'assets/glowing-bottle.webp',
      description: '传说中的不朽灵药'
    },
    'arcane-codex': {
      id: 'arcane-codex',
      name: '奥术法典',
      tier: 3,
      rarity: 'legendary',
      image: 'assets/eye-book.webp',
      description: '记录着禁忌魔法的古老法典'
    },
    'soul-crystal': {
      id: 'soul-crystal',
      name: '灵魂水晶',
      tier: 3,
      rarity: 'legendary',
      image: 'assets/heart-container.webp',
      description: '蕴含纯净灵魂力量的水晶'
    },
    'enchanted-blade': {
      id: 'enchanted-blade',
      name: '附魔之刃',
      tier: 3,
      rarity: 'legendary',
      image: 'assets/short-sword.webp',
      description: '散发魔法光芒的传奇武器'
    }
  },

  rooms: {
    'starter-room': {
      id: 'starter-room',
      name: '新手杂物间',
      description: '充满基础魔法物品的房间',
      unlockCost: 0,
      unlocked: true,
      itemPool: ['glowing-bottle', 'eye-book', 'heart-container', 'broken-dagger'],
      clearTarget: 20,
      coinReward: 50,
      background: 'from-purple-900 via-blue-900 to-indigo-900'
    },
    'vampire-library': {
      id: 'vampire-library',
      name: '吸血鬼书房',
      description: '堆满古老典籍和魔法器具的书房',
      unlockCost: 100,
      unlocked: false,
      itemPool: ['eye-book', 'heart-container', 'glowing-bottle'],
      clearTarget: 30,
      coinReward: 80,
      background: 'from-red-900 via-purple-900 to-gray-900'
    },
    'mechanical-workshop': {
      id: 'mechanical-workshop',
      name: '机械车间',
      description: '充满齿轮和魔法机械的工坊',
      unlockCost: 200,
      unlocked: false,
      itemPool: ['broken-dagger', 'glowing-bottle'],
      clearTarget: 25,
      coinReward: 100,
      background: 'from-gray-800 via-yellow-700 to-orange-800'
    },
    'deep-sea-treasury': {
      id: 'deep-sea-treasury',
      name: '深海宝库',
      description: '沉没在海底的神秘宝藏室',
      unlockCost: 350,
      unlocked: false,
      itemPool: ['heart-container', 'eye-book', 'broken-dagger', 'glowing-bottle'],
      clearTarget: 40,
      coinReward: 150,
      background: 'from-blue-900 via-teal-800 to-cyan-900'
    }
  },

  getRarityColor: (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  },

  getRandomItem: (roomId) => {
    const room = window.GameData.rooms[roomId];
    if (!room) return null;
    
    const randomIndex = Math.floor(Math.random() * room.itemPool.length);
    return room.itemPool[randomIndex];
  }
};