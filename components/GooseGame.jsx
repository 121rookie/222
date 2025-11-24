import React, { useState, useEffect, useRef, useCallback } from 'react';

function GooseGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [geese, setGeese] = useState([]);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('gooseHighScore')) || 0);
  const gameAreaRef = useRef(null);
  const gameTimerRef = useRef(null);
  const gooseSpawnRef = useRef(null);

  // Generate random position for goose
  const getRandomPosition = useCallback(() => {
    if (!gameAreaRef.current) return { x: 0, y: 0 };
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const gooseSize = 80; // Approximate goose size
    
    return {
      x: Math.random() * (gameArea.width - gooseSize),
      y: Math.random() * (gameArea.height - gooseSize)
    };
  }, []);

  // Create new goose
  const createGoose = useCallback(() => {
    const newGoose = {
      id: Date.now() + Math.random(),
      ...getRandomPosition(),
      vx: (Math.random() - 0.5) * 4, // Random velocity X
      vy: (Math.random() - 0.5) * 4, // Random velocity Y
      life: 3 + Math.random() * 4, // Goose lives for 3-7 seconds
    };
    
    setGeese(prev => [...prev, newGoose]);
  }, [getRandomPosition]);

  // Update goose positions
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateInterval = setInterval(() => {
      setGeese(prev => prev.map(goose => {
        if (!gameAreaRef.current) return goose;
        
        const gameArea = gameAreaRef.current.getBoundingClientRect();
        let newX = goose.x + goose.vx;
        let newY = goose.y + goose.vy;
        let newVx = goose.vx;
        let newVy = goose.vy;

        // Bounce off walls
        if (newX <= 0 || newX >= gameArea.width - 80) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(newX, gameArea.width - 80));
        }
        
        if (newY <= 0 || newY >= gameArea.height - 80) {
          newVy = -newVy;
          newY = Math.max(0, Math.min(newY, gameArea.height - 80));
        }

        return {
          ...goose,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          life: goose.life - 0.05
        };
      }).filter(goose => goose.life > 0)); // Remove geese that have lived their life
    }, 50);

    return () => clearInterval(updateInterval);
  }, [gameState]);

  // Spawn geese periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    gooseSpawnRef.current = setInterval(() => {
      if (Math.random() < 0.7) { // 70% chance to spawn a goose
        createGoose();
      }
    }, 1500);

    return () => clearInterval(gooseSpawnRef.current);
  }, [gameState, createGoose]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameState]);

  // Handle goose catch
  const catchGoose = (gooseId) => {
    setGeese(prev => prev.filter(goose => goose.id !== gooseId));
    setScore(prev => prev + 10);
    
    // Add visual feedback
    const points = document.createElement('div');
    points.textContent = '+10';
    points.className = 'absolute text-2xl font-bold text-yellow-400 pointer-events-none animate-bounce';
    points.style.left = '50%';
    points.style.top = '50%';
    points.style.transform = 'translate(-50%, -50%)';
    points.style.zIndex = '1000';
    
    if (gameAreaRef.current) {
      gameAreaRef.current.appendChild(points);
      setTimeout(() => points.remove(), 1000);
    }
  };

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGeese([]);
    setGameState('playing');
    
    // Spawn initial geese
    setTimeout(() => createGoose(), 500);
    setTimeout(() => createGoose(), 1000);
  };

  // End game
  useEffect(() => {
    if (gameState === 'gameOver') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('gooseHighScore', score.toString());
      }
      
      // Clear all intervals
      clearInterval(gameTimerRef.current);
      clearInterval(gooseSpawnRef.current);
      setGeese([]);
    }
  }, [gameState, score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl mb-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-lg">
          🦢 抓大鹅游戏 🦢
        </h1>
        
        {/* Game Stats */}
        <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">分数</span>
            <span className="text-2xl font-bold text-yellow-300">{score}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">时间</span>
            <span className="text-2xl font-bold text-red-300">{timeLeft}s</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">最高分</span>
            <span className="text-2xl font-bold text-green-300">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative flex-1 w-full max-w-4xl">
        <div
          ref={gameAreaRef}
          className="relative w-full h-96 md:h-[500px] bg-gradient-to-b from-sky-200 to-green-200 rounded-xl border-4 border-white shadow-2xl overflow-hidden"
        >
          {/* Clouds background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full"></div>
            <div className="absolute top-6 left-20 w-12 h-6 bg-white rounded-full"></div>
            <div className="absolute top-8 right-16 w-20 h-10 bg-white rounded-full"></div>
            <div className="absolute top-12 right-32 w-14 h-7 bg-white rounded-full"></div>
          </div>

          {/* Game State Messages */}
          {gameState === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">准备抓大鹅！</h2>
                <p className="text-lg mb-6">点击移动的大鹅来获得分数</p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-xl rounded-full hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  开始游戏
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white bg-white/20 backdrop-blur-sm rounded-xl p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">游戏结束！</h2>
                <p className="text-xl mb-2">你的分数: <span className="text-yellow-300 font-bold">{score}</span></p>
                <p className="text-lg mb-6">最高分数: <span className="text-green-300 font-bold">{highScore}</span></p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  再玩一次
                </button>
              </div>
            </div>
          )}

          {/* Geese */}
          {geese.map(goose => (
            <div
              key={goose.id}
              className="absolute cursor-pointer transform hover:scale-110 transition-transform duration-100"
              style={{
                left: `${goose.x}px`,
                top: `${goose.y}px`,
                transform: `scale(${0.8 + Math.sin(Date.now() * 0.01 + goose.id) * 0.2})`
              }}
              onClick={() => catchGoose(goose.id)}
            >
              <img
                src="assets/goose.webp"
                alt="Goose"
                className="w-20 h-20 drop-shadow-lg animate-bounce"
                style={{
                  animationDuration: `${1 + Math.random()}s`,
                  animationDelay: `${Math.random()}s`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-white/80 max-w-2xl">
        <p className="text-lg">
          快速点击移动的大鹅来获得分数！每只大鹅值10分。
        </p>
        <p className="text-sm mt-2">
          大鹅会在30秒内不断出现，试着抓到尽可能多的大鹅！
        </p>
      </div>
    </div>
  );
}

window.GooseGame = GooseGame;