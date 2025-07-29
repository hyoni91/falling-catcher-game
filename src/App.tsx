
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css'
import GameArea from './components/GameArea'
import { useGameLoop } from './hooks/useGameLoop';
import Item from './components/Item';
import CatchZone from './components/CatchZone';
import useInput from './hooks/useInput';
import ScoreBoard from './components/ScoreBoard';
import { useTimer } from './hooks/useTimer';

// 定数の定義
const ITEM_SIZE = 20;
const SPAWN_INTERVAL = 1000; // ms 1秒ごとにアイテムを生成
const MISS_COUNT_THRESHOLD = 10; // ミスカウントの閾値

// キャッチゾーンのY座標
const GAME_AREA_HEIGHT = 700;
const CATCH_ZONE_HEIGHT = 50;

function App() {
  const [items, setItems] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);
  const [score, setScore] = useState(0); 
  const [missCount, setMissCount] = useState(0); 
  const nextId = useRef(0);
  const spawnTimer = useRef(0); // アイテム生成のタイマー(next idを生成する間の時間)
  const timeLeft = useTimer(60); 
  const CatchZoneY = GAME_AREA_HEIGHT - CATCH_ZONE_HEIGHT; 


  const onGameOver = useCallback(() => {
    // ゲームオーバー時の処理
    alert(`Game Over! Your score: ${score}`);

    // リセット
    setItems([]);
    setScore(0);
    setMissCount(0);
    nextId.current = 0;
    spawnTimer.current = 0;

    timeLeft.reset(); // タイマーをリセット

  }, [score, timeLeft]);

    useEffect(() => {
      if (timeLeft.timeLeft <= 0 || missCount >= MISS_COUNT_THRESHOLD) {
        onGameOver(); // タイマーが0になったらゲームオーバー
      }
    }, [timeLeft, missCount, onGameOver]);


    const update = useCallback((dt: number) => {
      spawnTimer.current += dt; // タイマーを更新
      if (spawnTimer.current >= SPAWN_INTERVAL) {
        spawnTimer.current = 0; // タイマーをリセット
        const newItem = {
          id: nextId.current++,
          x: Math.random() * 400, // 0から400の範囲でランダムなX座標
          y: 40, // Y座標は0からスタート
          speed: Math.random() * (5 - 2) + 2, //  px/frame (60fpsで120-360px/s) 
          //  Math.random() * (max – min) + min 乱数を生成 

          size: ITEM_SIZE
        };
        setItems((prevItems) => [...prevItems, newItem]); // 新しいアイテムを追加
      }

      setItems(prev => {
        let missed = 0;
        const nextItems = prev
          .map(item => ({
            ...item,
            y: item.y + item.speed * (dt / (1000 / 60)),
          }))
          .filter(item => {
            if (item.y <= GAME_AREA_HEIGHT) {
              return true;  // アイテムがゲームエリア内にある場合は残す
            }
            // 底下に出たアイテムはMiss
            missed += 1;
            return false;   // 配列から削除
          });

        if (missed > 0) {
          setMissCount(m => m + missed);
        }
        return nextItems;
      });

    }, []);

    useGameLoop(update); // ゲームループを開始


    const handleCatch = useCallback(() => {
      setItems(prevItems => {
      if (prevItems.length === 0) return prevItems; // アイテムがない場合は何もしない

        // 1) 各アイテムの距離を計算
        const distances = prevItems.map(item => {
          const itemBottom = item.y + ITEM_SIZE;
          return {
          id: item.id,
          distance: Math.abs(itemBottom - CatchZoneY),
        };
      });

      // 2) 最小距離アイテム選択
      const nearest = distances.reduce((best, cur) =>
        cur.distance < best.distance ? cur : best
      , distances[0]);

      console.log('nearest', nearest);
      // 3) 判定基準を適用
      if (nearest.distance <= 10) {
        setScore(s => s + 100);       // Perfect
      } else if (nearest.distance <= 20) {
        setScore(s => s + 50);        // Good
      } else {
        setMissCount(m => m + 1);     // Miss
      }
      
      return prevItems.filter(item => item.id !== nearest.id); // 잡은 아이템 제거
    });
    
  }, [CatchZoneY]);

    useInput(handleCatch);

  return (
    <>
      <GameArea 
        width={500} 
        height={GAME_AREA_HEIGHT}
      >
        <h1>ゲームエリア</h1>
         <CatchZone y={CatchZoneY} height={CATCH_ZONE_HEIGHT} />

        {items.map(item => (
          <Item key={item.id} x={item.x} y={item.y} size={ITEM_SIZE} />
        ))}
      </GameArea>
      <ScoreBoard 
        score={score}
        missCount={missCount}
        timeLeft={timeLeft.timeLeft}
      />
    </>
  )
}

export default App
