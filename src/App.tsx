
import { useCallback, useEffect, useRef, useState } from 'react';
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


    // ゲームオーバーの状態を管理するカスタムフックを使用
    const { checkGameOver } = useGameOver({
      timeLife: timeLeft,
      missCount,
      score,
      thresholdMiss: MISS_COUNT_THRESHOLD,
      thresholdTime: 0, // タイマーの閾値は0に設定
      onReset: () => {
        setItems([]);
        setScore(0);
        setMissCount(0);
        nextId.current = 0;
        spawnTimer.current = 0;
        timeLeft.reset(); // タイマーをリセット
      }
    })

    useEffect(()=>{
      checkGameOver(); // 初期状態でゲームオーバーをチェック
    },[checkGameOver, timeLeft.timeLeft, missCount]);

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

  const catchHandler = useCatch({
    items,
    itemSize: ITEM_SIZE,
    CatchZoneY,
    onHit: (id, scoreDelta) => {
      setScore(s => s + scoreDelta); // アイテムをキャッチしたときのスコア更新
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // キャッチしたアイテムを削除
    },
    onMiss: (id) => {
      setMissCount(m => m + 1); // ミスカウントを増やす
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // ミスしたアイテムを削除
    }
  });

  useInput(catchHandler); // キーボード入力を設定

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
