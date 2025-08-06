
import { useState } from 'react';
import './App.css'
import GameArea from './components/GameArea'
import { useGameLoop } from './hooks/useGameLoop';
import Item from './components/Item';
import CatchZone from './components/CatchZone';
import useInput from './hooks/useInput';
import ScoreBoard from './components/ScoreBoard';
import { useTimer } from './hooks/useTimer';
import { useGameOver } from './hooks/useGameOver';
import { useCatch } from './hooks/useCatch';
import { useSpawnAndPhysics } from './hooks/useSpawnAndPhysics';
import { type GameState, type ItemType } from './types';
import { GameOverOverlay } from './components/GameOverOverlay';
// 定数の定義
const BOX_SIZE = 500; 
const ITEM_SIZE = 20;
const SPAWN_INTERVAL = 1000; // ms 1秒ごとにアイテムを生成
const MISS_COUNT_THRESHOLD = 10; 

// キャッチゾーンのY座標
const GAME_AREA_HEIGHT = 620;
const CATCH_ZONE_HEIGHT = 50;

function App() {
  
  const [items, setItems] = useState<ItemType[]>([]);
  const [score, setScore] = useState(0); 
  const [missCount, setMissCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('GameOver'); // 初期状態はゲームオーバー
  const [timerEnabled, setTimerEnabled] = useState(false);
  const timeLeft = useTimer(60, timerEnabled);
  const CatchZoneY = GAME_AREA_HEIGHT - CATCH_ZONE_HEIGHT; 


  const { update, applyPhysics } = useSpawnAndPhysics({
  spawnInterval: SPAWN_INTERVAL,
  maxX: BOX_SIZE,
  itemSize: ITEM_SIZE,
  gameAreaHeight: GAME_AREA_HEIGHT,
  onMiss: count => setMissCount(m => m + count),
  setItems,
  });

  useGameLoop((dt) => {
    if (gameState === 'Playing') { 
      update(dt); 
      setItems(prevItems => applyPhysics(prevItems, dt)); 
    }
  });


  const catchHandler = useCatch({
    items,
    itemSize: ITEM_SIZE,
    catchZoneY : CatchZoneY,
    onHit: (id, scoreDelta) => {
      setScore(s => s + scoreDelta); 
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // キャッチしたアイテムを削除
    },
    onMiss: (id) => {
      setMissCount(m => m + 1); 
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // ミスしたアイテムを削除
    }
  });

  useInput(catchHandler)

  useGameOver({
    timeLeft,
    missCount,
    thresholdMiss: MISS_COUNT_THRESHOLD,
    thresholdTime: 0, 
    onReset: () => {
      endGame();
    },
    gameState: gameState, 
    });


  const startGame = () => {
    setGameState('Playing');
    setItems([]);
    setScore(0);
    setMissCount(0);
    timeLeft.reset();
    setTimerEnabled(true); 
  };

  const endGame = () => {
    setGameState('GameOver');
    setTimerEnabled(false);
  };



  return (
    <div className="app-root">
      <GameArea 
        width={BOX_SIZE} 
        height={GAME_AREA_HEIGHT}
      >
        {
          gameState === 'Playing' && (
            <ScoreBoard 
              score={score} 
              missCount={missCount} 
              timeLeft={timeLeft.timeLeft}
            />
          )
        }
        {
          gameState === 'GameOver' && (
            <div className="game-over">
              <button onClick={() => startGame()}>START</button>
            </div>
          )}

          {
          gameState === `GameOver` && (
            <GameOverOverlay
              score={score}
              missCount={missCount}
            />
          )}

        {items.map(item => (
          <Item key={item.id} x={item.x} y={item.y} size={ITEM_SIZE} />
        ))}

         <CatchZone y={CatchZoneY} height={CATCH_ZONE_HEIGHT} />

      </GameArea>
      
    </div>
  )
}

export default App
