
import {  useCallback, useRef, useState } from 'react';
import './App.css'
import GameArea from './components/GameArea'
import { useGameLoop } from './hooks/useGameLoop';
import Item from './components/Item';
import CatchZone from './components/CatchZone';
import useInput from './hooks/useInput';

// 定数の定義
const ITEM_SIZE = 20;
const SPAWN_INTERVAL = 1000; // ms 1秒ごとにアイテムを生成

// キャッチゾーンのY座標
const GAME_AREA_HEIGHT = 700;
const CATCH_ZONE_HEIGHT = 50;


function App() {

  const [items, setItems] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);
  const nextId = useRef(0);
  const spawnTimer = useRef(0); // アイテム生成のタイマー(next idを生成する間の時間)
  const CatchZoneY = GAME_AREA_HEIGHT - CATCH_ZONE_HEIGHT; // キャッチゾーンのY座標
  const [score, setScore] = useState(0); // スコアの状態
  const [missCount, setMissCount] = useState(0); // ミスのカウント

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
            return true;  // 아직 화면 안
          }
          // 바닥 아래로 나간 아이템은 Miss
          missed += 1;
          return false;   // 배열에서 제거
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

      // 1) 각 아이템의 거리 계산
      const distances = prevItems.map(item => {
        const itemBottom = item.y + ITEM_SIZE;
        return {
        id: item.id,
        distance: Math.abs(itemBottom - CatchZoneY),
      };
    });

    // 2) 최소 거리 아이템 선택
    const nearest = distances.reduce((best, cur) =>
      cur.distance < best.distance ? cur : best
    , distances[0]);

    console.log('nearest', nearest);
    // 3) 판정 기준 적용
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

        <div className="hud">
        <span>Score: {score} </span>
        <span>Miss: {missCount}</span>
      </div>
    </>
  )
}

export default App
